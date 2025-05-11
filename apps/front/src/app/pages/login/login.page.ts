import { Component } from '@angular/core';
import { TelegramLoginDirective } from '../../directives/telegram-login.directive';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardActions, MatCardTitle } from '@angular/material/card';

@Component({
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
    standalone: true,
    imports: [
        TelegramLoginDirective,
        MatButton,
        MatCard,
        MatCardTitle,
        MatCardActions,
        MatButton,
    ]
})
export class LoginPage {
}
