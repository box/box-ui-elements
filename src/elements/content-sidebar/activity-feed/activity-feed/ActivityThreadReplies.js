// @flow
import * as React from 'react';
import Comment from '../comment';
import LoadingIndicator from '../../../../components/loading-indicator';
import { BaseComment } from '../comment/BaseComment';

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
    hasNewThreadedReplies?: boolean,
    isRepliesLoading?: boolean,
    mentionSelectorContacts?: SelectorItems<>,
    onDelete?: Function,
    onEdit?: ({
        id: string,
        text: string,
        permissions: BoxCommentPermission,
        status?: FeedItemStatus,
        hasMention?: boolean,
        onSuccess?: Function,
        onError?: Function,
    }) => void,
    onSelect?: (isSelected: boolean) => void,
    replies: Array<CommentType>,
    translations?: Translations,
};

const ActivityThreadReplies = ({
    currentUser,
    getAvatarUrl,
    getMentionWithQuery,
    getUserProfileUrl,
    hasNewThreadedReplies = false,
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

    const handleOnEdit = (params: {
        hasMention?: boolean,
        id: string,
        onError?: Function,
        onSuccess?: Function,
        permissions: BoxCommentPermission,
        status?: FeedItemStatus,
        text: string,
    }): void => {
        if (onEdit) {
            onEdit(params);
        }
    };

    const renderComment = (reply: CommentType) => {
        if (hasNewThreadedReplies) {
            return (
                <BaseComment
                    key={`${reply.type}${reply.id}`}
                    {...reply}
                    currentUser={currentUser}
                    getAvatarUrl={getAvatarUrl}
                    getMentionWithQuery={getMentionWithQuery}
                    getUserProfileUrl={getUserProfileUrl}
                    mentionSelectorContacts={mentionSelectorContacts}
                    onDelete={onDelete}
                    onCommentEdit={handleOnEdit}
                    onSelect={onSelect}
                    permissions={getReplyPermissions(reply)}
                    translations={translations}
                />
            );
        }

        return (
            <Comment
                key={`${reply.type}${reply.id}`}
                {...reply}
                currentUser={currentUser}
                getAvatarUrl={getAvatarUrl}
                getMentionWithQuery={getMentionWithQuery}
                getUserProfileUrl={getUserProfileUrl}
                mentionSelectorContacts={mentionSelectorContacts}
                onDelete={onDelete}
                onEdit={handleOnEdit}
                onSelect={onSelect}
                permissions={getReplyPermissions(reply)}
                translations={translations}
            />
        );
    };

    return (
        <div className="bcs-ActivityThreadReplies" data-testid="activity-thread-replies">
            {isRepliesLoading && (
                <div className="bcs-ActivityThreadReplies-loading" data-testid="activity-thread-replies-loading">
                    <LoadingIndicator />
                </div>
            )}
            {replies.map((reply: CommentType) => renderComment(reply))}
        </div>
    );
};

export default ActivityThreadReplies;
