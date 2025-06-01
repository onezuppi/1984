import { provideAnimations } from '@angular/platform-browser/animations';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { environment } from '../environments/environment';
import { TELEGRAM_BOT_ID } from './tokens/telegram-bot-id.token';
import { provideHttpClient } from '@angular/common/http';
import { TELEGRAM_BOT_USERNAME } from './tokens/telegram-bot-username.token';

const APP_CONFIG_PROVIDERS = [
    { provide: TELEGRAM_BOT_ID, useValue: environment.telegramBotId },
    { provide: TELEGRAM_BOT_USERNAME, useValue: environment.telegramBotUsername },
];

export const appConfig: ApplicationConfig = {
    providers: [
        provideAnimations(),
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter(routes),
        provideHttpClient(),
        ...APP_CONFIG_PROVIDERS
    ],
};
