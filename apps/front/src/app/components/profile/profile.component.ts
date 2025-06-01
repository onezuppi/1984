import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { UserService } from '../../services/user/user.service';
import { MatCard, MatCardAvatar } from '@angular/material/card';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [CommonModule, MatFormFieldModule, MatSelectModule, MatCard, MatCardAvatar],
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
    protected readonly userService = inject(UserService);
}
