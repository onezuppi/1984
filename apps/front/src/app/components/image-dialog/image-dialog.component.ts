import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-image-dialog',
    standalone: true,
    imports: [CommonModule, MatIconModule, MatDialogModule, MatButtonModule],
    template: `
        <div class="dialog-container" tabindex="0">
            <button mat-icon-button class="close-btn" (click)="close()">
                <mat-icon>close</mat-icon>
            </button>
            <img [src]="data.src" class="full-image" alt="Preview"/>
        </div>
    `,
    styleUrls: ['./image-dialog.component.scss'],
})
export class ImageDialogComponent {
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: { src: string },
        private dialogRef: MatDialogRef<ImageDialogComponent>
    ) {
    }

    close() {
        this.dialogRef.close();
    }
}
