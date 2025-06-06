import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageLayoutComponent } from '../../components/page-layout/page-layout.component';
import { Channel, ChannelService } from '../../services/channels/channel.service';
import { ChannelCardComponent } from '../../components/channel-card/channel-card.component';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { BehaviorSubject, switchMap, tap } from 'rxjs';
import { delay, filter } from 'rxjs/operators';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
    templateUrl: './channels.page.html',
    styleUrls: ['./channels.page.scss'],
    standalone: true,
    imports: [
        CommonModule,
        PageLayoutComponent,
        ChannelCardComponent,
        MatIcon,
        MatButton,
        RouterLink,
        MatProgressSpinner,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChannelsPage {
    protected readonly pageTitle: string = 'Мои каналы';
    protected readonly channels$;
    protected readonly isLoading$: BehaviorSubject<boolean> = new BehaviorSubject(true);
    private readonly _channelService = inject(ChannelService);
    private readonly _router = inject(Router);
    private readonly _route = inject(ActivatedRoute);

    constructor() {
        this.channels$ = this.isLoading$.pipe(
            filter(is => is),
            switchMap(() => this._channelService.getChannels()),
            delay(100),
            tap(() => this.isLoading$.next(false)),
        )
    }

    protected channelCLick({ _id }: Channel): void {
        this._router.navigate([`../channels/${ _id }`], { relativeTo: this._route });
    }
}
