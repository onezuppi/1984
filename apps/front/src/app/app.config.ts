import { provideEventPlugins } from '@taiga-ui/event-plugins';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { environment } from '../environments/environment';
import { BACKEND_API_URL, TELEGRAM_BOT_ID } from './tokens/app-config.token';
import { provideHttpClient } from '@angular/common/http';

const APP_CONFIG_PROVIDERS = [
    { provide: TELEGRAM_BOT_ID, useValue: environment.telegramBotId },
    { provide: BACKEND_API_URL, useValue: environment.backendUrl }
];

export const appConfig: ApplicationConfig = {
    providers: [
        provideAnimations(),
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter(routes),
        provideEventPlugins(),
        provideHttpClient(),
        ...APP_CONFIG_PROVIDERS
    ],
};
