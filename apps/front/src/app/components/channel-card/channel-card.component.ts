import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Clipboard } from '@angular/cdk/clipboard';
import { Channel } from '../../services/channels/channel.service';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltip } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-channel-card',
    standalone: true,
    imports: [CommonModule, MatCardModule, MatChipsModule, MatIconModule, MatButtonModule, MatTooltip, RouterLink],
    templateUrl: './channel-card.component.html',
    styleUrls: ['./channel-card.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChannelCardComponent {
    @Input()
    public channel!: Channel;

    constructor(
        private readonly _clipboard: Clipboard,
        private readonly _snackBar: MatSnackBar
    ) {}

    public copyLink(event: Event, url: string): void {
        event.stopPropagation();
        const successful = this._clipboard.copy(url);

        if (successful) {
            this._snackBar.open('Ссылка скопирована в буфер обмена', 'ОК', {
                duration: 2000,
                horizontalPosition: 'center',
                verticalPosition: 'top'
            });
        } else {
            this._snackBar.open('Не удалось скопировать ссылку', 'Закрыть', {
                duration: 2000,
                horizontalPosition: 'center',
                verticalPosition: 'top'
            });
        }
    }
}
