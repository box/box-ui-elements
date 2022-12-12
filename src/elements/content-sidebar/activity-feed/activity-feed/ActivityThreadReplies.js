// @flow
import React from 'react';
import Comment from '../comment';
import LoadingIndicator from '../../../../components/loading-indicator';

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
    isRepliesLoading?: boolean,
    mentionSelectorContacts?: SelectorItems<>,
    onDelete?: Function,
    onEdit?: Function,
    onSelect?: (isSelected: boolean) => void,
    replies: Array<CommentType>,
    translations?: Translations,
};

const ActivityThreadReplies = ({
    currentUser,
    getAvatarUrl,
    getMentionWithQuery,
    getUserProfileUrl,
    isRepliesLoading,
    mentionSelectorContacts,
    onDelete,
    onEdit,
    onSelect,
    replies,
    translations,
}: Props) => {
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
            {isRepliesLoading && (
                <div className="bcs-ActivityThreadReplies-loading" data-testid="activity-thread-replies-loading">
                    <LoadingIndicator />
                </div>
            )}
            {replies.map((reply: CommentType) => (
                <Comment
                    key={`${reply.type}${reply.id}`}
                    {...reply}
                    currentUser={currentUser}
                    getAvatarUrl={getAvatarUrl}
                    getMentionWithQuery={getMentionWithQuery}
                    getUserProfileUrl={getUserProfileUrl}
                    mentionSelectorContacts={mentionSelectorContacts}
                    onDelete={onDelete}
                    onEdit={onEdit}
                    onSelect={onSelect}
                    permissions={getReplyPermissions(reply)}
                    translations={translations}
                />
            ))}
        </div>
    );
};

export default ActivityThreadReplies;
