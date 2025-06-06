import { Component, ChangeDetectionStrategy, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageLayoutComponent } from '../../components/page-layout/page-layout.component';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BehaviorSubject, Observable, Subscription, of } from 'rxjs';
import {
    map,
    distinctUntilChanged,
    tap,
    switchMap,
    catchError,
    shareReplay,
    withLatestFrom, delay,
} from 'rxjs/operators';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { PostService, Post } from '../../services/posts/posts.service';
import { ChannelService, Channel } from '../../services/channels/channel.service';
import { ChannelCardComponent } from '../../components/channel-card/channel-card.component';
import { PublishedPostComponent } from '../../components/published-post/published-post.component';

@Component({
    selector: 'app-posts-page',
    standalone: true,
    imports: [
        CommonModule,
        PageLayoutComponent,
        MatCardModule,
        MatProgressSpinnerModule,
        MatIconModule,
        MatButtonModule,
        ChannelCardComponent,
        PublishedPostComponent,
    ],
    templateUrl: './posts.page.html',
    styleUrls: ['./posts.page.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostsPage implements OnInit, OnDestroy {
    private readonly route: ActivatedRoute = inject(ActivatedRoute);
    private readonly router: Router = inject(Router);
    private readonly postService: PostService = inject(PostService);
    private readonly channelService: ChannelService = inject(ChannelService);

    public readonly isChannelLoading$ = new BehaviorSubject<boolean>(true);
    public readonly isPostsLoading$ = new BehaviorSubject<boolean>(true);

    private readonly reloadPosts$ = new BehaviorSubject<void>(undefined);

    private readonly channelId$: Observable<string> = this.route.paramMap.pipe(
        map(params => params.get('channelId') as string),
        distinctUntilChanged(),
        shareReplay({ bufferSize: 1, refCount: true })
    );

    public readonly channel$: Observable<Channel | null> = this.channelId$.pipe(
        tap(() => this.isChannelLoading$.next(true)),
        switchMap(id =>
            this.channelService.getChannelById(id).pipe(
                catchError(() => of(null))
            )
        ),
        tap(() => this.isChannelLoading$.next(false)),
        shareReplay({ bufferSize: 1, refCount: true })
    );

    public readonly posts$: Observable<Post[]> = this.reloadPosts$.pipe(
        withLatestFrom(this.channelId$),
        tap(() => this.isPostsLoading$.next(true)),
        switchMap(([, id]) =>
            this.postService.getPostsByChannelId(id).pipe(
                catchError(() => of([]))
            )
        ),
        delay(200),
        tap(() => this.isPostsLoading$.next(false)),
        shareReplay({ bufferSize: 1, refCount: true })
    );

    private readonly subscriptions = new Subscription();

    public ngOnInit(): void {
        this.subscriptions.add(this.channel$.subscribe());
        this.subscriptions.add(this.posts$.subscribe());
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public refreshPosts(): void {
        this.reloadPosts$.next();
    }

    public goBack(): void {
        this.router.navigate(['../'], { relativeTo: this.route });
    }
}
