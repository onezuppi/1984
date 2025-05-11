import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ChannelService } from '../../services/requests/channel.service';
import { filter, Observable, of, switchMap } from 'rxjs';
import { FormBuilder } from '@angular/forms';
import { ConfirmationService } from '../confirm-dialog/confirmation-modal.service';
import { EditPostForm } from './edit-post-form';
import { EditPostDialogComponent, EditPostDialogData } from './edit-post-dialog.component';
import { Post } from '../../models/post.model';

@Injectable({ providedIn: 'root' })
export class EditPostDialogService {
    constructor(
        private readonly _dialog: MatDialog,
        private readonly _confirmService: ConfirmationService,
        private readonly _fb: FormBuilder,
    ) {
    }

    showModal(post: Post): Observable<EditPostDialogData> {
        const form = new EditPostForm(this._fb, {
            content: post.content,
            attachments: post.attachments ?? []
        });
        const dialogRef = this._dialog.open<
            EditPostDialogComponent,
            EditPostDialogData,
            EditPostDialogData
        >(EditPostDialogComponent, {
            width: '600px',
            data: { form, postId: post.id } as EditPostDialogData
        });

        return dialogRef.afterClosed()
            .pipe(
                filter((result): result is EditPostDialogData => !!result),
                switchMap((result) =>
                    this._confirmService
                        .confirm(
                            'Сохранить изменения?',
                            'Вы уверены, что хотите сохранить внесённые изменения?'
                        )
                        .pipe(
                            filter(confirmed => confirmed),
                            switchMap(() => of(result as EditPostDialogData))
                        )
                )
            );
    }
}
