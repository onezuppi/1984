import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, shareReplay } from 'rxjs/operators';
import { POSTS_MOCK } from '../../mocks/posts.mock';
import { CHANNELS_MOCK } from '../../mocks/channels.mock';
import { Post } from '../../models/post.model';
import { Channel } from '../../models/channel.model';

const CHANNELS_LOAD_DELAY = 1000;
const POSTS_LOAD_DELAY = 1500;

@Injectable({ providedIn: 'root' })
export class CreatePostService {
    private _channelsCache$?: Observable<Channel[]>;
    private _postsCache = new Map<string, Observable<Post[]>>();

    /** Возвращает список каналов (кешируется) */
    getUserChannels(): Observable<Channel[]> {
        if (!this._channelsCache$) {
            this._channelsCache$ = of(CHANNELS_MOCK).pipe(
                delay(CHANNELS_LOAD_DELAY),
                shareReplay({ bufferSize: 1, refCount: false })
            );
        }
        return this._channelsCache$;
    }

    /** Возвращает посты для канала (кешируется по channelId) */
    getChannelPosts(channelId: string): Observable<Post[]> {
        if (!this._postsCache.has(channelId)) {
            const filtered = POSTS_MOCK.filter(p => p.channelId === channelId);
            const obs$ = of(filtered).pipe(
                delay(POSTS_LOAD_DELAY),
                shareReplay({ bufferSize: 1, refCount: false })
            );
            this._postsCache.set(channelId, obs$);
        }
        return this._postsCache.get(channelId)!;
    }

    /** Сбрасывает кеш постов; если channelId не указан — сбрасывает всё */
    clearPostsCache(channelId?: string): void {
        if (channelId) {
            this._postsCache.delete(channelId);
        } else {
            this._postsCache.clear();
        }
    }
}
