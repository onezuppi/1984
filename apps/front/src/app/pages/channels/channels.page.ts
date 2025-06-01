import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageLayoutComponent } from '../../components/page-layout/page-layout.component';

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
}
