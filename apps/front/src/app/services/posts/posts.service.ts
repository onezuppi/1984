import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

export interface Post {
    _id: string;
    chat_id: number;
    message_id: number;
    date: string;
    text: string;
    caption: string;
    entities: any[];
    media_group_id: string | null;
    author_signature: string | null;
    from_chat_title: string;
    from_chat_username: string;
    type: 'channel' | 'private' | 'group' | string;
    has_media: boolean;
    photo: string | null;
    video: string | null;
    document: string | null;
    audio: string | null;
    voice: string | null;
}

@Injectable({ providedIn: 'root' })
export class PostService {

    private readonly _http = inject(HttpClient);

    public getPostsByChannelId(channelId: string): Observable<Post[]> {
        return this._http.get<Post[]>(`/api/posts/${ channelId }`)
            .pipe(
                catchError(err => of([]))
            );
    }

}
