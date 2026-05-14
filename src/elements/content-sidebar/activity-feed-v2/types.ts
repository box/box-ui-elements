/**
 * @file Types for ActivityFeedV2 adapter
 * @author Box
 */

import type { AppActivityItemProps, TaskItemProps, VersionItemProps } from '@box/activity-feed';
import type { TextMessageTypeV2 as TextMessageType } from '@box/threaded-annotations';

import type { Annotation, AnnotationPermission } from '../../../common/types/annotations';
import type { BoxCommentPermission, CommentFeedItemType, FeedItems, FeedItemStatus } from '../../../common/types/feed';
import type { User } from '../../../common/types/core';
import type { TaskNew } from '../../../common/types/tasks';

export type { AppActivityItemProps, TaskItemProps, VersionItemProps } from '@box/activity-feed';
export type { AnnotationBadgeTargetType } from '@box/threaded-annotations';

export type UserContact = {
    email: string;
    id: number;
    name: string;
    value: string;
};

export type UserSelectorProps = {
    ariaRoleDescription: string;
    fetchAvatarUrls: (userContacts: UserContact[]) => Promise<Record<string, string>>;
    fetchUsers: (inputValue: string) => Promise<UserContact[]>;
    loadingAriaLabel: string;
};

type ResolvedInfo = {
    isResolved: boolean;
    resolvedAt?: number;
    resolvedBy?: string;
};

export type TransformedCommentItem = {
    id: string;
    messages: TextMessageType[];
    originalText: string;
    permissions: BoxCommentPermission;
    status?: string;
    type: 'comment';
} & ResolvedInfo;

export type TransformedAnnotationItem = {
    annotation: Annotation;
    id: string;
    messages: TextMessageType[];
    permissions: AnnotationPermission;
    status?: string;
    type: 'annotation';
} & ResolvedInfo;

export type TransformedFeedItem =
    | TransformedAnnotationItem
    | TransformedCommentItem
    | { type: 'task'; id: string; originalTask: TaskNew; props: TaskItemProps }
    | { type: 'version'; id: string; props: VersionItemProps }
    | { type: 'app_activity'; id: string; props: AppActivityItemProps };

export type ActivityFeedV2Props = {
    activeFeedEntryId?: string;
    approverSelectorContacts?: Array<Record<string, unknown>>;
    createTask?: (...args: Array<unknown>) => void;
    currentUser?: User;
    feedItems?: FeedItems;
    getApproverWithQuery?: (searchStr: string) => void;
    getAvatarUrl?: (userId: string) => Promise<string | null | undefined>;
    getMentionAsync?: (searchStr: string) => Promise<Array<Record<string, unknown>>>;
    hasTasks?: boolean;
    isDisabled?: boolean;
    onAnnotationCopyLink?: (params: { id: string; rootId: string }) => void;
    onAnnotationDelete?: (params: { id: string; permissions: AnnotationPermission }) => void;
    onAnnotationEdit?: (params: { id: string; permissions: AnnotationPermission; text: string }) => void;
    onAnnotationSelect?: (annotation: Annotation) => void;
    onAnnotationStatusChange?: (params: {
        id: string;
        permissions: AnnotationPermission;
        status: FeedItemStatus;
    }) => void;
    onCommentCopyLink?: (params: { id: string; rootId: string }) => void;
    onCommentCreate?: (text: string, hasMention: boolean) => void;
    onCommentDelete?: (params: { id: string; permissions: BoxCommentPermission }) => void;
    onCommentUpdate?: (
        id: string,
        text: string | undefined,
        status: FeedItemStatus | undefined,
        hasMention: boolean,
        permissions: BoxCommentPermission,
        onSuccess?: (() => void) | null,
        onError?: (() => void) | null,
    ) => void;
    onReplyCreate?: (parentId: string, parentType: CommentFeedItemType, text: string) => void;
    onReplyUpdate?: (params: {
        id: string;
        onError?: () => void;
        onSuccess?: () => void;
        parentId: string;
        permissions: BoxCommentPermission;
        text: string;
    }) => void;
    onTaskDelete?: (task: TaskNew) => void;
    onTaskView?: (id: string, isCreator: boolean) => void;
    onVersionHistoryClick?: (version: { id: string; version_number: number }) => void;
};
