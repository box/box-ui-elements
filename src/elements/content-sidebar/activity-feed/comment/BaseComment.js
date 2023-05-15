// @flow
import * as React from 'react';
import classNames from 'classnames';
import TetherComponent from 'react-tether';
import { FormattedMessage } from 'react-intl';
import ActivityError from '../common/activity-error';
import ActivityMessage from '../common/activity-message';
import ActivityStatus from '../common/activity-status';
import ActivityTimestamp from '../common/activity-timestamp';
import Avatar from '../Avatar';
import Checkmark16 from '../../../../icon/line/Checkmark16';
import CommentForm from '../comment-form';
import DeleteConfirmation from '../common/delete-confirmation';
import Media from '../../../../components/media';
import messages from './messages';
import Pencil16 from '../../../../icon/line/Pencil16';
import Trash16 from '../../../../icon/line/Trash16';
import UserLink from '../common/user-link';
import X16 from '../../../../icon/fill/X16';
import { ACTIVITY_TARGETS } from '../../../common/interactionTargets';
import { COMMENT_STATUS_OPEN, COMMENT_STATUS_RESOLVED } from '../../../../constants';
import { MenuItem } from '../../../../components/menu';

import type { UserMini } from '../../../../common/types/core';
import './BaseComment.scss';
import './Replies.scss';
import './Comment.scss';
import IconAnnotation from '../../../../icons/two-toned/IconAnnotation';

import type { BaseCommentSharedProps, HandleMessageUpdate, HandleStatusUpdate } from './types';

type BaseCommentProps = BaseCommentSharedProps & {
    // TODO: strongly type, if possible
    canDelete?: boolean,
    canEdit?: boolean,
    canResolve?: boolean,
    commentFormCancelHandler: () => void,
    commentFormFocusHandler: () => void,
    commentFormSubmitHandler: () => void,
    createdAtTimestamp: number,
    createdByUser: UserMini,
    handleDeleteCancel: () => void,
    handleDeleteClick: () => void,
    handleDeleteConfirm: () => void,
    handleEditClick: () => void,
    handleMenuClose: () => void,
    handleMessageUpdate: HandleMessageUpdate,
    handleStatusUpdate: HandleStatusUpdate,
    isConfirmingDelete: boolean,
    isEdited: boolean,
    isEditing: boolean,
    isInputOpen: boolean,
    isMenuVisible?: boolean,
    isResolved: boolean,
};

// TODO: Replace and rename to Comment component once threaded replies refactor is fully implemented
const BaseComment = ({
    annotationActivityLink,
    canDelete,
    canEdit,
    canResolve,
    children,
    commentFormCancelHandler,
    commentFormFocusHandler,
    createdByUser,
    createdAtTimestamp,
    id,
    handleDeleteCancel,
    handleDeleteConfirm,
    handleDeleteClick,
    handleEditClick,
    handleMessageUpdate,
    handleStatusUpdate,
    isEdited,
    isEditing,
    isMenuVisible,
    isConfirmingDelete,
    isInputOpen,
    isPending = false,
    error,
    tagged_message = '',
    translatedTaggedMessage,
    translations,
    currentUser,
    isDisabled,
    getAvatarUrl,
    handleMenuClose,
    isResolved,
    getUserProfileUrl,
    getMentionWithQuery,
    mentionSelectorContacts,
    onSelect,
    status,
}: BaseCommentProps) => {
    return (
        // TODO: Change className to bcs-Comment once FF is removed
        <div className="bcs-BaseComment">
            <Media
                className={classNames('bcs-Comment-media', {
                    'bcs-is-pending': isPending || error,
                })}
            >
                <Media.Figure>
                    <Avatar
                        getAvatarUrl={getAvatarUrl}
                        user={createdByUser}
                        badgeIcon={annotationActivityLink ? <IconAnnotation /> : undefined}
                    />
                </Media.Figure>
                <Media.Body>
                    {isMenuVisible && (
                        <TetherComponent
                            attachment="top right"
                            className="bcs-Comment-deleteConfirmationModal"
                            constraints={[{ to: 'scrollParent', attachment: 'together' }]}
                            targetAttachment="bottom right"
                        >
                            <Media.Menu
                                isDisabled={isConfirmingDelete}
                                data-testid="comment-actions-menu"
                                dropdownProps={{
                                    onMenuOpen: () => onSelect(true),
                                    onMenuClose: handleMenuClose,
                                }}
                                menuProps={{
                                    'data-resin-component': ACTIVITY_TARGETS.COMMENT_OPTIONS,
                                }}
                            >
                                {canResolve && isResolved && (
                                    <MenuItem
                                        className="bcs-Comment-unresolveComment"
                                        data-resin-target={ACTIVITY_TARGETS.COMMENT_OPTIONS_EDIT}
                                        data-testid="unresolve-comment"
                                        onClick={() => handleStatusUpdate(COMMENT_STATUS_OPEN)}
                                    >
                                        <X16 />
                                        <FormattedMessage {...messages.commentUnresolveMenuItem} />
                                    </MenuItem>
                                )}
                                {canResolve && !isResolved && (
                                    <MenuItem
                                        data-resin-target={ACTIVITY_TARGETS.COMMENT_OPTIONS_EDIT}
                                        data-testid="resolve-comment"
                                        onClick={() => handleStatusUpdate(COMMENT_STATUS_RESOLVED)}
                                    >
                                        <Checkmark16 />
                                        <FormattedMessage {...messages.commentResolveMenuItem} />
                                    </MenuItem>
                                )}
                                {canEdit && (
                                    <MenuItem
                                        data-resin-target={ACTIVITY_TARGETS.COMMENT_OPTIONS_EDIT}
                                        data-testid="edit-comment"
                                        onClick={handleEditClick}
                                    >
                                        <Pencil16 />
                                        <FormattedMessage {...messages.commentEditMenuItem} />
                                    </MenuItem>
                                )}
                                {canDelete && (
                                    <MenuItem
                                        data-resin-target={ACTIVITY_TARGETS.COMMENT_OPTIONS_DELETE}
                                        data-testid="delete-comment"
                                        onClick={handleDeleteClick}
                                    >
                                        <Trash16 />
                                        <FormattedMessage {...messages.commentDeleteMenuItem} />
                                    </MenuItem>
                                )}
                            </Media.Menu>
                            {isConfirmingDelete && (
                                <DeleteConfirmation
                                    data-resin-component={ACTIVITY_TARGETS.COMMENT_OPTIONS}
                                    isOpen={isConfirmingDelete}
                                    message={messages.commentDeletePrompt}
                                    onDeleteCancel={handleDeleteCancel}
                                    onDeleteConfirm={handleDeleteConfirm}
                                />
                            )}
                        </TetherComponent>
                    )}
                    <div className="bcs-Comment-headline">
                        <UserLink
                            data-resin-target={ACTIVITY_TARGETS.PROFILE}
                            id={createdByUser.id}
                            name={createdByUser.name}
                            getUserProfileUrl={getUserProfileUrl}
                        />
                    </div>
                    <div className="bcs-Comment-timestamp">
                        <ActivityTimestamp date={createdAtTimestamp} />
                        {annotationActivityLink && annotationActivityLink}
                    </div>

                    <ActivityStatus status={status} />
                    {isEditing ? (
                        <CommentForm
                            isDisabled={isDisabled}
                            className={classNames('bcs-Comment-editor', {
                                'bcs-is-disabled': isDisabled,
                            })}
                            updateComment={handleMessageUpdate}
                            isOpen={isInputOpen}
                            user={currentUser}
                            onCancel={commentFormCancelHandler}
                            onFocus={commentFormFocusHandler}
                            isEditing={isEditing}
                            entityId={id}
                            tagged_message={tagged_message}
                            getAvatarUrl={getAvatarUrl}
                            mentionSelectorContacts={mentionSelectorContacts}
                            getMentionWithQuery={getMentionWithQuery}
                        />
                    ) : (
                        <ActivityMessage
                            id={id}
                            isEdited={isEdited && !isResolved}
                            tagged_message={tagged_message}
                            translatedTaggedMessage={translatedTaggedMessage}
                            {...translations}
                            translationFailed={error ? true : null}
                            getUserProfileUrl={getUserProfileUrl}
                        />
                    )}
                </Media.Body>
            </Media>
            {/* $FlowFixMe */}
            {error ? <ActivityError {...error} /> : null}
            {children}
        </div>
    );
};

export default BaseComment;
