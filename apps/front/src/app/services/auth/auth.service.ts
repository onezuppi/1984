import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, Observable, of, tap, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
    public get accessToken$() {
        return this._access_token$.asObservable();
    }

    public get refreshToken(): string | null {
        return localStorage.getItem(this._refreshTokenKey);
    }
    public set refreshToken(value: string) {
        localStorage.setItem(this._refreshTokenKey, value);
    }

    public get isAuthenticated() {
        return !!this.refreshToken;
    }
    private readonly _http  = inject(HttpClient);
    private readonly _router = inject(Router);

    private readonly _refreshTokenKey = '_auth_refresh_token';
    private _access_token$ = new BehaviorSubject('')

    public loginWithTelegram(token: string): Observable<boolean> {
        return this._http.get<{ access_token: string, refresh_token: string }>(`/api/auth/by-token`, {
            params: { token }
        })
            .pipe(
                map(response => {
                    this._access_token$.next(response.access_token);
                    localStorage.setItem(this._refreshTokenKey, response.refresh_token);

                    return true;
                }),
                catchError(() => of(false)),
            );
    }

    public refreshAccessToken(): Observable<boolean> {

        if (!this.refreshToken) {
            return throwError(() => new Error('No refresh token'));
        }
        return this._http.post<{ access_token: string; refresh_token?: string }>(
            '/api/auth/refresh',
            { refresh_token: this.refreshToken }
        )
            .pipe(
                map(response => {
                    this._access_token$.next(response.access_token);
                    if (response.refresh_token) {
                        this.refreshToken = response.refresh_token;
                    }

                    return true;
                }),
                catchError(() => of(false)),
            );
    }

    /** Выход из аккаунта */
    public logout(): void {
        this._access_token$.next('');
        localStorage.removeItem(this._refreshTokenKey);

        this._router.navigate(['/']);
    }
}
