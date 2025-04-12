export const routes = [
    {
        path: '',
        redirectTo: 'auth',
        pathMatch: 'full' as const
    },
    {
        path: 'auth',
        loadChildren: () => import('./children/auth/auth-routing.module')
            .then(m => m.AuthRoutingModule),
    },
    {
        path: '**',
        redirectTo: '',
    },
];
