import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { TelegramUser } from '../interfaces/telegram-user.interface';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private _userSubject = new BehaviorSubject<TelegramUser | null>(null);
    user$: Observable<TelegramUser | null> = this._userSubject.asObservable();

    constructor() {
        const stored = sessionStorage.getItem('telegram_user');
        if (stored) {
            this._userSubject.next(JSON.parse(stored));
        }
    }

    setUser(user: TelegramUser): void {
        this._userSubject.next(user);
        sessionStorage.setItem('telegram_user', JSON.stringify(user));
    }

    clearUser(): void {
        this._userSubject.next(null);
        sessionStorage.removeItem('telegram_user');
    }

    getTelegramId(): string | null {
        const user = sessionStorage.getItem('telegram_user');
        if (user) {
            return JSON.parse(user).id;
        }
        return null;
    }
}
