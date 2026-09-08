/**
 * @file Types for ActivityFeedV2 adapter
 * @author Box
 */

import type { AppActivityItemProps, TaskItemProps, VersionItemProps } from '@box/activity-feed';
import type { AnnotationBadgeTargetType, TextMessageTypeV2 as TextMessageType } from '@box/threaded-annotations';
import type { UserContactType } from '@box/user-selector';

import type { Annotation, AnnotationPermission } from '../../../common/types/annotations';
import type { BoxCommentPermission, CommentFeedItemType, FeedItems, FeedItemStatus } from '../../../common/types/feed';
import type { GroupMini, SelectorItem, User, UserMini } from '../../../common/types/core';
import type { TaskAssigneeCollection, TaskCollabStatus, TaskNew, TaskUpdatePayload } from '../../../common/types/tasks';

export type { AppActivityItemProps, TaskItemProps, VersionItemProps } from '@box/activity-feed';
export type { AnnotationBadgeTargetType } from '@box/threaded-annotations';

// Keyed by Box user id. Populated asynchronously by useAvatarUrls.
export type AvatarUrlMap = Readonly<Record<string, string>>;

export type GetAvatarUrl = (userId: string) => Promise<string | null | undefined>;

export type UserSelectorProps = {
    ariaRoleDescription: string;
    fetchAvatarUrls: (userContacts: UserContactType[]) => Promise<Record<string, string>>;
    fetchUsers: (inputValue: string) => Promise<UserContactType[]>;
    loadingAriaLabel: string;
};

export type OnReplyDelete = (params: { id: string; parentId: string; permissions: BoxCommentPermission }) => void;

export type OnReplyUpdate = (params: {
    id: string;
    onError?: () => void;
    onSuccess?: () => void;
    parentId: string;
    permissions: BoxCommentPermission;
    text: string;
}) => void;

type ResolvedInfo = {
    isResolved: boolean;
    resolvedAt?: number;
    resolvedBy?: string;
};

export type TransformedCommentItem = {
    annotationTarget?: AnnotationBadgeTargetType;
    // End of a comment's time range. Undefined for single-timestamp comments.
    annotationTimestampEndMs?: number;
    annotationTimestampMarkup?: string;
    annotationTimestampMs?: number;
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

export type ActivityFeedV2File = {
    extension?: string;
    file_version?: { id: string };
    id?: string;
    permissions?: {
        can_comment?: boolean;
    };
};

/**
 * Draft range the composer is holding, sent to the viewer so it can draw handles on the waveform.
 * A null end means the composer still holds a single timestamp and the handles sit collapsed at the start.
 */
export type CommentRangeDraft = {
    endMs: number | null;
    startMs: number;
};

export type ViewerHandle = {
    addListener: (event: string, handler: (payload: unknown) => void) => void;
    emit: (event: string, payload: unknown) => void;
    isDestroyed?: () => boolean;
    pause?: () => void;
    removeListener: (event: string, handler: (payload: unknown) => void) => void;
    setMediaTime?: (time: number) => void;
};

export type PreviewHandle = {
    getCurrentViewer?: () => ViewerHandle | null;
};

export type ActivityFeedV2Props = {
    activeFeedEntryId?: string;
    createTask?: (...args: Array<unknown>) => void;
    currentUser?: User;
    feedItems?: FeedItems;
    file?: ActivityFeedV2File;
    getApproverAsync?: (searchStr: string) => Promise<SelectorItem<UserMini | GroupMini>[]>;
    getAvatarUrl?: GetAvatarUrl;
    getMentionAsync?: (searchStr: string) => Promise<SelectorItem<UserMini | GroupMini>[]>;
    getTaskCollaborators?: (task: TaskNew) => Promise<TaskAssigneeCollection>;
    getViewer?: () => ViewerHandle | null;
    getPreview?: () => PreviewHandle | null;
    hasTasks?: boolean;
    isAudioPlayerV2Enabled?: boolean;
    isDisabled?: boolean;
    isRichTextEnabled?: boolean;
    isTimestampedCommentsEnabled?: boolean;
    onAnnotationCopyLink?: (params: { annotationId: string; fileVersionId: string }) => void;
    onAnnotationDelete?: (params: { id: string; permissions: AnnotationPermission }) => void;
    onAnnotationEdit?: (params: { id: string; permissions: AnnotationPermission; text: string }) => void;
    onAnnotationSelect?: (annotation: Annotation) => void;
    onAnnotationStatusChange?: (params: {
        id: string;
        permissions: AnnotationPermission;
        status: FeedItemStatus;
    }) => void;
    onCommentCopyLink?: (params: { id: string }) => void;
    onCommentCreate?: (text: string, hasMention: boolean) => void;
    onCommentDelete?: (params: { id: string; permissions: BoxCommentPermission }) => void;
    onCommentSelect?: (commentId: string) => void;
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
    onReplyDelete?: OnReplyDelete;
    onReplyUpdate?: OnReplyUpdate;
    onShowOnlyMentionsMeChange?: (checked: boolean) => void;
    onShowResolvedChange?: (checked: boolean) => void;
    onTaskAssignmentUpdate?: (taskId: string, taskAssignmentId: string, status: TaskCollabStatus) => void;
    onTaskDelete?: (task: TaskNew) => void;
    onTaskUpdate?: (
        task: TaskUpdatePayload,
        onSuccess?: () => void,
        onError?: (error: unknown, code?: string) => void,
    ) => void;
    onTaskView?: (id: string, isCreator: boolean) => void;
    onVersionHistoryClick?: (version: { id: string; version_number: number }) => void;
    showOnlyMentionsMe?: boolean;
    showResolved?: boolean;
};
