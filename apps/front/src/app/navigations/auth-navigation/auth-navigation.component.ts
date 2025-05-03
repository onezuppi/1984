import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenav, MatSidenavContainer, MatSidenavContent } from '@angular/material/sidenav';
import { MatListItem, MatNavList } from '@angular/material/list';
import { MatToolbar } from '@angular/material/toolbar';
import { MatIcon } from '@angular/material/icon';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatIconButton } from '@angular/material/button';
import { NAV_ROUTES } from '../../nav.config';

@Component({

    selector: 'auth-navigation',
    templateUrl: './auth-navigation.component.html',
    styleUrls: ['./auth-navigation.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
        MatSidenav,
        MatNavList,
        MatListItem,
        MatIcon,
        MatSidenavContent,
        MatToolbar,
        RouterLinkActive,
        RouterLink,
        MatIconButton,
        RouterOutlet,
        MatSidenavContainer
    ],
    standalone: true
})
export class AuthNavigationComponent {
    navItems = NAV_ROUTES.map(r => ({
        label: r.label,
        icon: r.icon,
        route: `/${ r.path }`
    }));
}
