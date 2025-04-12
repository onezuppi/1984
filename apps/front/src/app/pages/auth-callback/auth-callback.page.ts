import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-auth-callback',
    standalone: true,
    template: `<p>Обрабатываем авторизацию, откройте консоль всплывающего окна.</p>`
})
export class AuthCallbackComponent implements OnInit {
    constructor(private route: ActivatedRoute) {
    }

    ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            console.log('AuthCallbackComponent получил query-параметры:', params);
            if (Object.keys(params).length === 0) {
                console.error('Нет query-параметров – авторизация, возможно, не прошла.');
            }
            try {
                if (window.opener && typeof window.opener.postMessage === 'function') {
                    window.opener.postMessage(params, window.location.origin);
                    console.log('postMessage отправлено, параметры:', params);
                } else {
                    console.error('window.opener недоступен.');
                }
            }
            catch (e) {
                console.error('Ошибка при отправке postMessage:', e);
            }
            // Не закрываем окно сразу, для отладки оставляем его открытым 10 секунд:
            setTimeout(() => {
                console.log('Окно будет закрыто через 5 секунд.');
                window.close();
            }, 5000);
        });
    }
}
