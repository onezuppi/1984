import { AuthGuard } from './guards/auth.guard';
import { AuthNavigationComponent } from './navigations/auth-navigation/auth-navigation.component';
import { NAV_ROUTES } from './nav.config';
import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', redirectTo: 'auth', pathMatch: 'full' },
    {
        path: 'auth',
        loadComponent: () => import('./pages/login/login.page').then(m => m.LoginPage)
    },
    {
        path: '',
        component: AuthNavigationComponent,
        canActivateChild: [AuthGuard],
        children: NAV_ROUTES.map(r => ({
            path: r.path,
            loadComponent: r.loadComponent
        }))
    },
    { path: '**', redirectTo: '' }
];
