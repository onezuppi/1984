import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageLayoutComponent } from '../../components/page-layout/page-layout.component';
import { ChannelManagerComponent } from '../../components/channel-manager/channel-manager.component';


@Component({
    selector: 'add-post-page',
    templateUrl: './add-post.page.html',
    styleUrls: ['./add-post.page.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        CommonModule,
        PageLayoutComponent,
        ChannelManagerComponent,
    ]
})
export class AddPostPage {
    protected readonly pageTitle: string = 'Добавление постов';
}
