import * as React from 'react';
import Comment from '../comment';
import LoadingIndicator from '../../../../components/loading-indicator';
import { BaseComment } from '../comment/BaseComment';

import { GetAvatarUrlCallback, GetProfileUrlCallback } from '../../../common/flowTypes';
import { Translations } from '../../flowTypes';
import { SelectorItems, User } from '../../../../common/types/core';
import { BoxCommentPermission, Comment as CommentType } from '../../../../common/types/feed';

import './ActivityThreadReplies.scss';

interface ActivityThreadRepliesProps {
    currentUser?: User;
    getAvatarUrl: GetAvatarUrlCallback;
    getMentionWithQuery?: (searchStr: string) => void;
    getUserProfileUrl?: GetProfileUrlCallback;
    hasNewThreadedReplies?: boolean;
    isRepliesLoading?: boolean;
    mentionSelectorContacts?: SelectorItems<User>;
    onDelete?: (params: { id: string; permissions: BoxCommentPermission }) => void;
    onEdit?: (
        id: string,
        text: string,
        status: string,
        hasMention: boolean,
        permissions: BoxCommentPermission,
        onSuccess?: () => void,
        onError?: (error: Error) => void,
    ) => void;
    onSelect?: (isSelected: boolean) => void;
    replies: Array<CommentType>;
    translations?: Translations;
}

const ActivityThreadReplies: React.FC<ActivityThreadRepliesProps> = ({
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
}: ActivityThreadRepliesProps) => {
    const getReplyPermissions = (reply: CommentType): BoxCommentPermission => {
        const { permissions: { can_delete = false, can_edit = false, can_resolve = false } = {} } = reply;
        return {
            can_delete,
            can_edit,
            can_resolve,
        };
    };

    const handleOnEdit = ({
        hasMention,
        id,
        onError,
        onSuccess,
        permissions,
        status,
        text,
    }: {
        hasMention: boolean;
        id: string;
        onError?: (error: Error) => void;
        onSuccess?: () => void;
        permissions: BoxCommentPermission;
        status: string;
        text: string;
    }): void => {
        if (onEdit) {
            onEdit(id, text, status, hasMention, permissions, onSuccess, onError);
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
