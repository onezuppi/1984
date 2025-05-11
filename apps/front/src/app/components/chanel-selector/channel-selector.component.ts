import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { Channel } from '../../models/channel.model';

@Component({
    selector: 'app-channel-selector',
    standalone: true,
    imports: [CommonModule, MatFormFieldModule, MatSelectModule],
    templateUrl: './channel-selector.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['./channel-selector.component.scss']
})
export class ChannelSelectorComponent {
    @Input() channels: Channel[] = [];
    @Input() selectedChannelId: string | null = null;
    @Output() channelChange = new EventEmitter<string>();

    onSelect(id: string) {
        this.channelChange.emit(id);
    }
}
