import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { NAV_ROUTES } from '../../nav.config';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../services/auth/auth.service';
import { ProfileComponent } from '../../components/profile/profile.component';

@Component({

    selector: '_auth-navigation',
    templateUrl: './auth-navigation.component.html',
    styleUrls: ['./auth-navigation.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
        RouterModule,
        MatSidenavModule,
        MatListModule,
        MatIconModule,
        MatToolbarModule,
        MatButtonModule,
        ProfileComponent
    ],
    standalone: true
})
export class AuthNavigationComponent {
    protected readonly navItems = NAV_ROUTES.map(r => ({
        label: r.label,
        icon: r.icon,
        route: `/${ r.path }`
    }));

    protected opened = true;

    private readonly _auth: AuthService = inject(AuthService);


    toggle() {
        this.opened = !this.opened;
    }

    logout(): void {
        this._auth.logout();
    }
}
