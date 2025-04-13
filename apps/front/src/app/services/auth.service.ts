import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private readonly tokenKey: string = 'auth_token';
    private readonly http: HttpClient = inject(HttpClient);
    private readonly router: Router = inject(Router);

    /** Принимает данные от Telegram, отправляет их на бэкенд и возвращает Observable с JWT */
    loginWithTelegram(userData: any): Observable<{ token: string }> {
        return this.http.post<{ token: string }>(`/api/auth/telegram`, userData)
            .pipe(
                tap(response => {
                    localStorage.setItem(this.tokenKey, response.token);
                })
            );
    }

    /** Возвращает данные профиля, используя сохранённый JWT */
    getUserData(): Observable<{ name: string; avatar: string | null }> {
        const token = localStorage.getItem(this.tokenKey);
        if (!token) {
            this.router.navigate(['/login']);
            throw new Error('Нет токена');
        }
        const headers = new HttpHeaders().set('Authorization', `Bearer ${ token }`);
        return this.http.get<{ name: string; avatar: string | null }>(`/api/me`, { headers });
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
