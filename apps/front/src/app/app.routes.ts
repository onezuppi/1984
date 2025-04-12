export const routes = [
    {
        path: '',
        redirectTo: 'auth',
        pathMatch: 'full' as const
    },
    {
        path: 'auth',
        loadComponent: () => import('./pages/login/login.page').then(c => c.LoginPage),
    },
    {
        path: 'auth-callback',
        loadComponent: () => import('./pages/auth-callback/auth-callback.page').then(c => c.AuthCallbackComponent),
    },
    {
        path: 'cabinet',
        loadComponent: () => import('./pages/cabinet/cabinet.page').then(c => c.CabinetPage),
    },
    {
        path: '**',
        redirectTo: '',
    },
];
