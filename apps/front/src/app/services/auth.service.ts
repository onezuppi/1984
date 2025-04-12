import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { BACKEND_API_URL } from '../tokens/app-config.token';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private readonly tokenKey: string = 'auth_token';
    private readonly http: HttpClient = inject(HttpClient);
    private readonly router: Router = inject(Router);
    private readonly apiUrl: string = inject(BACKEND_API_URL);

    /** Принимает данные от Telegram, отправляет их на бэкенд и возвращает Observable с JWT */
    loginWithTelegram(userData: any): Observable<{ token: string }> {
        return this.http.post<{ token: string }>(`${ this.apiUrl }/auth/telegram`, userData)
            .pipe(
                tap(response => {
                    localStorage.setItem(this.tokenKey, response.token);
                })
            );
    }

    /** Возвращает данные профиля, используя сохранённый JWT */
    getMe(): Observable<{ name: string; avatar: string | null }> {
        const token = localStorage.getItem(this.tokenKey);
        if (!token) {
            this.router.navigate(['/login']);
            throw new Error('Нет токена');
        }
        const headers = new HttpHeaders().set('Authorization', `Bearer ${ token }`);
        return this.http.get<{ name: string; avatar: string | null }>(`${ this.apiUrl }/me`, { headers });
    }

    /** Проверка авторизации */
    isAuthenticated(): boolean {
        return !!localStorage.getItem(this.tokenKey);
    }

    /** Выход из аккаунта */
    logout(): void {
        localStorage.removeItem(this.tokenKey);
        this.router.navigate(['/auth']);
    }
}
