import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { ChannelSelectorComponent } from '../chanel-selector/channel-selector.component';
import { PostListComponent } from '../../components/post-list/post-list.component';
import { ChannelManagerService } from '../../services/managers/channel-manager.service';

@Component({
    selector: 'app-channel-manager',
    standalone: true,
    imports: [
        CommonModule,
        MatProgressSpinnerModule,
        MatButtonModule,
        MatDialogModule,
        ChannelSelectorComponent,
        PostListComponent
    ],
    templateUrl: './channel-manager.component.html',
    styleUrls: ['./channel-manager.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChannelManagerComponent {

    constructor(protected readonly manager: ChannelManagerService) {}

}
