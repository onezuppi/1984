import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
    BehaviorSubject,
    Observable,
    of,
    switchMap,
    shareReplay,
    tap,
    defer
} from 'rxjs';

export interface User {
    _id: string;
    user_id: number;
    chat_id: number;
    username: string;
    first_name: string;
    last_name: string;
    created_at: string;
}

@Injectable({ providedIn: 'root' })
export class UserService {
    private readonly _http = inject(HttpClient);

    private readonly _userSubject = new BehaviorSubject<User | null>(null);
    private readonly _avatarSubject = new BehaviorSubject<string | null>(null);

    private readonly _userRequest$ = this._http.get<User>('/api/user/me').pipe(
        tap(user => this._userSubject.next(user)),
        shareReplay({ bufferSize: 1, refCount: false })
    );

    private readonly _photoRequest$ =
        this._http.get('/api/user/me/photo', { responseType: 'blob' }).pipe(
            switchMap(blob => {
                const url = URL.createObjectURL(blob);
                this._avatarSubject.next(url);

                return of(url);
            }),
            shareReplay({ bufferSize: 1, refCount: false })

    );

    public readonly user$: Observable<User> = this._userSubject.pipe(
        switchMap(user => user ? of(user) : this._userRequest$)
    );

    public readonly avatar$: Observable<string> = this._avatarSubject.pipe(
        switchMap(avatar => avatar ? of(avatar) : this._photoRequest$)
    );
}
