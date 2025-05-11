import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ConfirmDialogData } from './confirm-dialog-data';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-confirm-dialog',
    templateUrl: './confirm-dialog.component.html',
    styleUrls: ['./confirm-dialog.component.scss'],
    imports: [
        CommonModule,
        MatDialogModule,
        MatButtonModule,
    ],
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmDialogComponent {
    constructor(
        private dialogRef: MatDialogRef<ConfirmDialogComponent, boolean>,
        @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData
    ) {
        // Подставляем тексты по умолчанию
        this.data.confirmText = this.data.confirmText || 'OK';
        this.data.cancelText = this.data.cancelText || 'Отмена';
    }

    /** Пользователь подтвердил действие */
    confirm(): void {
        this.dialogRef.close(true);
    }

    /** Пользователь отменил действие */
    cancel(): void {
        this.dialogRef.close(false);
    }
}
