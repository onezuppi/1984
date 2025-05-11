import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface PublishPostData {
    postId: string;
}

@Component({
    selector: 'app-publish-post-dialog',
    standalone: true,
    imports: [CommonModule, MatDialogModule],
    templateUrl: './publish-post-dialog.component.html',
    styleUrls: ['./publish-post-dialog.component.scss']
})
export class PublishPostDialogComponent {
    constructor(
        private dialogRef: MatDialogRef<PublishPostDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: PublishPostData
    ) {}

    publish() {
        this.dialogRef.close({ postId: this.data.postId });
    }

    cancel() {
        this.dialogRef.close();
    }
}
