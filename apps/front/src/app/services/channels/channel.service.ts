import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

export interface Channel {
    _id: string;
    title: string;
    username: string;
    type: string;
    description: string;
    invite_link: string;
    is_private: boolean;
    user_id: number;
}

@Injectable({ providedIn: 'root' })
export class ChannelService {

    private readonly _http = inject(HttpClient);

    public getChannels(): Observable<Channel[]> {
        return this._http.get<Channel[]>(`/api/channels`)
            .pipe(
                catchError(err => of([]))
            );
    }

    public getChannelById(id: string): Observable<Channel | null> {
        return this._http.get<Channel>(`/api/channels/${id}`)
            .pipe(
                catchError(err => of(null))
            );
    }
}
