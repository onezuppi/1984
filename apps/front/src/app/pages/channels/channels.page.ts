import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageLayoutComponent } from '../../components/page-layout/page-layout.component';
import { Channel, ChannelService } from '../../services/channels/channel.service';
import { Observable } from 'rxjs';

@Component({
    templateUrl: './channels.page.html',
    styleUrls: ['./channels.page.scss'],
    standalone: true,
    imports: [
        CommonModule,
        PageLayoutComponent,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChannelsPage {
    protected readonly pageTitle: string = 'Мои каналы';

    private readonly _channelService = inject(ChannelService);

    protected readonly userChannels$ = this._channelService.getUserChannels();

}
