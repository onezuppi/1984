import { Component, inject, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-profile-page',
    standalone: true,
    imports: [
        CommonModule,
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
