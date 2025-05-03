import { Component } from '@angular/core';
import { TuiButton, TuiSurface } from '@taiga-ui/core';
import { TelegramLoginDirective } from '../../directives/telegram-login.directive';

@Component({
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
    standalone: true,
    imports: [
        TuiButton,
        TuiSurface,
        TelegramLoginDirective,
    ]
})
export class LoginPage {
}
