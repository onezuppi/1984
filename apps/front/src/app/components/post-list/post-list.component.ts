import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Post } from '../../models/post.model';

@Component({
    selector: 'app-post-list',
    standalone: true,
    imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule],
    templateUrl: './post-list.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['./post-list.component.scss']
})
export class PostListComponent {
    @Input() posts: Post[] = [];
    @Output() action = new EventEmitter<{ postId: string; action: string }>();

    onAction(postId: string, action: string) {
        this.action.emit({ postId, action });
    }
}
