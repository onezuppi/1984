import { Component } from '@angular/core';
import { TuiButton, TuiIcon, TuiSurface } from '@taiga-ui/core';

@Component({
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
    standalone: true,
    imports: [
        TuiButton,
        TuiIcon,
        TuiSurface
    ]
})
export class LoginPage {
    public loginWithVK() {
        window.location.href = 'https://oauth.vk.com/authorize?...';
    }

    public loginWithTelegram() {
        window.location.href = 'https://oauth.telegram.org/auth?...';
    }
}
