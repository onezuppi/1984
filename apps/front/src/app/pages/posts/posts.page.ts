import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageLayoutComponent } from '../../components/page-layout/page-layout.component';
import { PostService } from '../../services/posts/posts.service';
import { ActivatedRoute } from '@angular/router';
import { filter, map, switchMap } from 'rxjs/operators';

@Component({
    selector: 'app-post-page',
    standalone: true,
    imports: [CommonModule, PageLayoutComponent,],
    templateUrl: './posts.page.html',
    styleUrls: ['./posts.page.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostPageComponent {

    private readonly _postService = inject(PostService);

    private readonly _route = inject(ActivatedRoute);

    protected readonly channelId$ = this._route.paramMap.pipe(
        map(params => params.get('channelId')),
        filter((id): id is string => !!id)
    );

    protected readonly posts$ = this.channelId$.pipe(
        switchMap(channelId => this._postService.getPostsByChannelId(channelId))
    );

}
