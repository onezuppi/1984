import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { EditPostForm } from './edit-post-form';


export interface EditPostDialogData {
    /** Форма, уже инициализированная сервисом */
    form: EditPostForm;
    /** ID редактируемого поста */
    postId: string;
}

@Component({
    selector: 'app-edit-post-dialog',
    standalone: true,
    imports: [
        CommonModule,
        MatDialogModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatButtonModule
    ],
    templateUrl: './edit-post-dialog.component.html',
    styleUrls: ['./edit-post-dialog.component.scss']
})
export class EditPostDialogComponent {
    form: EditPostForm;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: EditPostDialogData,
        private dialogRef: MatDialogRef<EditPostDialogComponent, { postId: string; content: string; attachments: string[] }>
    ) {
        this.form = data.form;
    }

    addAttachment(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files?.[0]) {
            const reader = new FileReader();
            reader.onload = () => {
                this.form.addAttachment(reader.result as string);
            };
            reader.readAsDataURL(input.files![0]);
            input.value = '';
        }
    }

    removeAttachment(index: number) {
        this.form.removeAttachment(index);
    }

    save() {
        if (this.form.valid) {
            const { content, attachments } = this.form.getValue();
            this.dialogRef.close({
                postId: this.data.postId,
                content,
                attachments
            });
        }
    }

    cancel() {
        this.dialogRef.close();
    }
}
