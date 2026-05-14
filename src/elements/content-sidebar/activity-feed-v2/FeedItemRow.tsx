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

import type { AnnotationBadgeTargetType, TransformedFeedItem, UserSelectorProps } from './types';

import { FEED_ITEM_TYPE_ANNOTATION, FEED_ITEM_TYPE_COMMENT } from '../../../constants';

type FeedItemRowProps = {
    currentUserId?: string;
    isDisabled: boolean;
    item: TransformedFeedItem;
    onAnnotationDelete?: (params: { id: string; permissions: AnnotationPermission }) => void;
    onAnnotationSelect?: (annotation: Annotation) => void;
    onAnnotationStatusChange?: (params: {
        id: string;
        permissions: AnnotationPermission;
        status: FeedItemStatus;
    }) => void;
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
            return { highlightedText: '', type: AnnotationBadgeType.Highlight };
        case 'point':
            return { page, type: AnnotationBadgeType.Point };
        case 'region':
            return { page, type: AnnotationBadgeType.Region };
        default:
            return undefined;
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
        let serialized;
        try {
            serialized = serializeMentionMarkup(content as Parameters<typeof serializeMentionMarkup>[0]);
        } catch {
            return;
        }
        if (!serialized.text.trim()) return;
        onReplyCreate(parentId, parentType, serialized.text);
    };

const FeedItemRow = ({
    currentUserId,
    isDisabled,
    item,
    onAnnotationDelete,
    onAnnotationSelect,
    onAnnotationStatusChange,
    onCommentDelete,
    onCommentUpdate,
    onReplyCreate,
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
            return (
                <ActivityFeed.List.ThreadedAnnotation
                    key={item.id}
                    isAnnotations={false}
                    isResolved={item.isResolved}
                    messages={item.messages}
                    onAvatarClick={noop}
                    onDelete={handleDelete}
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
            return (
                <ActivityFeed.List.ThreadedAnnotation
                    key={item.id}
                    annotationTarget={annotationTargetToBadge(item.annotation.target)}
                    isAnnotations={false}
                    isResolved={item.isResolved}
                    messages={item.messages}
                    onAnnotationBadgeClick={() => onAnnotationSelect?.(item.annotation)}
                    onAvatarClick={noop}
                    onDelete={handleDelete}
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
