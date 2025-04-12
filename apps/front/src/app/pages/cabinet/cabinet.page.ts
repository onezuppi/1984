import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TelegramUser } from '../../interfaces/telegram-user.interface';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-protected',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div>
            <h2>Зона для авторизованных пользователей</h2>
            <p *ngIf="user">Добро пожаловать, {{ user.first_name }}!</p>
            <p *ngIf="!user">Пользователь не найден.</p>
        </div>
    `
})
export class CabinetPage implements OnInit {
    user: TelegramUser | null = null;

    constructor(private authService: AuthService) {
    }

    ngOnInit(): void {
        this.authService.user$.subscribe(u => this.user = u);
    }
}
