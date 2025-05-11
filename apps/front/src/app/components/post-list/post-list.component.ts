import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Post } from '../../models/post.model';
import { PostComponent } from '../post/post.component';
import { PostAction } from '../../models/post-action.model';

@Component({
    selector: 'app-post-list',
    standalone: true,
    imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, PostComponent],
    templateUrl: './post-list.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['./post-list.component.scss']
})
export class PostListComponent {
    @Input() posts: Post[] = [];
    @Output() action = new EventEmitter<PostAction>();

}
