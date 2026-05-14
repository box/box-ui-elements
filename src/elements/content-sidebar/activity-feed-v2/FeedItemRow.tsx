/**
 * @file Renders a single feed item row for ActivityFeedV2
 * @author Box
 */

import * as React from 'react';
import noop from 'lodash/noop';

import { ActivityFeed } from '@box/activity-feed';
import { AnnotationBadgeType, serializeMentionMarkup } from '@box/threaded-annotations';

import type { Annotation, AnnotationPermission, Target } from '../../../common/types/annotations';
import type { BoxCommentPermission, CommentFeedItemType, FeedItemStatus } from '../../../common/types/feed';
import type { TaskNew } from '../../../common/types/tasks';

import type {
    AnnotationBadgeTargetType,
    TransformedCommentItem,
    TransformedFeedItem,
    UserSelectorProps,
} from './types';

import { FEED_ITEM_TYPE_ANNOTATION, FEED_ITEM_TYPE_COMMENT } from '../../../constants';

type EditorContent = Parameters<typeof serializeMentionMarkup>[0];

type FeedItemRowProps = {
    currentUserId?: string;
    isDisabled: boolean;
    item: TransformedFeedItem;
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
    userSelectorProps: UserSelectorProps;
};

const annotationTargetToBadge = (target?: Target): AnnotationBadgeTargetType | undefined => {
    if (!target) return undefined;

    const targetType = target.type as string;
    const page = target.location?.value ?? 0;

    switch (targetType) {
        case 'drawing':
            return { page, type: AnnotationBadgeType.Drawing };
        case 'highlight':
            return { highlightedText: '', page, type: AnnotationBadgeType.Highlight };
        case 'point':
            return { page, type: AnnotationBadgeType.Point };
        case 'region':
            return { page, type: AnnotationBadgeType.Region };
        default:
            return undefined;
    }
};

const serializeEditorContent = (content: unknown): { hasMention: boolean; text: string } | null => {
    try {
        return serializeMentionMarkup(content as EditorContent);
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error('ActivityFeedV2: failed to serialize editor content', error);
        return null;
    }
};

const buildReplyPost =
    (
        parentId: string,
        parentType: CommentFeedItemType,
        isDisabled: boolean,
        onReplyCreate?: (parentId: string, parentType: CommentFeedItemType, text: string) => void,
    ) =>
    async (content: unknown) => {
        if (isDisabled || !onReplyCreate) return;
        const serialized = serializeEditorContent(content);
        if (!serialized || !serialized.text.trim()) return;
        onReplyCreate(parentId, parentType, serialized.text);
    };

const findMessagePermissions = (
    messages: TransformedCommentItem['messages'],
    id: string,
): BoxCommentPermission | undefined => {
    const message = messages.find(m => m.id === id);
    if (!message) return undefined;
    const { canDelete, canEdit, canReply, canResolve } = message.permissions;
    return {
        can_delete: canDelete,
        can_edit: canEdit,
        can_reply: canReply,
        can_resolve: canResolve,
    };
};

const logEditError = (error: unknown): string | undefined => {
    // eslint-disable-next-line no-console
    console.error('ActivityFeedV2: failed to save edit', error);
    return undefined;
};

const FeedItemRow = ({
    currentUserId,
    isDisabled,
    item,
    onAnnotationCopyLink,
    onAnnotationDelete,
    onAnnotationEdit,
    onAnnotationSelect,
    onAnnotationStatusChange,
    onCommentCopyLink,
    onCommentDelete,
    onCommentUpdate,
    onReplyCreate,
    onReplyUpdate,
    onTaskDelete,
    onTaskView,
    onVersionHistoryClick,
    userSelectorProps,
}: FeedItemRowProps) => {
    switch (item.type) {
        case 'comment': {
            const { permissions } = item;
            const handleDelete = (id: string) => {
                if (isDisabled) return;
                onCommentDelete?.({ id, permissions });
            };
            const handleStatusChange = (status: FeedItemStatus) => (id: string) => {
                if (isDisabled) return;
                onCommentUpdate?.(id, item.originalText, status, false, permissions);
            };
            const handleEdit = (id: string, content: unknown) => {
                if (isDisabled) return;
                const serialized = serializeEditorContent(content);
                if (!serialized || !serialized.text.trim()) return;
                if (id === item.id) {
                    onCommentUpdate?.(id, serialized.text, undefined, serialized.hasMention, permissions);
                    return;
                }
                const replyPermissions = findMessagePermissions(item.messages, id);
                if (!replyPermissions) {
                    // eslint-disable-next-line no-console
                    console.error(`ActivityFeedV2: no permissions found for reply "${id}" in thread "${item.id}"`);
                    return;
                }
                onReplyUpdate?.({ id, parentId: item.id, permissions: replyPermissions, text: serialized.text });
            };
            return (
                <ActivityFeed.List.ThreadedAnnotation
                    key={item.id}
                    isAnnotations={false}
                    isEditDisabled={isDisabled || item.isResolved}
                    isResolved={item.isResolved}
                    messages={item.messages}
                    onAvatarClick={noop}
                    onCopyLink={
                        onCommentCopyLink ? (id: string) => onCommentCopyLink({ id, rootId: item.id }) : undefined
                    }
                    onDelete={handleDelete}
                    onEdit={handleEdit}
                    onEditError={logEditError}
                    onPost={buildReplyPost(item.id, FEED_ITEM_TYPE_COMMENT, isDisabled, onReplyCreate)}
                    onResolve={handleStatusChange('resolved')}
                    onThreadDelete={() => handleDelete(item.id)}
                    onUnresolve={handleStatusChange('open')}
                    resolvedAt={item.resolvedAt}
                    resolvedBy={item.resolvedBy}
                    userSelectorProps={userSelectorProps}
                />
            );
        }

        case 'annotation': {
            const { permissions } = item.annotation;
            const handleDelete = (id: string) => {
                if (isDisabled) return;
                onAnnotationDelete?.({ id, permissions });
            };
            const handleStatusChange = (status: FeedItemStatus) => (id: string) => {
                if (isDisabled) return;
                onAnnotationStatusChange?.({ id, permissions, status });
            };
            const handleEdit = (id: string, content: unknown) => {
                if (isDisabled) return;
                const serialized = serializeEditorContent(content);
                if (!serialized || !serialized.text.trim()) return;
                if (id === item.id) {
                    onAnnotationEdit?.({ id, permissions, text: serialized.text });
                    return;
                }
                const replyPermissions = findMessagePermissions(item.messages, id);
                if (!replyPermissions) {
                    // eslint-disable-next-line no-console
                    console.error(`ActivityFeedV2: no permissions found for reply "${id}" in thread "${item.id}"`);
                    return;
                }
                onReplyUpdate?.({ id, parentId: item.id, permissions: replyPermissions, text: serialized.text });
            };
            return (
                <ActivityFeed.List.ThreadedAnnotation
                    key={item.id}
                    annotationTarget={annotationTargetToBadge(item.annotation.target)}
                    isAnnotations={false}
                    isEditDisabled={isDisabled || item.isResolved}
                    isResolved={item.isResolved}
                    messages={item.messages}
                    onAnnotationBadgeClick={() => onAnnotationSelect?.(item.annotation)}
                    onAvatarClick={noop}
                    onCopyLink={
                        onAnnotationCopyLink ? (id: string) => onAnnotationCopyLink({ id, rootId: item.id }) : undefined
                    }
                    onDelete={handleDelete}
                    onEdit={handleEdit}
                    onEditError={logEditError}
                    onPost={buildReplyPost(item.id, FEED_ITEM_TYPE_ANNOTATION, isDisabled, onReplyCreate)}
                    onResolve={handleStatusChange('resolved')}
                    onThreadDelete={() => handleDelete(item.id)}
                    onUnresolve={handleStatusChange('open')}
                    resolvedAt={item.resolvedAt}
                    resolvedBy={item.resolvedBy}
                    userSelectorProps={userSelectorProps}
                />
            );
        }

        case 'task':
            return (
                <ActivityFeed.List.Task
                    key={item.id}
                    {...item.props}
                    disabled={isDisabled}
                    onDelete={onTaskDelete ? () => onTaskDelete(item.originalTask) : undefined}
                    onView={
                        onTaskView
                            ? (taskId: string) => onTaskView(taskId, currentUserId === item.props.author.id)
                            : undefined
                    }
                />
            );

        case 'version':
            return (
                <ActivityFeed.List.Version
                    key={item.id}
                    {...item.props}
                    onVersionClick={
                        onVersionHistoryClick
                            ? ({ id, versionNumber }: { id: string; versionNumber: number }) =>
                                  onVersionHistoryClick({ id, version_number: versionNumber })
                            : undefined
                    }
                />
            );

        case 'app_activity':
            return <ActivityFeed.List.AppActivity key={item.id} {...item.props} />;

        default:
            return null;
    }
};

export default FeedItemRow;
