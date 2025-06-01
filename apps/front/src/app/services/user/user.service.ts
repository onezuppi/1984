import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, switchMap, tap } from 'rxjs';

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
    public get user$(): Observable<User> {
        return this._user$
            .pipe(
                switchMap(user => user
                    ? of(user)
                    : this._http.get<User>('/api/user/me')
                        .pipe(
                            tap(user => this._user$.next(user))
                        ))
            );
    }

    public get avatar$(): Observable<string> {
        return this._photoUrl$
            .pipe(
                switchMap(photo => photo
                    ? of(photo)
                    : this._http.get('/api/user/me/photo', { responseType: 'blob' })
                        .pipe(
                            switchMap(blob => {
                                const url = URL.createObjectURL(blob);
                                this._photoUrl$.next(url);

                                return of(url);
                            })
                        )
                )
            );
    }

    private readonly _user$ = new BehaviorSubject<User | null>(null);
    private readonly _photoUrl$ = new BehaviorSubject<string | null>(null);
    private readonly _http = inject(HttpClient);
}
