import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { EditPostForm } from './edit-post-form';
import { FileUploaderComponent } from '../../components/file-uploader/file-uploader.component';


export interface EditPostDialogData {
    form: EditPostForm;
    postId: string;
}

export interface EditPostDialogResult {
    postId: string;
    content: string;
    attachments: string[];
}

@Component({
    selector: 'app-edit-post-dialog',
    standalone: true,
    imports: [
        CommonModule,
        MatDialogModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatButtonModule,
        FileUploaderComponent
    ],
    templateUrl: './edit-post-dialog.component.html',
    styleUrls: ['./edit-post-dialog.component.scss']
})
export class EditPostDialogComponent {
    form: EditPostForm;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: EditPostDialogData,
        private dialogRef: MatDialogRef<EditPostDialogResult, { postId: string; content: string; attachments: string[] }>
    ) {
        this.form = data.form;
    }

    save() {
        if (this.form.valid) {
            const { content, attachments } = this.form.getValue();
            this.dialogRef.close({
                postId: this.data.postId,
                content,
                attachments: attachments ?? []
            });
        }
    }

    cancel() {
        this.dialogRef.close();
    }
}
