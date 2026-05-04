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

import type { AnnotationBadgeTargetType, TransformedFeedItem, UserSelectorProps, VersionItemProps } from './types';

import { FEED_ITEM_TYPE_ANNOTATION, FEED_ITEM_TYPE_COMMENT } from '../../../constants';

type FeedItemRowProps = {
    currentUserId?: string;
    isDisabled: boolean;
    item: TransformedFeedItem;
    onAnnotationDelete?: (params: { id: string; permissions: AnnotationPermission }) => void;
    onAnnotationEdit?: (params: { id: string; permissions: AnnotationPermission; text: string }) => void;
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
    onVersionHistoryClick?: (version: VersionItemProps) => void;
    userSelectorProps: UserSelectorProps;
};

const annotationTargetToBadge = (target?: Target): AnnotationBadgeTargetType | undefined => {
    if (!target) return undefined;

    if (target.type === 'region') {
        return { page: target.location?.value ?? 0, type: AnnotationBadgeType.Region };
    }
    if (target.type === 'point') {
        return { page: target.location?.value ?? 0, type: AnnotationBadgeType.Point };
    }

    return undefined;
};

const handleReplyPost =
    (
        parentId: string,
        parentType: CommentFeedItemType,
        onReplyCreate?: (parentId: string, parentType: CommentFeedItemType, text: string) => void,
    ) =>
    async (content: unknown) => {
        if (!onReplyCreate) return;
        try {
            const { text } = serializeMentionMarkup(content as Parameters<typeof serializeMentionMarkup>[0]);
            onReplyCreate(parentId, parentType, text);
        } catch {
            // Silently ignore serialization failures from malformed editor content
        }
    };

const FeedItemRow = ({
    currentUserId,
    isDisabled,
    item,
    onAnnotationDelete,
    onAnnotationEdit,
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
        case 'comment':
            return (
                <ActivityFeed.List.ThreadedAnnotation
                    key={item.id}
                    isAnnotations={false}
                    isResolved={item.isResolved}
                    messages={item.messages}
                    onAvatarClick={noop}
                    onDelete={(id: string) => {
                        if (onCommentDelete) {
                            onCommentDelete({ id, permissions: item.permissions });
                        }
                    }}
                    onEdit={(id: string) => {
                        if (onCommentUpdate) {
                            onCommentUpdate(id, undefined, undefined, false, item.permissions, null, null);
                        }
                    }}
                    onPost={handleReplyPost(item.id, FEED_ITEM_TYPE_COMMENT, onReplyCreate)}
                    onResolve={(id: string) => {
                        if (onCommentUpdate) {
                            onCommentUpdate(id, item.originalText, 'resolved', false, item.permissions);
                        }
                    }}
                    onThreadDelete={() => {
                        if (onCommentDelete) {
                            onCommentDelete({ id: item.id, permissions: item.permissions });
                        }
                    }}
                    onUnresolve={(id: string) => {
                        if (onCommentUpdate) {
                            onCommentUpdate(id, item.originalText, 'open', false, item.permissions);
                        }
                    }}
                    resolvedAt={item.resolvedAt}
                    resolvedBy={item.resolvedBy}
                    userSelectorProps={userSelectorProps}
                />
            );

        case 'annotation':
            return (
                <ActivityFeed.List.ThreadedAnnotation
                    key={item.id}
                    annotationTarget={annotationTargetToBadge(item.annotation.target)}
                    isAnnotations={false}
                    isResolved={item.isResolved}
                    messages={item.messages}
                    onAnnotationBadgeClick={() => {
                        if (onAnnotationSelect) {
                            onAnnotationSelect(item.annotation);
                        }
                    }}
                    onAvatarClick={noop}
                    onDelete={(id: string) => {
                        if (onAnnotationDelete) {
                            onAnnotationDelete({ id, permissions: item.annotation.permissions });
                        }
                    }}
                    onEdit={(id: string) => {
                        if (onAnnotationEdit) {
                            onAnnotationEdit({ id, permissions: item.annotation.permissions, text: '' });
                        }
                    }}
                    onPost={handleReplyPost(item.id, FEED_ITEM_TYPE_ANNOTATION, onReplyCreate)}
                    onResolve={(id: string) => {
                        if (onAnnotationStatusChange) {
                            onAnnotationStatusChange({
                                id,
                                permissions: item.annotation.permissions,
                                status: 'resolved',
                            });
                        }
                    }}
                    onThreadDelete={() => {
                        if (onAnnotationDelete) {
                            onAnnotationDelete({ id: item.id, permissions: item.annotation.permissions });
                        }
                    }}
                    onUnresolve={(id: string) => {
                        if (onAnnotationStatusChange) {
                            onAnnotationStatusChange({
                                id,
                                permissions: item.annotation.permissions,
                                status: 'open',
                            });
                        }
                    }}
                    resolvedAt={item.resolvedAt}
                    resolvedBy={item.resolvedBy}
                    userSelectorProps={userSelectorProps}
                />
            );

        case 'task':
            return (
                <ActivityFeed.List.Task
                    key={item.id}
                    {...item.props}
                    disabled={isDisabled}
                    onDelete={onTaskDelete ? () => onTaskDelete(item.props as unknown as TaskNew) : undefined}
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
                    onVersionClick={onVersionHistoryClick ? () => onVersionHistoryClick(item.props) : undefined}
                />
            );

        case 'app_activity':
            return <ActivityFeed.List.AppActivity key={item.id} {...item.props} />;

        default:
            return null;
    }
};

export default FeedItemRow;
