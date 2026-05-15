/**
 * @file Helpers that bridge vendor activity-feed callbacks back to BUIE
 * @author Box
 */

import { serializeMentionMarkup } from '@box/threaded-annotations';

import type { BoxCommentPermission } from '../../../common/types/feed';

import type { OnReplyUpdate, TransformedCommentItem } from './types';

type EditorContent = Parameters<typeof serializeMentionMarkup>[0];

export const serializeEditorContent = (content: unknown): ReturnType<typeof serializeMentionMarkup> | null => {
    try {
        return serializeMentionMarkup(content as EditorContent);
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
