/**
 * @file Transforms BUIE FeedItems into @box/activity-feed component props.
 *
 * Read data comes from UAA (already parsed into BUIE FeedItem types).
 * Write/mutate operations still use the traditional v2 API via ActivitySidebar callbacks.
 * @author Box
 */

import { TaskCompletionRule, TaskType } from '@box/activity-feed';
import type {
    DocumentNodeV2 as DocumentNode,
    MentionNodeV2 as MentionNode,
    ParagraphNodeV2 as ParagraphNode,
    Permissions,
    TextMessageAuthorTypeV2 as TextMessageAuthorType,
    TextMessageTypeV2 as TextMessageType,
    TextNodeV2 as TextNode,
} from '@box/threaded-annotations';

import type { Annotation } from '../../../common/types/annotations';
import type { AppActivityItem as BUIEAppActivityItem, Comment, FeedItem } from '../../../common/types/feed';
import type { BoxItemVersion, User } from '../../../common/types/core';
import type { TaskNew } from '../../../common/types/tasks';

import type { AppActivityItemProps, TaskItemProps, TransformedFeedItem, VersionItemProps } from './types';

import {
    FEED_ITEM_TYPE_ANNOTATION,
    FEED_ITEM_TYPE_APP_ACTIVITY,
    FEED_ITEM_TYPE_COMMENT,
    FEED_ITEM_TYPE_TASK,
    FEED_ITEM_TYPE_VERSION,
} from '../../../constants';

const MENTION_REGEX = /@\[(\d+):([^\]]+)\]/g;

/**
 * Parses a line of text into TipTap content nodes, converting @[id:name]
 * mention markup into MentionNode elements and plain text into TextNode elements.
 */
const parseLine = (line: string): (MentionNode | TextNode)[] => {
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
                authorId: '',
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

/**
 * Converts a tagged_message string to a TipTap DocumentNode.
 * Parses @[userId:userName] mention markup into MentionNode elements.
 */
export const textToDocumentNode = (text: string): DocumentNode => {
    if (!text) {
        return { type: 'doc', content: [] };
    }

    const lines = text.split('\n');
    const content: ParagraphNode[] = lines.map(line => {
        const nodes = parseLine(line);
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

const toUserAuthor = (user?: User | null): TextMessageAuthorType => ({
    avatarUrl: user?.avatar_url,
    email: user?.email ?? user?.login ?? '',
    id: Number(user?.id) || 0,
    name: user?.name ?? '',
});

const toPermissions = (
    perms?: { can_delete?: boolean; can_edit?: boolean; can_reply?: boolean; can_resolve?: boolean } | null,
): Permissions => ({
    canDelete: perms?.can_delete ?? false,
    canEdit: perms?.can_edit ?? false,
    canReply: perms?.can_reply ?? false,
    canResolve: perms?.can_resolve ?? false,
});

const commentToTextMessage = (comment: Comment): TextMessageType => ({
    author: toUserAuthor(comment.created_by),
    createdAt: toUnixMs(comment.created_at) ?? 0,
    id: comment.id,
    message: textToDocumentNode(comment.tagged_message || comment.message || ''),
    permissions: toPermissions(comment.permissions),
});

export const transformCommentToMessages = (comment: Comment): TextMessageType[] => {
    const root = commentToTextMessage(comment);
    const replies = (comment.replies ?? []).map(reply => commentToTextMessage(reply));
    return [root, ...replies];
};

export const transformAnnotationToMessages = (annotation: Annotation): TextMessageType[] => {
    const messageText = annotation.description?.message ?? '';
    const root: TextMessageType = {
        author: toUserAuthor(annotation.created_by),
        createdAt: toUnixMs(annotation.created_at) ?? 0,
        id: annotation.id,
        message: textToDocumentNode(messageText),
        permissions: toPermissions(annotation.permissions),
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

const mapVersionActionType = (actionType?: string): VersionItemProps['actionType'] => {
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
        default:
            return 'upload';
    }
};

export const transformVersionToProps = (version: BoxItemVersion): VersionItemProps => {
    const user = version.modified_by ?? version.trashed_by ?? version.restored_by ?? version.promoted_by;
    return {
        actionType: mapVersionActionType(version.action_type),
        authorName: user?.name ?? version.uploader_display_name,
        avatarUrl: user?.avatar_url,
        createdAt: toUnixMs(version.created_at),
        id: version.id,
        versionNumber: parseInt(version.version_number, 10) || 0,
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
                permissions: comment.permissions,
                resolvedAt: commentIsResolved ? toUnixMs(comment.modified_at) : undefined,
                resolvedBy: commentIsResolved
                    ? (comment as unknown as { modified_by?: { name?: string } }).modified_by?.name
                    : undefined,
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
                permissions: annotation.permissions,
                resolvedAt: annotationIsResolved ? toUnixMs(annotation.modified_at) : undefined,
                resolvedBy: annotationIsResolved ? annotation.modified_by?.name : undefined,
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
