import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ConfirmDialogData } from '../../modals/confirm-dialog/confirm-dialog-data';
import { ConfirmDialogComponent } from '../../modals/confirm-dialog/confirm-dialog.component';

@Injectable({ providedIn: 'root' })
export class ConfirmationService {
    constructor(private readonly _dialog: MatDialog) {}

    /**
     * Показывает окно подтверждения с заголовком и текстом.
     * @returns Observable<boolean> — true, если пользователь нажал «Подтвердить»
     */
    confirm(
        title: string,
        message: string,
        confirmText = 'OK',
        cancelText = 'Отмена'
    ): Observable<boolean> {
        const dialogRef = this._dialog.open<ConfirmDialogComponent, ConfirmDialogData>(
            ConfirmDialogComponent,
            {
                data: { title, message, confirmText, cancelText },
                width: '400px'
            }
        );
        return dialogRef.afterClosed().pipe(map(result => result === true));
    }
}
