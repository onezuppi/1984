import { Injectable, inject } from '@angular/core';
import {
    HttpInterceptor,
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpErrorResponse
} from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import {
    catchError,
    filter,
    finalize,
    switchMap,
    take
} from 'rxjs/operators';
import { AuthService } from './auth.service';
import { jwtDecode } from 'jwt-decode';

type JwtPayload = { exp: number };

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    private authService = inject(AuthService);
    private isRefreshing$ = new BehaviorSubject(false);

    public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (req.url.includes('/api/auth/')) {
            return next.handle(req);
        }

        return this.authService.accessToken$
            .pipe(
                take(1),
                switchMap(token => {
                    if (!token || this.isTokenAlmostExpired(token)) {
                        return this.handleTokenRefresh(req, next);
                    }

                    return next.handle(this.addTokenHeader(req, token));
                })
            );
    }

    private addTokenHeader(request: HttpRequest<any>, token: string): HttpRequest<any> {
        return request.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
    }

    private isTokenAlmostExpired(token: string): boolean {
        try {
            const payload = jwtDecode<JwtPayload>(token);
            const nowSeconds = Math.floor(Date.now() / 1000);
            return payload.exp - nowSeconds < 60;
        } catch {
            return true;
        }
    }

    private handleTokenRefresh(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (!this.isRefreshing$.value) {
            this.isRefreshing$.next(true);

            return this.authService.refreshAccessToken()
                .pipe(
                    switchMap(success => {
                        this.isRefreshing$.next(false);
                        if (success) {
                            return this.authService.accessToken$.pipe(
                                filter(newToken => !!newToken),
                                take(1),
                                switchMap(newToken => next.handle(this.addTokenHeader(request, newToken!)))
                            );
                        } else {
                            this.authService.logout();

                            return throwError(() => new Error('Refresh token failed'));
                        }
                    }),
                    catchError(err => {

                        return throwError(() => err);
                    }),
                );
        } else {
            return this.isRefreshing$
                .pipe(
                    filter(isRefreshing => !isRefreshing),
                    take(1),
                    switchMap(() => this.handleTokenRefresh(request, next))
                );
        }
    }
}
