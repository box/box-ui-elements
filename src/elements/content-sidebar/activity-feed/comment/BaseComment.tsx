import * as React from 'react';
import classNames from 'classnames';
import noop from 'lodash/noop';

import { BaseCommentMenuWrapper } from './components/BaseCommentMenuWrapper';
import { COMMENT_STATUS_RESOLVED, FEED_ITEM_TYPE_COMMENT } from '../../../../constants';
import Media from '../../../../components/media';
import Comment from './Comment';
import type {
    BoxCommentPermission,
    FeedItemStatus,
    Comment as CommentType,
    ActionItemError,
} from '../../../../common/types/feed';
import type { SelectorItems, User } from '../../../../common/types/core';
import type { Translations } from '../../flowTypes';
import type { GetAvatarUrlCallback, GetProfileUrlCallback } from '../../../common/flowTypes';
import type { OnCommentEdit, OnAnnotationStatusChange, OnCommentStatusChange } from './types';

import ActivityError from '../common/activity-error/ActivityError';
import Replies from './Replies';

import './BaseComment.scss';
import './Replies.scss';
import './Comment.scss';

export interface BaseCommentProps {
    currentUser?: User;
    error?: ActionItemError;
    getAvatarUrl: GetAvatarUrlCallback;
    getMentionWithQuery?: (searchStr: string) => void;
    getUserProfileUrl?: GetProfileUrlCallback;
    hasReplies?: boolean;
    id: string;
    isPending?: boolean;
    isRepliesLoading?: boolean;
    mentionSelectorContacts?: SelectorItems<User>;
    onCommentEdit: OnCommentEdit;
    onDelete: (args: { id: string; permissions?: BoxCommentPermission }) => void;
    onHideReplies?: (shownReplies: CommentType[]) => void;
    onReplyDelete?: (args: { id: string; permissions?: BoxCommentPermission }) => void;
    onSelect: (isSelected: boolean) => void;
    onShowReplies?: () => void;
    onStatusChange?: OnAnnotationStatusChange | OnCommentStatusChange;
    permissions: BoxCommentPermission;
    replies?: CommentType[];
    repliesTotalCount?: number;
    status?: FeedItemStatus;
    translations?: Translations;
    type?: typeof FEED_ITEM_TYPE_COMMENT;
}

const BaseComment = ({
    currentUser,
    error,
    getAvatarUrl,
    getMentionWithQuery,
    getUserProfileUrl,
    hasReplies = false,
    id,
    isPending = false,
    isRepliesLoading = false,
    mentionSelectorContacts,
    onCommentEdit,
    onDelete,
    onHideReplies,
    onReplyDelete,
    onSelect = noop,
    onShowReplies,
    onStatusChange,
    permissions = {},
    replies = [],
    repliesTotalCount = 0,
    status,
    translations,
}: BaseCommentProps): JSX.Element => {
    const [isEditing, setIsEditing] = React.useState<boolean>(false);
    const [isInputOpen, setIsInputOpen] = React.useState<boolean>(false);
    const { can_delete = false, can_edit = false, can_resolve = false } = permissions;
    const isResolved = status === COMMENT_STATUS_RESOLVED;

    const commentProps = {
        currentUser,
        getAvatarUrl,
        getMentionWithQuery,
        getUserProfileUrl,
        mentionSelectorContacts,
        translations,
    };

    const commentClasses = classNames('bcs-Comment', {
        'bcs-is-pending': isPending || error,
    });

    return (
        <div className={commentClasses}>
            <div className="bcs-Comment-content">
                <Comment {...commentProps} />
                <div className="bcs-Comment-actions">
                    <Media className="bcs-Comment-deleteConfirmation">
                        <Media.Figure>
                            <Media.Menu>
                                {permissions.can_delete || permissions.can_edit ? (
                                    <BaseCommentMenuWrapper
                                        canDelete={can_delete}
                                        canEdit={can_edit}
                                        canResolve={can_resolve}
                                        id={id}
                                        isEditing={isEditing}
                                        isInputOpen={isInputOpen}
                                        isResolved={isResolved}
                                        onDelete={onDelete}
                                        onSelect={onSelect}
                                        onStatusChange={onStatusChange}
                                        permissions={permissions}
                                        setIsEditing={setIsEditing}
                                        setIsInputOpen={setIsInputOpen}
                                    />
                                ) : null}
                            </Media.Menu>
                        </Media.Figure>
                        <Media.Body>
                            <div className="bcs-Comment-body" />
                        </Media.Body>
                    </Media>
                </div>
            </div>
            {error ? (
                <ActivityError
                    action={error.action}
                    message={error.message}
                    title={error.title}
                    className="bcs-Comment-error"
                />
            ) : null}
            {hasReplies && (
                <Replies
                    {...commentProps}
                    isParentPending={isPending}
                    isRepliesLoading={isRepliesLoading}
                    onCommentEdit={onCommentEdit}
                    onHideReplies={onHideReplies}
                    onReplyDelete={onReplyDelete}
                    onReplySelect={onSelect}
                    onShowReplies={onShowReplies}
                    replies={replies}
                    repliesTotalCount={repliesTotalCount}
                />
            )}
        </div>
    );
};

export default BaseComment;
