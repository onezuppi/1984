import { effect, Injectable, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PublishPostData, PublishPostDialogComponent } from '../../modals/publish-post-dialog/publish-post-dialog.component';
import { Post } from '../../models/post.model';
import { ChannelService } from '../requests/channel.service';
import { Channel } from '../../models/channel.model';
import { EditPostData, EditPostDialogComponent } from '../../modals/edit-post-dialog/edit-post-dialog.component';


@Injectable({ providedIn: 'root' })
export class ChannelManagerService {
    /** Состояние */
    channels = signal<Channel[]>([]);
    posts = signal<Post[]>([]);
    selectedChannelId = signal<string | null>(null);
    loadingChannels = signal(true);
    loadingPosts = signal(false);

    constructor(
        private channelService: ChannelService,
        private dialog: MatDialog
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
        this.channelService.getUserChannels().subscribe(list => {
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
        this.channelService.getChannelPosts(channelId).subscribe(list => {
            this.posts.set(list);
            this.loadingPosts.set(false);
        });
    }

    /** Сбрасываем кеш и перезагружаем посты */
    regeneratePosts(): void {
        const id = this.selectedChannelId();
        if (!id) return;
        this.channelService.clearPostsCache(id);
        this.loadPosts(id);
    }

    handlePostAction(event: { postId: string; action: string }): void {
        if (event.action === 'edit') {
            this.editPost(event.postId);
        } else if (event.action === 'publish') {
            this.publishPost(event.postId);
        }
    }

    /** Открываем диалог редактирования */
    editPost(postId: string): void {
        const post = this.posts().find(p => p.id === postId);
        if (!post) return;

        const ref = this.dialog.open<EditPostDialogComponent, EditPostData>(
            EditPostDialogComponent,
            { data: { postId, content: post.content, attachments: post.attachments ?? [] } }
        );
        ref.afterClosed().subscribe(result => {
            if (result) {
                this.posts.set(
                    this.posts().map(p =>
                        p.id === result.postId ? { ...p, content: result.content } : p
                    )
                );
            }
        });
    }

    /** Открываем диалог публикации */
    publishPost(postId: string): void {
        const ref = this.dialog.open<
            PublishPostDialogComponent,
            PublishPostData
        >(PublishPostDialogComponent, {
            data: { postId }
        });
        ref.afterClosed().subscribe(result => {
            if (result) {
                console.log('Publishing post', result.postId);
                // Здесь можно вызвать метод сервиса публикации
            }
        });
    }
}
