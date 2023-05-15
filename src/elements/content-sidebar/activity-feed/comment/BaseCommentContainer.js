// @flow
import * as React from 'react';
import noop from 'lodash/noop';
import { COMMENT_STATUS_RESOLVED, PLACEHOLDER_USER } from '../../../../constants';
import type { FeedItemStatus } from '../../../../common/types/feed';

import './BaseComment.scss';
import './Replies.scss';
import './Comment.scss';

import type { BaseCommentContainerProps, HandleMessageUpdate, HandleStatusUpdate } from './types';

import BaseComment from './BaseComment';

// TODO: Replace and rename to Comment component once threaded replies refactor is fully implemented
const BaseCommentContainer = ({
    annotationActivityLink,
    children,
    created_at,
    created_by,
    currentUser,
    error,
    getAvatarUrl,
    getMentionWithQuery,
    getUserProfileUrl,
    id,
    isDisabled,
    isPending = false,
    modified_at,
    onAnnotationEdit,
    onCommentEdit,
    onDelete,
    onSelect,
    permissions = {},
    tagged_message = '',
    translatedTaggedMessage,
    status,
}: BaseCommentContainerProps) => {
    const [isConfirmingDelete, setIsConfirmingDelete] = React.useState<boolean>(false);
    const [isEditing, setIsEditing] = React.useState<boolean>(false);
    const [isInputOpen, setIsInputOpen] = React.useState<boolean>(false);

    const handleDeleteConfirm = (): void => {
        onDelete({ id, permissions });
        onSelect(false);
    };

    const handleDeleteCancel = (): void => {
        setIsConfirmingDelete(false);
        onSelect(false);
    };

    const handleDeleteClick = (): void => {
        setIsConfirmingDelete(true);
        onSelect(true);
    };

    const handleEditClick = (): void => {
        setIsEditing(true);
        setIsInputOpen(true);
        onSelect(true);
    };

    const handleMenuClose = (): void => {
        if (isConfirmingDelete || isEditing || isInputOpen) {
            return;
        }
        onSelect(false);
    };

    const commentFormFocusHandler = (): void => {
        setIsInputOpen(true);
        onSelect(true);
    };

    const commentFormCancelHandler = (): void => {
        setIsInputOpen(false);
        setIsEditing(false);
        onSelect(false);
    };

    const commentFormSubmitHandler = (): void => {
        setIsInputOpen(false);
        setIsEditing(false);
        onSelect(false);
    };

    const handleMessageUpdate: HandleMessageUpdate = ({ id: messageID, text, hasMention }) => {
        if (onAnnotationEdit) {
            onAnnotationEdit({ id: messageID, text, permissions });
        } else if (onCommentEdit) {
            onCommentEdit({
                id: messageID,
                text,
                hasMention,
                permissions,
            });
        }
        commentFormSubmitHandler();
    };

    const handleStatusUpdate: HandleStatusUpdate = (selectedStatus: FeedItemStatus): void => {
        if (onAnnotationEdit) {
            onAnnotationEdit({ id, permissions });
        } else if (onCommentEdit) {
            onCommentEdit({ id, status: selectedStatus, hasMention: false, permissions });
        }
    };

    const onEdit = onCommentEdit ?? onAnnotationEdit;

    const canDelete = permissions.can_delete;
    const canEdit = onEdit !== noop && permissions.can_edit;
    const canResolve = onEdit !== noop && permissions.can_resolve;
    const createdAtTimestamp = new Date(created_at).getTime();
    const createdByUser = created_by || PLACEHOLDER_USER;
    const isEdited = modified_at !== undefined && modified_at !== created_at;
    const isMenuVisible = (canDelete || canEdit || canResolve) && !isPending;
    const isResolved = status === COMMENT_STATUS_RESOLVED;

    return (
        <BaseComment
            annotationActivityLink={annotationActivityLink}
            canDelete={canDelete}
            canEdit={canEdit}
            canResolve={canResolve}
            commentFormCancelHandler={commentFormCancelHandler}
            commentFormFocusHandler={commentFormFocusHandler}
            // This doesn't seem to be getting used.
            commentFormSubmitHandler={commentFormSubmitHandler}
            createdAtTimestamp={createdAtTimestamp}
            createdByUser={createdByUser}
            currentUser={currentUser}
            error={error}
            getAvatarUrl={getAvatarUrl}
            getMentionWithQuery={getMentionWithQuery}
            getUserProfileUrl={getUserProfileUrl}
            handleDeleteCancel={handleDeleteCancel}
            handleDeleteClick={handleDeleteClick}
            handleDeleteConfirm={handleDeleteConfirm}
            handleEditClick={handleEditClick}
            handleMenuClose={handleMenuClose}
            handleMessageUpdate={handleMessageUpdate}
            handleStatusUpdate={handleStatusUpdate}
            id={id}
            isConfirmingDelete={isConfirmingDelete}
            isDisabled={isDisabled}
            isEdited={isEdited}
            isEditing={isEditing}
            isInputOpen={isInputOpen}
            isMenuVisible={isMenuVisible}
            // isPending
            isResolved={isResolved}
            // mentionSelectorContacts
            onSelect={onSelect}
            // status
            tagged_message={tagged_message}
            translatedTaggedMessage={translatedTaggedMessage}
            // translations
        >
            {children}
        </BaseComment>
    );
};

export default BaseCommentContainer;
