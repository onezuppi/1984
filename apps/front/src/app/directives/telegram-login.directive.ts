// src/app/telegram-login.directive.ts
import { AfterViewInit, Directive, ElementRef, inject, NgZone } from '@angular/core';
import { TELEGRAM_BOT_NAME } from '../tokens/app-config.token';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Directive({
    selector: '[telegramLogin]',
    standalone: true
})
export class TelegramLoginDirective implements AfterViewInit {
    private readonly el: ElementRef = inject(ElementRef);
    private readonly ngZone: NgZone = inject(NgZone);
    private readonly auth: AuthService = inject(AuthService);
    private readonly router: Router = inject(Router);
    private readonly botName: string = inject(TELEGRAM_BOT_NAME);

    ngAfterViewInit(): void {
        (window as any)['loginViaTelegram'] = (userData: any) => {
            // Запуск в зоне Angular
            this.ngZone.run(() => {
                console.log('Telegram auth data:', userData);
                this.auth.loginWithTelegram(userData).subscribe({
                    next: () => {
                        this.router.navigate(['/profile']);
                    },
                    error: (err) => {
                        console.error('Ошибка авторизации через Telegram', err);
                    }
                });
            });
        };

        const script = document.createElement('script');
        script.src = 'https://telegram.org/js/telegram-widget.js?19';
        script.setAttribute('data-telegram-login', this.botName);
        script.setAttribute('data-size', 'large');
        script.setAttribute('data-request-access', 'write');
        script.setAttribute('data-onauth', 'loginViaTelegram(user)');
        script.setAttribute('async', 'true');
        this.el.nativeElement.appendChild(script);
    }
}
