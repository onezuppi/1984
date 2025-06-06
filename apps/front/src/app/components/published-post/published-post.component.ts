import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Post } from '../../services/posts/posts.service';

@Component({
    selector: 'app-published-post',
    standalone: true,
    imports: [CommonModule, MatIconModule],
    templateUrl: './published-post.component.html',
    styleUrls: ['./published-post.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublishedPostComponent {
    @Input({ required: true }) post!: Post;

    constructor(private sanitizer: DomSanitizer) {}

    get formattedText(): SafeHtml {
        const raw = this.post.text || this.post.caption || '';
        const html = raw.replace(/(^|\s)(#[\wа-яё\d_-]+)/giu, (_, p1, p2) => {
            return `${p1}<span class="tg-hashtag">${p2}</span>`;
        });
        return this.sanitizer.bypassSecurityTrustHtml(html);
    }

    get avatarInitial(): string {
        return (this.post.from_chat_title?.charAt(0) || '?').toUpperCase();
    }
}
