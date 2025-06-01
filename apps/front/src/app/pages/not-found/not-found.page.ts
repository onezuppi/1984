import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCard } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
    standalone: true,
    imports: [
        CommonModule,
        MatCard,
        MatIcon,
        RouterLink,
    ],
    templateUrl: './not-found.page.html',
    styleUrls: ['./not-found.page.scss']
})
export class NotFoundPage {

}
