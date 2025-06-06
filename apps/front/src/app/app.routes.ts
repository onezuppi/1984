import { AuthNavigationComponent } from './navigations/auth-navigation/auth-navigation.component';
import { NAV_ROUTES } from './nav.config';
import { Router, Routes } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './services/auth/auth.service';
import { RedirectToAuthGuard } from './guards/redirect-to-auth.guard';
import { AddBotGuard } from './guards/add-bot-guard';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'auth',
    },
    {
        path: 'auth',
        loadComponent: () => import('./pages/login/login.page').then(m => m.LoginPage),
        canActivate: [RedirectToAuthGuard]
    },
    {
        path: 'auth-by-token',
        loadComponent: () => import('./pages/auth-by-token/auth-by-token.page').then(m => m.AuthByTokenPage),
        canActivate: [RedirectToAuthGuard]
    },
    {
        path: 'cabinet',
        component: AuthNavigationComponent,
        canActivate: [() => inject(AuthService).isAuthenticated ? true : inject(Router).parseUrl('/')],
        children: [
            ...NAV_ROUTES.map(r => ({
                path: r.path,
                loadComponent: r.loadComponent,
                canActivate: r.canActivate
            })),
            {
                path: 'channels/:channelId',
                loadComponent: () => import('./pages/posts/posts.page').then((m) => m.PostPageComponent),
                canActivate: [AddBotGuard],
            },
        ]
    },
    {
        path: '**',
        loadComponent: () => import('./pages/not-found/not-found.page').then(m => m.NotFoundPage)
    },
];
