import { Injectable, NgZone } from '@angular/core';
import { fromEvent, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class MessageInterceptorService {
    public readonly message$: Observable<any>;

    constructor(private ngZone: NgZone) {
        this.message$ = fromEvent<MessageEvent>(window, 'message').pipe(
            map(event => event.data)
        );
        this.message$.subscribe(data => {
            console.log('Intercepted postMessage:', data);
        });
    }
}
