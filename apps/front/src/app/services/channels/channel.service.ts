import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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

    public getUserChannels(): Observable<Channel[]> {
        return this._http.get<Channel[]>(`/api/user/channels`);
    }

}
