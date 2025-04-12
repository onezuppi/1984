import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { TuiButton, TuiIcon, TuiSurface } from '@taiga-ui/core';
import { TelegramAuthDirective } from '../../directives/telegram-auth.directive';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { fromEvent, Subscription } from 'rxjs';

@Component({
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
    standalone: true,
    imports: [
        TuiButton,
        TuiIcon,
        TuiSurface,
        TelegramAuthDirective
    ]
})
export class LoginPage implements OnInit, OnDestroy {

    private subscription!: Subscription;

    constructor(
        private authService: AuthService,
        private router: Router,
        private ngZone: NgZone
    ) {
    }

    ngOnInit(): void {
        // Подписываемся на событие postMessage, чтобы получить данные из окна редиректа
        this.subscription = fromEvent<MessageEvent>(window, 'message').subscribe(event => {
            console.log('Получено сообщение postMessage:', event.data);
            if (event.data && event.data.id) {
                this.ngZone.run(() => {
                    this.authService.setUser(event.data);
                    this.router.navigate(['/protected']);
                });
            }
        });
    }

    ngOnDestroy(): void {
        this.subscription?.unsubscribe();
    }
}
