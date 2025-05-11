import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    MAT_DIALOG_DATA,
    MatDialogModule,
    MatDialogRef
} from '@angular/material/dialog';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { EditPostForm, EditPostFormValue } from '../../forms/edit-post-form';

export interface EditPostData {
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
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatButtonModule
    ],
    templateUrl: './edit-post-dialog.component.html',
    styleUrls: ['./edit-post-dialog.component.scss']
})
export class EditPostDialogComponent implements OnInit {
    form!: EditPostForm;
    loading = true;

    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<EditPostDialogComponent, EditPostData>,
        @Inject(MAT_DIALOG_DATA) public data: EditPostData
    ) {}

    ngOnInit() {
        // Показываем скелетон при инициализации
        setTimeout(() => {
            this.form = new EditPostForm(this.fb, {
                content: this.data.content,
                attachments: this.data.attachments
            });
            this.loading = false;
        }, 500);
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
        if (!this.form.invalid) {
            const value: EditPostFormValue = this.form.getValue();
            this.dialogRef.close({
                postId: this.data.postId,
                content: value.content,
                attachments: value.attachments
            });
        }
    }

    cancel() {
        this.dialogRef.close();
    }
}
