import { effect, Injectable, signal } from '@angular/core';
import { Post } from '../../models/post.model';
import { CreatePostService } from '../requests/create-post.service';
import { Channel } from '../../models/channel.model';
import { EditPostDialogService } from '../../modals/edit-post-dialog/edit-post-dialog-modal.service';
import { take, tap } from 'rxjs';
import { PostAction } from '../../models/post-action.model';
import { ConfirmationService } from '../../modals/confirm-dialog/confirmation-modal.service';


@Injectable({ providedIn: 'root' })
export class ChannelManagerService {
    /** Состояние */
    channels = signal<Channel[]>([]);
    posts = signal<Post[]>([]);
    selectedChannelId = signal<string | null>(null);
    loadingChannels = signal(true);
    loadingPosts = signal(false);

    constructor(
        private readonly _channelService: CreatePostService,
        private readonly _editPostDialogService: EditPostDialogService,
        private readonly _confirmService: ConfirmationService,
    ) {
        // Инициализация: загрузка каналов и реакция на выбор
        this.loadChannels();
        effect(() => {
            const id = this.selectedChannelId();
            if (id !== null) {
                this.loadPosts(id);
            }
        });
    }

    /** Загрузка списка каналов */
    private loadChannels(): void {
        this.loadingChannels.set(true);
        this._channelService.getUserChannels().subscribe(list => {
            this.channels.set(list);
            this.loadingChannels.set(false);
        });
    }

    /** Устанавливаем выбранный канал */
    selectChannel(id: string): void {
        this.selectedChannelId.set(id);
    }

    /** Загрузка постов для канала */
    private loadPosts(channelId: string): void {
        this.loadingPosts.set(true);
        this._channelService.getChannelPosts(channelId).subscribe(list => {
            this.posts.set(list);
            this.loadingPosts.set(false);
        });
    }

    /** Сбрасываем кеш и перезагружаем посты */
    regeneratePosts(): void {
        const id = this.selectedChannelId();
        if (!id) return;
        this._channelService.clearPostsCache(id);
        this.loadPosts(id);
    }

    handlePostAction({ post, action }: PostAction): void {
        if (action === 'edit') {
            this.editPost(post);
        } else if (action === 'publish') {
            this.publishPost(post);
        } else if (action === 'delete') {
            this.deletePost(post);
        }
    }

    /** Открываем диалог редактирования */
    editPost(post: Post): void {
        this._editPostDialogService
            .showModal(post)
            .pipe(
                tap(console.log),
                take(1)
            )
            .subscribe();
    }

    /** удалить пост */
    deletePost(post: Post): void {
        this._confirmService
            .confirm(
                'Удалить публикацию?',
                'Это действие необратимо. Вы действительно хотите удалить этот пост?'
            )
            .pipe(
                take(1)
            )
            .subscribe()
    }

    /** Открываем диалог публикации */
    publishPost(post: Post): void {

    }
}
