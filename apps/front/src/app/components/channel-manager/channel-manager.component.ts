import { ChangeDetectionStrategy, Component, effect, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PostListComponent } from '../../components/post-list/post-list.component';
import { ChannelService } from '../../services/channel.service';
import { Channel } from '../../models/channel.model';
import { Post } from '../../models/post.model';
import { ChannelSelectorComponent } from '../chanel-selector/channel-selector.component';

@Component({
    selector: 'app-channel-manager',
    standalone: true,
    imports: [
        CommonModule,
        MatProgressSpinnerModule,
        MatButtonModule,
        ChannelSelectorComponent,
        PostListComponent
    ],
    templateUrl: './channel-manager.component.html',
    styleUrls: ['./channel-manager.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChannelManagerComponent implements OnInit {
    channels: Channel[] = [];
    posts: Post[] = [];
    selectedChannelId: string | null = null;
    loadingChannels = signal(true);
    loadingPosts = signal(false);

    constructor(private channelService: ChannelService) {
    }

    ngOnInit(): void {
        this.loadChannels();
    }

    private loadChannels() {
        this.channelService.getUserChannels().subscribe(list => {
            this.channels = list;
            this.loadingChannels.set(false);
        });
    }

    onChannelChange(id: string) {
        this.selectedChannelId = id;
        this.loadPosts(id);
    }

    private loadPosts(channelId: string) {
        this.loadingPosts.set(true);
        this.channelService.getChannelPosts(channelId).subscribe(posts => {
            this.posts = posts;
            this.loadingPosts.set(false);
        });
    }

    onPostAction(event: { postId: string; action: string }) {
        console.log(event);
    }

    regeneratePosts() {
        if (!this.selectedChannelId) {
            return;
        }
        this.channelService.clearPostsCache(this.selectedChannelId);
        this.loadPosts(this.selectedChannelId);
    }
}
