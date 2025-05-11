import { Post } from './post.model';

export type PostActionType = 'edit' | 'publish';

export interface PostAction {
    post: Post;
    action: PostActionType;
}
