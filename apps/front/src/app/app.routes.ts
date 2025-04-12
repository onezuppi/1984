import { AuthGuard } from './guards/auth.guard';

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
        path: 'profile',
        loadComponent: () => import('./pages/profile/profile.page').then(c => c.ProfilePage),
        canActivate: [AuthGuard]
    },
    {
        path: '**',
        redirectTo: '',
    },
];
