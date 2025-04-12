import { TuiRoot } from '@taiga-ui/core';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TELEGRAM_BOT_ID, TELEGRAM_BOT_NAME } from './tokens/telegram-config.token';
import { environment } from '../environments/environment';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, TuiRoot],
    template: `
        <tui-root>
            <router-outlet/>
        </tui-root>
    `,
    providers: [
        { provide: TELEGRAM_BOT_NAME, useValue: environment.telegramBotName },
        { provide: TELEGRAM_BOT_ID, useValue: environment.telegramBotId }
    ]
})
export class AppComponent {
}
