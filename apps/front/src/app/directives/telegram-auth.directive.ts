import { Directive, HostListener, inject } from '@angular/core';
import { TELEGRAM_BOT_ID, TELEGRAM_BOT_NAME } from '../tokens/telegram-config.token';

@Directive({
    selector: '[appTelegramAuth]',
    standalone: true
})
export class TelegramAuthDirective {
    private readonly botId: number = inject(TELEGRAM_BOT_ID);
    private readonly botName: string = inject(TELEGRAM_BOT_NAME);

    @HostListener('click')
    onClick(): void {
        const currentOrigin = window.location.origin;
        // Указываем redirect_url на компонент-обработчик (AuthCallbackComponent)
        const redirectUrl = `${ currentOrigin }/auth-callback`;
        // Формируем OAuth URL для Telegram с redirect_url
        const oauthUrl = `https://oauth.telegram.org/auth?bot_id=${ this.botId }&origin=${ encodeURIComponent(currentOrigin) }&redirect_url=${ encodeURIComponent(redirectUrl) }&embed=1&request_access=write`;
        const authWindow = window.open(oauthUrl, 'TelegramLogin', 'width=500,height=600');
        if (!authWindow) {
            console.error('Popup заблокирован.');
        } else {
            console.log('Всплывающее окно OAuth открыто:', authWindow);
        }
    }
}
