// @flow
import React from 'react';
import Comment from '../comment';

import type { GetAvatarUrlCallback, GetProfileUrlCallback } from '../../../common/flowTypes';
import type { Translations } from '../../flowTypes';
import type { SelectorItems, User } from '../../../../common/types/core';
import type { BoxCommentPermission, Comment as CommentType } from '../../../../common/types/feed';

import './ActivityThreadReplies.scss';

type Props = {
    currentUser?: User,
    getAvatarUrl: GetAvatarUrlCallback,
    getMentionWithQuery?: Function,
    getUserProfileUrl?: GetProfileUrlCallback,
    isExpanded: boolean,
    mentionSelectorContacts?: SelectorItems<>,
    onDelete?: Function,
    onEdit?: Function,
    replies: Array<CommentType>,
    translations?: Translations,
};

const ActivityThreadReplies = ({
    currentUser,
    getAvatarUrl,
    getMentionWithQuery,
    getUserProfileUrl,
    isExpanded,
    mentionSelectorContacts,
    onDelete,
    onEdit,
    replies,
    translations,
}: Props) => {
    const lastReply = replies[replies.length - 1];

    const getReplyPermissions = (reply: CommentType): BoxCommentPermission => {
        const { permissions: { can_delete = false, can_edit = false, can_resolve = false } = {} } = reply;
        return {
            can_delete,
            can_edit,
            can_resolve,
        };
    };

    return (
        <div className="bcs-ActivityThreadReplies" data-testid="activity-thread-replies">
            {!isExpanded ? (
                <Comment
                    key={lastReply.type + lastReply.id}
                    {...lastReply}
                    currentUser={currentUser}
                    getAvatarUrl={getAvatarUrl}
                    getMentionWithQuery={getMentionWithQuery}
                    getUserProfileUrl={getUserProfileUrl}
                    mentionSelectorContacts={mentionSelectorContacts}
                    onDelete={onDelete}
                    onEdit={onEdit}
                    permissions={getReplyPermissions(lastReply)}
                    shouldTruncate
                    translations={translations}
                />
            ) : (
                replies.map((reply: CommentType) => (
                    <Comment
                        key={reply.type + reply.id}
                        {...reply}
                        currentUser={currentUser}
                        getAvatarUrl={getAvatarUrl}
                        getMentionWithQuery={getMentionWithQuery}
                        getUserProfileUrl={getUserProfileUrl}
                        mentionSelectorContacts={mentionSelectorContacts}
                        onDelete={onDelete}
                        onEdit={onEdit}
                        permissions={getReplyPermissions(reply)}
                        shouldTruncate
                        translations={translations}
                    />
                ))
            )}
        </div>
    );
};

export default ActivityThreadReplies;
