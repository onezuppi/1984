import {
    Component,
    AfterViewInit,
    ElementRef,
    ViewChild,
    Inject,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DOCUMENT } from '@angular/common';

@Component({
    selector: 'app-vk-login-btn',
    template: `<div #vkContainer></div>`,
})
export class VkLoginBtnComponent implements AfterViewInit {
    @ViewChild('vkContainer', { static: true }) vkContainer!: ElementRef;

    constructor(
        private readonly _http: HttpClient,
        @Inject(DOCUMENT) private readonly _document: Document
    ) {}

    public ngAfterViewInit(): void {
        this.loadVkSdk()
            .then(() => this.initVkOneTap())
            .catch((err) => console.error('VK SDK load failed', err));
    }

    private loadVkSdk(): Promise<void> {
        return new Promise((resolve, reject) => {
            if ((window as any).VKIDSDK) return resolve();

            const script = this._document.createElement('script');
            script.src = 'https://unpkg.com/@vkid/sdk@<3.0.0/dist-sdk/umd/index.js';
            script.onload = () => resolve();
            script.onerror = () => reject();
            this._document.body.appendChild(script);
        });
    }

    private initVkOneTap(): void {
        const VKID = (window as any).VKIDSDK;

        VKID.Config.init({
            app: 53428608,
            redirectUrl: `${this._document.location.origin}/api/auth/vk`,
            responseMode: VKID.ConfigResponseMode.Callback,
            source: VKID.ConfigSource.LOWCODE,
            scope: '',
        });

        const oneTap = new VKID.OneTap();

        oneTap
            .render({
                container: this.vkContainer.nativeElement,
                showAlternativeLogin: true,
            })
            .on(VKID.WidgetEvents.ERROR, (error: any) => console.error('VK error', error))
            .on(VKID.OneTapInternalEvents.LOGIN_SUCCESS, (payload: { code: string; device_id: string }) => {
                const { code, device_id } = payload;

                VKID.Auth.exchangeCode(code, device_id)
                    .then((data: any) => this.sendToBackend(data))
                    .catch((err: any) => console.error('Exchange failed', err));
            });
    }

    private sendToBackend(data: { access_token: string; user_id: number }): void {
        this._http
            .post<{ access_token: string; refresh_token: string }>(
                '/api/auth/vk',
                {
                    access_token: data.access_token,
                    user_id: data.user_id,
                }
            )
            .subscribe({
                next: (tokens) => {
                    localStorage.setItem('jwt', tokens.access_token);
                    console.log('Auth success');
                },
                error: (err) => {
                    console.error('Backend auth failed', err);
                },
            });
    }
}
