export interface NavRoute {
    path: string;
    label: string;
    icon: string;
    loadComponent: () => Promise<any>;
}

export const NAV_ROUTES: NavRoute[] = [
    {
        path: 'add-bot',
        label: 'Добавить бота',
        icon: 'add',
        loadComponent: () => import('./pages/add-bot/add-bot.page').then(m => m.AddBotPage)
    },
    {
        path: 'add-post',
        label: 'Создать пост',
        icon: 'edit',
        loadComponent: () => import('./pages/add-post/add-post.page').then(m => m.AddPostPage)
    },
    {
        path: 'profile',
        label: 'Профиль',
        icon: 'person',
        loadComponent: () => import('./pages/profile/profile.page').then(m => m.ProfilePage)
    },
];
