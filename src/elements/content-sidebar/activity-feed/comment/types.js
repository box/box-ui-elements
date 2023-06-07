// @flow
import type { AnnotationPermission, BoxCommentPermission, FeedItemStatus } from '../../../../common/types/feed';

export type DiscussionItemType = {
    hasMention?: boolean,
    id: string,
    onError?: Function,
    onSuccess?: Function,
    permissions: BoxCommentPermission | AnnotationPermission,
    status?: FeedItemStatus,
    text?: string,
};
export type OnAnnotationEdit = DiscussionItemType => void;

export type OnCommentEdit = DiscussionItemType => void;
