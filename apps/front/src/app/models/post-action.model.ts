import { Post } from './post.model';

export type PostActionType = 'edit' | 'publish' | 'delete';

export interface PostAction {
    post: Post;
    action: PostActionType;
}
