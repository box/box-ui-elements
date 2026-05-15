/**
 * @file Renders a single feed item row for ActivityFeedV2
 * @author Box
 */

import * as React from 'react';
import noop from 'lodash/noop';

import { ActivityFeed } from '@box/activity-feed';

import type { Annotation, AnnotationPermission } from '../../../common/types/annotations';
import type { BoxCommentPermission, CommentFeedItemType, FeedItemStatus } from '../../../common/types/feed';
import type { TaskNew } from '../../../common/types/tasks';

import { dispatchReplyEdit, logEditError, serializeEditorContent } from './helpers';
import { annotationTargetToBadge } from './transformers';

import type { OnReplyUpdate, TransformedFeedItem, UserSelectorProps } from './types';

import { FEED_ITEM_TYPE_ANNOTATION, FEED_ITEM_TYPE_COMMENT } from '../../../constants';

type FeedItemRowProps = {
    currentUserId?: string;
    isDisabled: boolean;
    item: TransformedFeedItem;
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
    onReplyUpdate?: OnReplyUpdate;
    onTaskDelete?: (task: TaskNew) => void;
    onTaskView?: (id: string, isCreator: boolean) => void;
    onVersionHistoryClick?: (version: { id: string; version_number: number }) => void;
    userSelectorProps: UserSelectorProps;
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
                dispatchReplyEdit({
                    id,
                    messages: item.messages,
                    onReplyUpdate,
                    parentId: item.id,
                    text: serialized.text,
                });
            };
            return (
                <ActivityFeed.List.ThreadedAnnotation
                    key={item.id}
                    isAnnotations={false}
                    isEditDisabled={isDisabled || item.isResolved}
                    isResolved={item.isResolved}
                    messages={item.messages}
                    onAvatarClick={noop}
                    onCopyLink={onCommentCopyLink ? (id: string) => onCommentCopyLink({ id }) : undefined}
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
            const fileVersionId = item.annotation.file_version?.id;
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
                dispatchReplyEdit({
                    id,
                    messages: item.messages,
                    onReplyUpdate,
                    parentId: item.id,
                    text: serialized.text,
                });
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
                        onAnnotationCopyLink && fileVersionId
                            ? () => onAnnotationCopyLink({ annotationId: item.id, fileVersionId })
                            : undefined
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
