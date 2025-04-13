import { Component, inject, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { TuiButton } from '@taiga-ui/core';
import { CommonModule } from '@angular/common';
import { TuiAvatar } from '@taiga-ui/kit';
import { AuthService } from '../../services/auth.service';
import { BACKEND_API_URL } from '../../tokens/app-config.token';


@Component({
    selector: 'app-profile-page',
    standalone: true,
    imports: [
        TuiButton,
        CommonModule,
        TuiAvatar
    ],
    template: `
        <div style="max-width: 400px; margin: 50px auto; text-align: center;" *ngIf="profile$ | async as profile; else loading">
            <tui-avatar *ngIf="profile.avatar; else noAvatar" [src]="profile.avatar" size="l"></tui-avatar>
            <ng-template #noAvatar>
                <tui-avatar>{{ profile.name }}</tui-avatar>
            </ng-template>
            <h3>{{ profile.name }}</h3>
            <button tuiButton appearance="primary" size="m" (click)="logout()">
                Выйти
            </button>
        </div>
        <ng-template #loading>
            Загрузка профиля...
        </ng-template>
    `
})
export class ProfilePage implements OnInit {

    protected profile$!: Observable<{ name: string; avatar: string | null }>;

    private readonly auth: AuthService = inject(AuthService);

    private readonly apiUrl: string = inject(BACKEND_API_URL);

    ngOnInit(): void {
        this.profile$ = this.auth.getUserData();
    }

    logout(): void {
        this.auth.logout();
    }
}
