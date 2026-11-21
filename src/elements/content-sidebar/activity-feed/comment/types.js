// @flow
import type { AnnotationPermission, BoxCommentPermission, FeedItemStatus } from '../../../../common/types/feed';

export type OnAnnotationEdit = (args: { id: string, permissions: AnnotationPermission, text?: string }) => void;

export type OnAnnotationStatusChange = (args: {
    id: string,
    permissions: AnnotationPermission,
    status: FeedItemStatus,
}) => void;

export type OnCommentEdit = (args: {
    hasMention: boolean,
    id: string,
    onError?: Function,
    onSuccess?: Function,
    permissions: BoxCommentPermission,
    status?: FeedItemStatus,
    text?: string,
}) => void;

export type OnCommentStatusChange = (args: {
    hasMention?: boolean,
    id: string,
    permissions: BoxCommentPermission,
    status: FeedItemStatus,
}) => void;
