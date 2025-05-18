import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Post } from '../../models/post.model';
import { ImagePreviewComponent } from '../image-preview/image-preview.component';
import { PostAction } from '../../models/post-action.model';
import { MatMenuModule } from '@angular/material/menu';

@Component({
    selector: 'app-post',
    standalone: true,
    imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, ImagePreviewComponent, MatMenuModule],
    templateUrl: './post.component.html',
    styleUrls: ['./post.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PostComponent {
    @Input() post!: Post;
    @Output() action = new EventEmitter<PostAction>();

    onPublish(): void {
        this.action.emit({ post: this.post, action: 'publish' });
    }

    onEdit(): void {
        this.action.emit({ post: this.post, action: 'edit' });
    }

    onDelete(): void {
        this.action.emit({ post: this.post, action: 'delete' });
    }
}
