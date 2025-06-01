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
    private isRefreshing = false;
    private refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return this.authService.accessToken$.pipe(
            take(1),
            switchMap(token => {
                if (token) {
                    if (this.isTokenAlmostExpired(token)) {
                        return this.handleTokenRefresh(req, next);
                    }
                    const authReq = this.addTokenHeader(req, token);
                    return next.handle(authReq).pipe(
                        catchError(err => {
                            if (err instanceof HttpErrorResponse && err.status === 401) {
                                return this.handleTokenRefresh(req, next);
                            }
                            return throwError(() => err);
                        })
                    );
                }
                return next.handle(req);
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
        if (!this.isRefreshing) {
            this.isRefreshing = true;
            this.refreshTokenSubject.next(null);

            return this.authService.refreshAccessToken().pipe(
                switchMap(success => {
                    if (success) {
                        return this.authService.accessToken$.pipe(
                            filter(newToken => !!newToken),
                            take(1),
                            switchMap(newToken => {
                                const authReq = this.addTokenHeader(request, newToken!);
                                return next.handle(authReq);
                            })
                        );
                    } else {
                        this.authService.logout();
                        return throwError(() => new Error('Refresh token failed'));
                    }
                }),
                catchError(err => {
                    this.authService.logout();
                    return throwError(() => err);
                }),
                finalize(() => {
                    this.isRefreshing = false;
                })
            );
        } else {
            return this.refreshTokenSubject.pipe(
                filter(token => token !== null),
                take(1),
                switchMap(token => {
                    const authReq = this.addTokenHeader(request, token!);
                    return next.handle(authReq);
                })
            );
        }
    }
}
