import { CanActivate } from '@angular/router';
import { AddBotGuard } from './guards/add-bot-guard';
import { InjectionToken, Type } from '@angular/core';

export interface NavRoute {
    path: string;
    label: string;
    icon: string;
    loadComponent: () => Promise<any>;
    canActivate?: Array<Type<CanActivate> | InjectionToken<CanActivate> | any[]>;
}

export const NAV_ROUTES: NavRoute[] = [
    {
        path: 'add-bot',
        label: 'Добавить бота',
        icon: 'add',
        loadComponent: () => import('./pages/add-bot/add-bot.page').then(m => m.AddBotPage),
        canActivate: []
    },
    {
        path: 'add-post',
        label: 'Создать пост',
        icon: 'edit',
        loadComponent: () => import('./pages/add-post/add-post.page').then(m => m.AddPostPage),
        canActivate: [AddBotGuard]
    },
    {
        path: 'profile',
        label: 'Профиль',
        icon: 'person',
        loadComponent: () => import('./pages/profile/profile.page').then(m => m.ProfilePage),
        canActivate: [AddBotGuard]
    },
];
