/**
 * @file Helpers that bridge vendor activity-feed callbacks back to BUIE
 * @author Box
 */

import { serializeMentionMarkup, serializeMessageToMarkdown } from '@box/threaded-annotations';

import type { BoxCommentPermission } from '../../../common/types/feed';

import type { OnReplyDelete, OnReplyUpdate, TransformedCommentItem, TransformedFeedItem } from './types';

type EditorContent = Parameters<typeof serializeMentionMarkup>[0];

export const serializeEditorContent = (
    content: unknown,
    isRichTextEnabled = false,
): ReturnType<typeof serializeMentionMarkup> | null => {
    try {
        const serialized = serializeMentionMarkup(content as EditorContent);
        const text = isRichTextEnabled ? serializeMessageToMarkdown(content as EditorContent) : serialized.text;
        return { ...serialized, text: text.trim() };
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error('ActivityFeedV2: failed to serialize editor content', error);
        return null;
    }
};

export const findMessagePermissions = (
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

export const logEditError = (error: unknown): undefined => {
    // eslint-disable-next-line no-console
    console.error('ActivityFeedV2: failed to save edit', error);
    return undefined;
};

export const dispatchReplyEdit = ({
    id,
    messages,
    onReplyUpdate,
    parentId,
    text,
}: {
    id: string;
    messages: TransformedCommentItem['messages'];
    onReplyUpdate?: OnReplyUpdate;
    parentId: string;
    text: string;
}) => {
    const permissions = findMessagePermissions(messages, id);
    if (!permissions) {
        // eslint-disable-next-line no-console
        console.error(`ActivityFeedV2: no permissions found for reply "${id}" in thread "${parentId}"`);
        return;
    }
    onReplyUpdate?.({ id, parentId, permissions, text });
};

export const dispatchReplyDelete = ({
    id,
    messages,
    onReplyDelete,
    parentId,
}: {
    id: string;
    messages: TransformedCommentItem['messages'];
    onReplyDelete?: OnReplyDelete;
    parentId: string;
}) => {
    const permissions = findMessagePermissions(messages, id);
    if (!permissions) {
        // eslint-disable-next-line no-console
        console.error(`ActivityFeedV2: no permissions found for reply "${id}" in thread "${parentId}"`);
        return;
    }
    onReplyDelete?.({ id, parentId, permissions });
};

/** True when the deep-link id is the thread root or any message (parent/reply) in a comment/annotation thread. */
export const feedItemMatchesEntryId = (item: TransformedFeedItem, feedEntryId: string): boolean => {
    if (item.id === feedEntryId) {
        return true;
    }
    if (item.type === 'comment' || item.type === 'annotation') {
        return item.messages.some(message => message.id === feedEntryId);
    }
    return false;
};

/** Resolve a deep-link id (root or reply) to the feed row id used for list scroll (`data-activity-id`). */
export const resolveFeedItemIdForEntry = (
    items: readonly TransformedFeedItem[],
    feedEntryId: string,
): string | undefined => items.find(item => feedItemMatchesEntryId(item, feedEntryId))?.id;
