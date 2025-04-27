import { Component } from '@angular/core';
import { TuiButton, TuiIcon, TuiSurface } from '@taiga-ui/core';
import { TelegramLoginDirective } from '../../directives/telegram-login.directive';
import { VkLoginBtnComponent } from '../../components/vk-login-btn/vk-login-btn.component';

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
