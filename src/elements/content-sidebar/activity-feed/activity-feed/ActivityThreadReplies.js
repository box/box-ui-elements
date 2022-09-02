// @flow
import React from 'react';
import getProp from 'lodash/get';
import Comment from '../comment';

import type { GetAvatarUrlCallback, GetProfileUrlCallback } from '../../../common/flowTypes';
import type { Translations } from '../../flowTypes';
import type { SelectorItems, User } from '../../../../common/types/core';
import type { Comment as CommentType } from '../../../../common/types/feed';

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
    return (
        <div className="bcs-ActivityThread-replies">
            {!isExpanded ? (
                <Comment
                    key={lastReply.type + lastReply.id}
                    data-testid="reply"
                    {...lastReply}
                    currentUser={currentUser}
                    getAvatarUrl={getAvatarUrl}
                    getMentionWithQuery={getMentionWithQuery}
                    getUserProfileUrl={getUserProfileUrl}
                    mentionSelectorContacts={mentionSelectorContacts}
                    onDelete={onDelete}
                    onEdit={onEdit}
                    permissions={{
                        can_delete: getProp(lastReply.permissions, 'can_delete', false),
                        can_edit: getProp(lastReply.permissions, 'can_edit', false),
                        can_resolve: getProp(lastReply.permissions, 'can_resolve', false),
                    }}
                    translations={translations}
                />
            ) : (
                replies.map((reply: CommentType) => (
                    <Comment
                        data-testid="reply"
                        key={reply.type + reply.id}
                        {...reply}
                        currentUser={currentUser}
                        getAvatarUrl={getAvatarUrl}
                        getMentionWithQuery={getMentionWithQuery}
                        getUserProfileUrl={getUserProfileUrl}
                        mentionSelectorContacts={mentionSelectorContacts}
                        onDelete={onDelete}
                        onEdit={onEdit}
                        permissions={{
                            can_delete: getProp(reply.permissions, 'can_delete', false),
                            can_edit: getProp(reply.permissions, 'can_edit', false),
                            can_resolve: getProp(reply.permissions, 'can_resolve', false),
                        }}
                        translations={translations}
                    />
                ))
            )}
        </div>
    );
};

export default ActivityThreadReplies;
