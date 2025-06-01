import { provideAnimations } from '@angular/platform-browser/animations';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { environment } from '../environments/environment';
import { HTTP_INTERCEPTORS, provideHttpClient } from '@angular/common/http';
import { TELEGRAM_BOT_USERNAME } from './tokens/telegram-bot-username.token';
import { AuthInterceptor } from './services/auth/auth-token.interceptor';

const APP_CONFIG_PROVIDERS = [
    { provide: TELEGRAM_BOT_USERNAME, useValue: environment.telegramBotUsername },
    {
        provide: HTTP_INTERCEPTORS,
        useClass: AuthInterceptor,
        multi: true
    }
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
