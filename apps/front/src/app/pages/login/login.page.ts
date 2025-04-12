import { Component } from '@angular/core';
import { TuiButton, TuiIcon, TuiSurface } from '@taiga-ui/core';
import { TelegramLoginDirective } from '../../directives/telegram-login.directive';

@Component({
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
    standalone: true,
    imports: [
        TuiButton,
        TuiIcon,
        TuiSurface,
        TelegramLoginDirective,
    ]
})
export class LoginPage {
}
