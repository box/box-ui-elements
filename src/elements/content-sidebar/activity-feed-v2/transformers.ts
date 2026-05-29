/**
 * @file Transforms BUIE FeedItems into @box/activity-feed component props.
 *
 * Read data comes from the file activities endpoint (already parsed into BUIE FeedItem types).
 * Write/mutate operations still use the traditional v2 API via ActivitySidebar callbacks.
 * @author Box
 */

import { TaskCompletionRule, TaskType } from '@box/activity-feed';
import { AnnotationBadgeType } from '@box/threaded-annotations';
import type {
    DocumentNodeV2 as DocumentNode,
    MentionNodeV2 as MentionNode,
    ParagraphNodeV2 as ParagraphNode,
    Permissions,
    TextMessageAuthorTypeV2 as TextMessageAuthorType,
    TextMessageTypeV2 as TextMessageType,
    TextNodeV2 as TextNode,
} from '@box/threaded-annotations';

import { convertMillisecondsToTimestamp } from '../../../utils/timestamp';

import type { Annotation, Target } from '../../../common/types/annotations';
import type { AppActivityItem as BUIEAppActivityItem, Comment, FeedItem } from '../../../common/types/feed';
import type { BoxItemVersion, User } from '../../../common/types/core';
import type { TaskNew } from '../../../common/types/tasks';

import type {
    AnnotationBadgeTargetType,
    AppActivityItemProps,
    TaskItemProps,
    TransformedFeedItem,
    VersionItemProps,
} from './types';

import {
    FEED_ITEM_TYPE_ANNOTATION,
    FEED_ITEM_TYPE_APP_ACTIVITY,
    FEED_ITEM_TYPE_COMMENT,
    FEED_ITEM_TYPE_TASK,
    FEED_ITEM_TYPE_VERSION,
} from '../../../constants';

const MENTION_REGEX = /@\[(\d+):([^\]]+)\]/g;

const parseLine = (line: string, authorId: string): (MentionNode | TextNode)[] => {
    const nodes: (MentionNode | TextNode)[] = [];
    let lastIndex = 0;

    MENTION_REGEX.lastIndex = 0;

    let match = MENTION_REGEX.exec(line);
    while (match !== null) {
        const [fullMatch, userId, userName] = match;
        const { index } = match;

        if (index > lastIndex) {
            nodes.push({ type: 'text', text: line.slice(lastIndex, index) });
        }

        nodes.push({
            type: 'mention',
            attrs: {
                authorId,
                mentionId: userId,
                mentionedUserId: userId,
                mentionedUserName: userName,
            },
        });

        lastIndex = index + fullMatch.length;
        match = MENTION_REGEX.exec(line);
    }

    if (lastIndex < line.length) {
        nodes.push({ type: 'text', text: line.slice(lastIndex) });
    }

    return nodes;
};

export const textToDocumentNode = (text: string, authorId: string): DocumentNode => {
    if (!text) {
        return { type: 'doc', content: [] };
    }

    const lines = text.split('\n');
    const content: ParagraphNode[] = lines.map(line => {
        const nodes = parseLine(line, authorId);
        return {
            type: 'paragraph' as const,
            ...(nodes.length > 0 ? { content: nodes } : {}),
        };
    });

    return { type: 'doc', content };
};

const toUnixMs = (isoDate?: string | null): number | undefined => {
    if (!isoDate) return undefined;
    const ms = new Date(isoDate).getTime();
    return Number.isNaN(ms) ? undefined : ms;
};

const toUpdatedAt = (createdAt: string, modifiedAt: string): number | undefined => {
    if (modifiedAt === createdAt) return undefined;
    return toUnixMs(modifiedAt);
};

const toUserAuthor = (user?: User | null): TextMessageAuthorType => ({
    avatarUrl: user?.avatar_url,
    email: user?.email ?? user?.login ?? '',
    id: Number(user?.id) || 0,
    name: user?.name ?? '',
});

const toPermissions = (
    permissions?: { can_delete?: boolean; can_edit?: boolean; can_reply?: boolean; can_resolve?: boolean } | null,
): Permissions => ({
    canDelete: permissions?.can_delete ?? false,
    canEdit: permissions?.can_edit ?? false,
    canReply: permissions?.can_reply ?? false,
    canResolve: permissions?.can_resolve ?? false,
});

const commentToTextMessage = (comment: Comment): TextMessageType => ({
    author: toUserAuthor(comment.created_by),
    createdAt: toUnixMs(comment.created_at) ?? 0,
    id: comment.id,
    message: textToDocumentNode(comment.tagged_message || comment.message || '', comment.created_by?.id ?? ''),
    permissions: toPermissions(comment.permissions),
    updatedAt: toUpdatedAt(comment.created_at, comment.modified_at),
});

export const transformCommentToMessages = (comment: Comment): TextMessageType[] => {
    const root = commentToTextMessage(comment);
    const replies = (comment.replies ?? []).map(reply => commentToTextMessage(reply));
    return [root, ...replies];
};

export const annotationTargetToBadge = (target?: Target): AnnotationBadgeTargetType | undefined => {
    if (!target) return undefined;

    if (target.location?.type === 'frame') {
        return {
            timestamp: convertMillisecondsToTimestamp(target.location.value ?? 0),
            type: AnnotationBadgeType.Frame,
        };
    }

    const page = target.location?.value ?? 0;

    switch (target.type) {
        case 'drawing':
            return { page, type: AnnotationBadgeType.Drawing };
        case 'highlight':
            return { highlightedText: target.text ?? '', page, type: AnnotationBadgeType.Highlight };
        case 'point':
            return { page, type: AnnotationBadgeType.Point };
        case 'region':
            return { page, type: AnnotationBadgeType.Region };
        default:
            return undefined;
    }
};

export const transformAnnotationToMessages = (annotation: Annotation): TextMessageType[] => {
    const messageText = annotation.description?.message ?? '';
    const root: TextMessageType = {
        author: toUserAuthor(annotation.created_by),
        createdAt: toUnixMs(annotation.created_at) ?? 0,
        id: annotation.id,
        message: textToDocumentNode(messageText, annotation.created_by?.id ?? ''),
        permissions: toPermissions(annotation.permissions),
        updatedAt: toUpdatedAt(annotation.created_at, annotation.modified_at),
    };
    const replies = (annotation.replies ?? []).map(reply => commentToTextMessage(reply));
    return [root, ...replies];
};

export const transformTaskToProps = (task: TaskNew, currentUserId?: string): TaskItemProps => ({
    assignees: (task.assigned_to?.entries ?? []).map(entry => ({
        avatarUrl: entry.target?.avatar_url,
        completedAt: toUnixMs(entry.completed_at),
        id: entry.target?.id ?? entry.id,
        name: entry.target?.name ?? '',
        permissions: entry.permissions
            ? { canDelete: entry.permissions.can_delete, canUpdate: entry.permissions.can_update }
            : undefined,
        status: entry.status as TaskItemProps['assignees'][number]['status'],
    })),
    author: {
        avatarUrl: task.created_by?.target?.avatar_url,
        id: task.created_by?.target?.id ?? '',
        name: task.created_by?.target?.name ?? '',
    },
    completedAt: toUnixMs(task.completed_at),
    completionRule:
        task.completion_rule === 'ALL_ASSIGNEES' ? TaskCompletionRule.ALL_ASSIGNEES : TaskCompletionRule.ANY_ASSIGNEE,
    createdAt: toUnixMs(task.created_at) ?? 0,
    currentUserId,
    description: task.description,
    dueDate: toUnixMs(task.due_at),
    hasNextPage: Boolean(task.assigned_to?.next_marker),
    id: task.id,
    permissions: {
        canCreateTaskCollaborator: task.permissions?.can_create_task_collaborator ?? false,
        canCreateTaskLink: task.permissions?.can_create_task_link ?? false,
        canDelete: task.permissions?.can_delete ?? false,
        canUpdate: task.permissions?.can_update ?? false,
    },
    status: task.status as TaskItemProps['status'],
    taskType: task.task_type === 'APPROVAL' ? TaskType.APPROVAL : TaskType.GENERAL,
});

const mapActionTypeString = (actionType?: string): VersionItemProps['actionType'] | undefined => {
    switch (actionType) {
        case 'delete':
        case 'trashed':
            return 'delete';
        case 'promote':
        case 'promoted':
            return 'promote';
        case 'restore':
        case 'restored':
            return 'restore';
        case 'upload':
        case 'created':
            return 'upload';
        default:
            return undefined;
    }
};

const getVersionAction = (version: BoxItemVersion): VersionItemProps['actionType'] => {
    if (version.version_promoted) return 'promote';
    if (version.restored_at) return 'restore';
    if (version.trashed_at) return 'delete';
    return mapActionTypeString(version.action_type) ?? 'upload';
};

const getVersionUser = (version: BoxItemVersion): User | undefined =>
    version.restored_by || version.trashed_by || version.promoted_by || version.modified_by || undefined;

export const transformVersionToProps = (version: BoxItemVersion): VersionItemProps => {
    const user = getVersionUser(version);
    return {
        actionType: getVersionAction(version),
        authorName: user?.name ?? version.uploader_display_name,
        avatarUrl: user?.avatar_url,
        createdAt: toUnixMs(version.created_at),
        id: version.id,
        versionNumber: parseInt(version.version_number, 10) || version.version_end || 0,
    };
};

export const transformAppActivityToProps = (item: BUIEAppActivityItem): AppActivityItemProps => ({
    appIconUrl: item.app?.icon_url ?? '',
    appName: item.app?.name ?? '',
    createdAt: toUnixMs(item.created_at) ?? 0,
    id: item.id,
    renderedText: item.rendered_text ?? '',
});

export const transformFeedItem = (item: FeedItem, currentUserId?: string): TransformedFeedItem | null => {
    switch (item.type) {
        case FEED_ITEM_TYPE_COMMENT: {
            const comment = item as unknown as Comment;
            const commentIsResolved = comment.status === 'resolved';
            return {
                id: comment.id,
                isResolved: commentIsResolved,
                messages: transformCommentToMessages(comment),
                originalText: comment.tagged_message || comment.message || '',
                permissions: comment.permissions ?? {},
                resolvedAt: commentIsResolved ? toUnixMs(comment.resolution?.resolved_at) : undefined,
                resolvedBy: commentIsResolved ? comment.resolution?.resolved_by?.name : undefined,
                status: comment.status,
                type: 'comment',
            };
        }
        case FEED_ITEM_TYPE_ANNOTATION: {
            const annotation = item as unknown as Annotation;
            const annotationIsResolved = annotation.status === 'resolved';
            return {
                annotation,
                id: annotation.id,
                isResolved: annotationIsResolved,
                messages: transformAnnotationToMessages(annotation),
                permissions: annotation.permissions ?? {},
                resolvedAt: annotationIsResolved ? toUnixMs(annotation.resolution?.resolved_at) : undefined,
                resolvedBy: annotationIsResolved ? annotation.resolution?.resolved_by?.name : undefined,
                status: annotation.status,
                type: 'annotation',
            };
        }
        case FEED_ITEM_TYPE_TASK: {
            const task = item as unknown as TaskNew;
            return {
                id: item.id,
                originalTask: task,
                props: transformTaskToProps(task, currentUserId),
                type: 'task',
            };
        }
        case FEED_ITEM_TYPE_VERSION:
            return {
                id: item.id,
                props: transformVersionToProps(item as unknown as BoxItemVersion),
                type: 'version',
            };
        case FEED_ITEM_TYPE_APP_ACTIVITY:
            return {
                id: item.id,
                props: transformAppActivityToProps(item as unknown as BUIEAppActivityItem),
                type: 'app_activity',
            };
        default:
            return null;
    }
};
