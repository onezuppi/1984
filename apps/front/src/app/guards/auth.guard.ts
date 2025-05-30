import { inject, Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/requests/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

    private readonly auth: AuthService = inject(AuthService);
    private readonly router: Router = inject(Router);

    canActivate(): boolean {
        if (!this.auth.isAuthenticated()) {
            this.router.navigate(['/auth']);
            return false;
        }
        return true;
    }
}
