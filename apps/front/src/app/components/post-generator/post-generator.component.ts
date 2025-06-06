import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatListOption, MatSelectionList } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Post, PostService } from '../../services/posts/posts.service';
import { PublishedPostComponent } from '../published-post/published-post.component';
import { BehaviorSubject } from 'rxjs';

@Component({
    selector: 'app-post-generator',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatSelectionList,
        MatProgressSpinnerModule,
        PublishedPostComponent,
        MatListOption,
    ],
    templateUrl: './post-generator.component.html',
    styleUrls: ['./post-generator.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PostGeneratorComponent implements OnInit {
    @Input() channelId: string | null = null;
    @Input() references: Post[] = [];
    @Output() postGenerated = new EventEmitter<string>();

    prompt = '';
    lastPrompt$ = new BehaviorSubject<string>('');
    selectedReferences: Post[] = [];
    isGenerating = false;

    /** Системная инструкция — только в TS */
    private readonly systemInstruction =
        'Сгенерируй пост для соцсети. Ответ выведи сразу, без каких-то доп конструкций. Не копируй референсы, если они есть, просто поддерживай стиль. Если указан адрес или время работы, оставляй, такие.';

    constructor(
        private postService: PostService,
        private cdr: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        /* заполнять нечем — оставляем пустым */
    }

    reuseLastPrompt(): void {
        this.prompt = this.lastPrompt$.value;
        this.cdr.markForCheck();
    }

    generatePost(): void {
        if (!this.channelId) {
            return;
        }

        this.isGenerating = true;
        this.cdr.markForCheck();

        const refsText = this.selectedReferences
            .map(r => `• ${r.text || r.caption}`)
            .join('\n');

        const fullPrompt = [
            this.prompt.trim(),
            refsText && `Референсы:\n${refsText}`,
            this.systemInstruction,
        ]
            .filter(Boolean)
            .join('\n\n');

        this.postService.generatePost(fullPrompt).subscribe({
            next: postText => {
                this.isGenerating = false;
                this.lastPrompt$.next(this.prompt);
                this.prompt = postText;
                this.selectedReferences = [];
                this.postGenerated.emit(postText);
                this.cdr.markForCheck();
            },
            error: () => {
                this.isGenerating = false;
                this.cdr.markForCheck();
            }
        });
    }
}
