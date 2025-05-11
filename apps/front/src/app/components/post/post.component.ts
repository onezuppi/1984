import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Post } from '../../models/post.model';
import { ImagePreviewComponent } from '../image-preview/image-preview.component';

@Component({
    selector: 'app-post',
    standalone: true,
    imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, ImagePreviewComponent],
    templateUrl: './post.component.html',
    styleUrls: ['./post.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PostComponent {
    @Input() post!: Post;
    @Output() action = new EventEmitter<{ postId: string; action: string }>();

    onEdit() {
        this.action.emit({ postId: this.post.id, action: 'edit' });
    }
}
