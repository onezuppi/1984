import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';
import { FormBuilder } from '@angular/forms';
import { ConfirmationService } from '../confirm-dialog/confirmation-modal.service';
import { EditPostForm } from './edit-post-form';
import { EditPostDialogComponent, EditPostDialogData, EditPostDialogResult } from './edit-post-dialog.component';
import { Post } from '../../models/post.model';

@Injectable({ providedIn: 'root' })
export class EditPostDialogService {
    constructor(
        private readonly dialog: MatDialog,
        private readonly confirmService: ConfirmationService,
        private readonly fb: FormBuilder
    ) {
    }

    showModal(post: Post): Observable<EditPostDialogResult> {
        // Инициализируем форму с контентом и текущими вложениями (base64-строки)
        const form = new EditPostForm(this.fb, {
            content: post.content,
            attachments: post.attachments ?? []
        });

        // Открываем диалог и передаём в него форму + postId
        const dialogRef = this.dialog.open<
            EditPostDialogComponent,
            EditPostDialogData,
            EditPostDialogResult
        >(EditPostDialogComponent, {
            width: '600px',
            data: { form, postId: post.id }
        });

        return dialogRef.afterClosed().pipe(
            filter((result): result is EditPostDialogResult => !!result),
            switchMap(result =>
                this.confirmService
                    .confirm(
                        'Сохранить изменения?',
                        'Вы уверены, что хотите сохранить внесённые изменения?'
                    )
                    .pipe(
                        filter(confirmed => confirmed),
                        map(() => result as EditPostDialogResult)
                    )
            )
        );
    }
}
