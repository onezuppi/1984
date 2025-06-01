import { CanActivate } from '@angular/router';
import { AddBotGuard } from './guards/add-bot-guard';
import { InjectionToken, Type } from '@angular/core';
import { ChannelsPage } from './pages/channels/channels.page';

export interface NavRoute {
    path: string;
    label: string;
    icon: string;
    loadComponent: () => Promise<any>;
    canActivate?: Array<Type<CanActivate> | InjectionToken<CanActivate> | any[]>;
}

export const NAV_ROUTES: NavRoute[] = [
    {
        path: 'add-channel',
        label: 'Добавить канал',
        icon: 'add',
        loadComponent: () => import('./pages/add-bot/add-bot.page').then(m => m.AddBotPage),
        canActivate: []
    },
    {
        path: 'channels',
        label: 'Список каналов',
        icon: 'list',
        loadComponent: () => import('./pages/channels/channels.page').then(m => m.ChannelsPage),
        canActivate: []
    },
    {
        path: 'add-post',
        label: 'Создать пост',
        icon: 'edit',
        loadComponent: () => import('./pages/add-post/add-post.page').then(m => m.AddPostPage),
        canActivate: [AddBotGuard]
    },
];
