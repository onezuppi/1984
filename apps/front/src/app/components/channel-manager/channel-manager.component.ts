import {
    ChangeDetectionStrategy,
    Component,
    ViewChild
} from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, shareReplay, startWith, switchMap } from 'rxjs/operators';
import { Channel, ChannelService } from '../../services/channels/channel.service';
import { Post, PostService } from '../../services/posts/posts.service';
import {
    MatStepperModule,
    MatStepper
} from '@angular/material/stepper';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { PostGeneratorComponent } from '../post-generator/post-generator.component';

@Component({
    selector: 'app-channel-manager',
    standalone: true,
    templateUrl: './channel-manager.component.html',
    styleUrls: ['./channel-manager.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatStepperModule,
        MatProgressSpinnerModule,
        MatButtonModule,
        PostGeneratorComponent
    ]
})
export class ChannelManagerComponent {
    @ViewChild('stepper') stepper?: MatStepper;

    /* ----- Каналы ----- */
    readonly channels$: Observable<Channel[]>;

    readonly isLoadingChannels$: Observable<boolean>;

    /* ----- Выбранный канал ----- */
    private readonly selectedChannelIdSubject = new BehaviorSubject<string | null>(null);
    readonly selectedChannelId$ = this.selectedChannelIdSubject.asObservable();

    /* ----- Посты-референсы ----- */
    private readonly posts$: Observable<Post[]> = this.selectedChannelId$.pipe(
        switchMap(id => (id ? this.postService.getPostsByChannelId(id) : of([]))),
        shareReplay(1)
    );

    readonly references$: Observable<Post[]> = this.posts$;

    readonly isLoadingPosts$: Observable<boolean> = this.selectedChannelId$.pipe(
        switchMap(id =>
            id
                ? this.postService.getPostsByChannelId(id).pipe(
                    map(() => false),
                    startWith(true)
                )
                : of(false)
        )
    );

    constructor(
        private readonly channelService: ChannelService,
        private readonly postService: PostService
    ) {
        this.channels$ =  this.channelService
            .getChannels()
            .pipe(shareReplay(1));
        this.isLoadingChannels$ =this.channels$.pipe(
            map(() => false),
            startWith(true)
        );
    }

    /* Клик по каналу */
    onChannelClick(id: string): void {
        this.selectedChannelIdSubject.next(id);
        this.stepper?.next();
    }

    /* Пост сгенерирован */
    onPostGenerated(newPost: string): void {
        // Можно обновить список или вывести snackbar
    }
}
