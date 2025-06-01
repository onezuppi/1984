import { Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardActions, MatCardTitle } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { TELEGRAM_BOT_USERNAME } from '../../tokens/telegram-bot-username.token';

@Component({
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
    standalone: true,
    imports: [
        MatButton,
        MatCard,
        MatCardTitle,
        MatCardActions,
        MatButton,
        MatIconModule
    ]
})
export class LoginPage {
    private readonly _tgBotUsername = inject(TELEGRAM_BOT_USERNAME);

    public login(): void {
        document.location.href = `https://t.me/${this._tgBotUsername}?start=start`;
    }
}
