import { inject, Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

@Injectable({ providedIn: 'root' })
export class RedirectToAuthGuard implements CanActivate {
    private readonly _authService = inject(AuthService);
    private readonly _router = inject(Router);

    public canActivate() {
        if (this._authService.isAuthenticated) {
            return this._router.parseUrl('/cabinet/add-channel');
        }

        return true;
    }
}
