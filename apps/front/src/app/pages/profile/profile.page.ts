import { Component, inject, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { TuiButton } from '@taiga-ui/core';
import { CommonModule } from '@angular/common';
import { TuiAvatar } from '@taiga-ui/kit';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-profile-page',
    standalone: true,
    imports: [
        TuiButton,
        CommonModule,
        TuiAvatar,
    ],
    templateUrl: './profile.page.html',
    styleUrls: ['./profile.page.scss']
})
export class ProfilePage implements OnInit {

    protected profile$!: Observable<{ name: string; avatar: string | null }>;

    private readonly auth: AuthService = inject(AuthService);

    ngOnInit(): void {
        this.profile$ = this.auth.getUserData();
    }

    logout(): void {
        this.auth.logout();
    }
}
