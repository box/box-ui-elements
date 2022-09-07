// @flow
import React from 'react';
import getProp from 'lodash/get';
import Comment from '../comment';

import type { GetAvatarUrlCallback, GetProfileUrlCallback } from '../../../common/flowTypes';
import type { Translations } from '../../flowTypes';
import type { SelectorItems, User } from '../../../../common/types/core';
import type { BoxCommentPermission, Comment as CommentType } from '../../../../common/types/feed';

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

    const getReplyPermissions = (reply: CommentType): BoxCommentPermission => ({
        can_delete: getProp(reply.permissions, 'can_delete', false),
        can_edit: getProp(reply.permissions, 'can_edit', false),
        can_resolve: getProp(reply.permissions, 'can_resolve', false),
    });

    return (
        <div className="bcs-ActivityThreadReplies">
            {!isExpanded ? (
                <Comment
                    key={lastReply.type + lastReply.id}
                    data-testid="activity-thread-latest-reply"
                    {...lastReply}
                    currentUser={currentUser}
                    getAvatarUrl={getAvatarUrl}
                    getMentionWithQuery={getMentionWithQuery}
                    getUserProfileUrl={getUserProfileUrl}
                    mentionSelectorContacts={mentionSelectorContacts}
                    onDelete={onDelete}
                    onEdit={onEdit}
                    permissions={getReplyPermissions(lastReply)}
                    translations={translations}
                />
            ) : (
                replies.map((reply: CommentType) => (
                    <Comment
                        data-testid="activity-thread-reply"
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
                        translations={translations}
                    />
                ))
            )}
        </div>
    );
};

export default ActivityThreadReplies;
