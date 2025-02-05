import type { AnnotationPermission, BoxCommentPermission, FeedItemStatus } from '../../../../common/types/feed';

export interface OnAnnotationEditArgs {
    id: string;
    permissions: AnnotationPermission;
    text?: string;
}

export type OnAnnotationEdit = (args: OnAnnotationEditArgs) => void;

export interface OnAnnotationStatusChangeArgs {
    id: string;
    permissions: AnnotationPermission;
    status: FeedItemStatus;
}

export type OnAnnotationStatusChange = (args: OnAnnotationStatusChangeArgs) => void;

export interface OnCommentEditArgs {
    hasMention: boolean;
    id: string;
    onError?: () => void;
    onSuccess?: () => void;
    permissions: BoxCommentPermission;
    status?: FeedItemStatus;
    text?: string;
}

export type OnCommentEdit = (args: OnCommentEditArgs) => void;

export interface OnCommentStatusChangeArgs {
    hasMention?: boolean;
    id: string;
    permissions: BoxCommentPermission;
    status: FeedItemStatus;
}

export type OnCommentStatusChange = (args: OnCommentStatusChangeArgs) => void;
