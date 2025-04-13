import { DestroyRef, Directive, HostListener, inject, OnInit, } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { TELEGRAM_BOT_ID } from '../tokens/telegram-bot-id.token';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable, switchMap } from 'rxjs';
import { TelegramUser } from '../interfaces/telegram-user.interface';

@Directive({
    selector: '[telegramLogin]',
    standalone: true,
})
export class TelegramLoginDirective implements OnInit {
    private readonly auth: AuthService = inject(AuthService);
    private readonly router: Router = inject(Router);
    private readonly botId: number = inject(TELEGRAM_BOT_ID);
    private readonly destroy: DestroyRef = inject(DestroyRef);

    ngOnInit(): void {
        this.loadTelegramScript();
    }

    @HostListener('click')
    onClick(): void {
        this.telegramLogin()
            .pipe(
                switchMap(userData => this.auth.loginWithTelegram(userData)),
                takeUntilDestroyed(this.destroy)
            )
            .subscribe({
                next: () => this.router.navigate(['/profile']),
                error: err => console.error('Telegram login error:', err),
            });
    }

    private telegramLogin(): Observable<TelegramUser> {
        return new Observable(observer => {
            (window as any)['Telegram'].Login.auth(
                { bot_id: this.botId, request_access: true },
                (userData: TelegramUser) => {
                    if (!userData) {
                        observer.error('Telegram authentication failed.');
                    } else {
                        observer.next(userData);
                        observer.complete();
                    }
                }
            );
        });
    }

    private loadTelegramScript(): void {
        if (document.getElementById('telegram-login-script')) {
            return;
        }
        const script = document.createElement('script');
        script.id = 'telegram-login-script';
        script.src = 'https://telegram.org/js/telegram-widget.js?7';
        script.async = true;
        document.head.appendChild(script);
    }
}
