import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Channel } from '../../services/channels/channel.service';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-channel-card',
    standalone: true,
    imports: [CommonModule, MatCardModule, MatChipsModule, MatIconModule, MatButtonModule],
    templateUrl: './channel-card.component.html',
    styleUrls: ['./channel-card.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChannelCardComponent {
    @Input()
    public channel!: Channel;
}
