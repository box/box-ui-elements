/**
 * @file Renders a single feed item row for ActivityFeedV2
 * @author Box
 */

import * as React from 'react';
import noop from 'lodash/noop';

import { ActivityFeed } from '@box/activity-feed';

import type { Annotation, AnnotationPermission } from '../../../common/types/annotations';
import type { BoxCommentPermission, CommentFeedItemType, FeedItemStatus } from '../../../common/types/feed';
import type { TaskCollabStatus, TaskNew } from '../../../common/types/tasks';
import type { TimeFormat } from './useTimeFormat';

import { dispatchReplyDelete, dispatchReplyEdit, logEditError, serializeEditorContent } from './helpers';
import { annotationTargetToBadge } from './transformers';
import { formatByTimeFormat } from './useTimeFormat';
import { seekVideoToMs } from './useVideoTimestamp';

import type { OnReplyDelete, OnReplyUpdate, TransformedFeedItem, UserSelectorProps } from './types';

import {
    FEED_ITEM_TYPE_ANNOTATION,
    FEED_ITEM_TYPE_COMMENT,
    TASK_NEW_APPROVED,
    TASK_NEW_COMPLETED,
    TASK_NEW_NOT_STARTED,
    TASK_NEW_REJECTED,
} from '../../../constants';

type FeedItemRowProps = {
    currentUserId?: string;
    fps: number;
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
    onReplyDelete?: OnReplyDelete;
    onReplyUpdate?: OnReplyUpdate;
    onTaskAssignmentUpdate?: (taskId: string, taskAssignmentId: string, status: TaskCollabStatus) => void;
    onTaskDelete?: (task: TaskNew) => void;
    onTaskEdit?: (task: TaskNew) => void;
    onTaskView?: (id: string, isCreator: boolean) => void;
    onVersionHistoryClick?: (version: { id: string; version_number: number }) => void;
    timeFormat: TimeFormat;
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
    fps,
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
    onReplyDelete,
    onReplyUpdate,
    onTaskAssignmentUpdate,
    onTaskDelete,
    onTaskEdit,
    onTaskView,
    onVersionHistoryClick,
    timeFormat,
    userSelectorProps,
}: FeedItemRowProps) => {
    switch (item.type) {
        case 'comment': {
            const { permissions } = item;
            const handleDelete = (id: string) => {
                if (isDisabled) return;
                if (id === item.id) {
                    onCommentDelete?.({ id, permissions });
                    return;
                }
                dispatchReplyDelete({ id, messages: item.messages, onReplyDelete, parentId: item.id });
            };
            const handleStatusChange = (status: FeedItemStatus) => (id: string) => {
                if (isDisabled) return;
                onCommentUpdate?.(id, undefined, status, false, permissions);
            };
            const handleEdit = (id: string, content: unknown) => {
                if (isDisabled) return;
                const serialized = serializeEditorContent(content);
                if (!serialized || !serialized.text.trim()) return;
                if (id === item.id) {
                    const text = item.annotationTimestampMarkup
                        ? `${item.annotationTimestampMarkup} ${serialized.text}`
                        : serialized.text;
                    onCommentUpdate?.(id, text, undefined, serialized.hasMention, permissions);
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
            const timestampMs = item.annotationTimestampMs;
            const handleBadgeClick = timestampMs !== undefined ? () => seekVideoToMs(timestampMs) : undefined;
            const commentAnnotationTarget =
                item.annotationTarget && timestampMs !== undefined
                    ? { ...item.annotationTarget, timestamp: formatByTimeFormat(timestampMs, timeFormat, fps) }
                    : item.annotationTarget;
            return (
                <ActivityFeed.List.ThreadedAnnotation
                    key={item.id}
                    annotationTarget={commentAnnotationTarget}
                    isAnnotations={false}
                    isEditDisabled={isDisabled || item.isResolved}
                    isResolved={item.isResolved}
                    messages={item.messages}
                    onAnnotationBadgeClick={handleBadgeClick}
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
                if (id === item.id) {
                    onAnnotationDelete?.({ id, permissions });
                    return;
                }
                dispatchReplyDelete({ id, messages: item.messages, onReplyDelete, parentId: item.id });
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
            const badgeTarget = annotationTargetToBadge(item.annotation.target);
            const annotationBadgeTarget =
                badgeTarget && 'timestamp' in badgeTarget && item.annotation.target?.location?.type === 'frame'
                    ? {
                          ...badgeTarget,
                          timestamp: formatByTimeFormat(item.annotation.target.location.value ?? 0, timeFormat, fps),
                      }
                    : badgeTarget;
            return (
                <ActivityFeed.List.ThreadedAnnotation
                    key={item.id}
                    annotationTarget={annotationBadgeTarget}
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

        case 'task': {
            const currentUserAssignment = currentUserId
                ? item.originalTask.assigned_to?.entries?.find(entry => entry.target?.id === currentUserId)
                : undefined;
            const canActOnAssignment =
                !!onTaskAssignmentUpdate &&
                !!currentUserAssignment &&
                currentUserAssignment.permissions?.can_update === true &&
                currentUserAssignment.status === TASK_NEW_NOT_STARTED;
            const handleAssignmentUpdate = (status: TaskCollabStatus) => {
                if (isDisabled || !canActOnAssignment) return;
                onTaskAssignmentUpdate?.(item.id, currentUserAssignment!.id, status);
            };
            return (
                <ActivityFeed.List.Task
                    key={item.id}
                    {...item.props}
                    disabled={isDisabled}
                    onApprove={canActOnAssignment ? () => handleAssignmentUpdate(TASK_NEW_APPROVED) : undefined}
                    onComplete={canActOnAssignment ? () => handleAssignmentUpdate(TASK_NEW_COMPLETED) : undefined}
                    onDelete={onTaskDelete ? () => onTaskDelete(item.originalTask) : undefined}
                    onEdit={onTaskEdit ? () => onTaskEdit(item.originalTask) : undefined}
                    onReject={canActOnAssignment ? () => handleAssignmentUpdate(TASK_NEW_REJECTED) : undefined}
                    onView={
                        onTaskView
                            ? (taskId: string) => onTaskView(taskId, currentUserId === item.props.author.id)
                            : undefined
                    }
                />
            );
        }

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
