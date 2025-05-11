export type PostActionType = 'edit' | 'publish';

export interface PostAction {
    postId: string;
    type: PostActionType;
}
