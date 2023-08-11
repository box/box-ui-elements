// @flow
import * as React from 'react';
import classNames from 'classnames';
import noop from 'lodash/noop';
import TetherComponent from 'react-tether';
import { FormattedMessage } from 'react-intl';
import ActivityError from '../common/activity-error';
import ActivityMessage from '../common/activity-message';
import ActivityStatus from '../common/activity-status';
import ActivityTimestamp from '../common/activity-timestamp';
import Avatar from '../Avatar';
import Checkmark16 from '../../../../icon/line/Checkmark16';
import CommentForm from '../comment-form';
import CreateReply from './CreateReply';
import DeleteConfirmation from '../common/delete-confirmation';
import IconAnnotation from '../../../../icons/two-toned/IconAnnotation';
import LoadingIndicator from '../../../../components/loading-indicator';
import Media from '../../../../components/media';
import messages from './messages';
import Pencil16 from '../../../../icon/line/Pencil16';
import RepliesToggle from './RepliesToggle';
import Trash16 from '../../../../icon/line/Trash16';
import UserLink from '../common/user-link';
import X16 from '../../../../icon/fill/X16';
import { ACTIVITY_TARGETS } from '../../../common/interactionTargets';
import { COMMENT_STATUS_OPEN, COMMENT_STATUS_RESOLVED, PLACEHOLDER_USER } from '../../../../constants';
import { MenuItem } from '../../../../components/menu';
import { type OnAnnotationEdit, type OnCommentEdit } from './types';
import type {
    ActionItemError,
    BoxCommentPermission,
    FeedItemStatus,
    Comment as CommentType,
} from '../../../../common/types/feed';

import type { GetAvatarUrlCallback, GetProfileUrlCallback } from '../../../common/flowTypes';
import type { SelectorItems, User } from '../../../../common/types/core';
import type { Translations } from '../../flowTypes';

import './BaseComment.scss';
import './Replies.scss';
import './Comment.scss';

export type BaseCommentProps = {
    annotationActivityLink?: React.Element<any>,
    created_at: string | number,
    created_by: User,
    currentUser?: User,
    error?: ActionItemError,
    getAvatarUrl: GetAvatarUrlCallback,
    getMentionWithQuery?: Function,
    getUserProfileUrl?: GetProfileUrlCallback,
    hasReplies?: boolean,
    id: string,
    isDisabled?: boolean,
    isPending?: boolean,
    isRepliesLoading?: boolean,
    mentionSelectorContacts?: SelectorItems<>,
    modified_at?: string | number,
    onAnnotationEdit?: OnAnnotationEdit,
    onCommentEdit: OnCommentEdit,
    onDelete: ({ id: string, permissions?: BoxCommentPermission }) => any,
    onHideReplies?: (shownReplies: CommentType[]) => void,
    onReplyCreate?: (reply: string) => void,
    onSelect: (isSelected: boolean) => void,
    onShowReplies?: () => void,
    permissions: BoxCommentPermission,
    replies?: CommentType[],
    repliesTotalCount?: number,
    status?: FeedItemStatus,
    tagged_message: string,
    translatedTaggedMessage?: string,
    translations?: Translations,
};

export const BaseComment = ({
    annotationActivityLink,
    created_at,
    created_by,
    currentUser,
    error,
    getAvatarUrl,
    getMentionWithQuery,
    getUserProfileUrl,
    hasReplies = false,
    id,
    isDisabled,
    isPending = false,
    isRepliesLoading = false,
    mentionSelectorContacts,
    modified_at,
    onAnnotationEdit,
    onCommentEdit,
    onDelete,
    onHideReplies,
    onReplyCreate,
    onSelect,
    onShowReplies,
    permissions = {},
    replies = [],
    repliesTotalCount = 0,
    status,
    tagged_message = '',
    translatedTaggedMessage,
    translations,
}: BaseCommentProps) => {
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

    const handleMessageUpdate = ({ id: messageID, text, hasMention }) => {
        // Since we have to pass onCommentEdit through annotations (to Replies), onAnnotationEdit essentially overrides onCommentEdit
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

    const handleStatusUpdate = (selectedStatus: FeedItemStatus): void => {
        if (onAnnotationEdit) {
            onAnnotationEdit({ id, permissions });
        } else if (onCommentEdit) {
            onCommentEdit({ id, status: selectedStatus, hasMention: false, permissions });
        }
    };

    // Since we have to pass onCommentEdit through annotations (to Replies), onAnnotationEdit essentially overrides onCommentEdit
    const onEdit = onAnnotationEdit ?? onCommentEdit;

    const canDelete = permissions.can_delete;
    const canEdit = onEdit !== noop && permissions.can_edit;
    const canResolve = onEdit !== noop && permissions.can_resolve;
    const createdAtTimestamp = new Date(created_at).getTime();
    const createdByUser = created_by || PLACEHOLDER_USER;
    const isEdited = modified_at !== undefined && modified_at !== created_at;
    const isMenuVisible = (canDelete || canEdit || canResolve) && !isPending;
    const isResolved = status === COMMENT_STATUS_RESOLVED;
    const commentProps = {
        currentUser,
        getUserProfileUrl,
        getAvatarUrl,
        getMentionWithQuery,
        mentionSelectorContacts,
        translations,
    };

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
                        badgeIcon={
                            annotationActivityLink && (
                                <IconAnnotation title={<FormattedMessage {...messages.annotationBadge} />} />
                            )
                        }
                        getAvatarUrl={getAvatarUrl}
                        user={createdByUser}
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
                                data-testid="comment-actions-menu"
                                dropdownProps={{
                                    onMenuOpen: () => onSelect(true),
                                    onMenuClose: handleMenuClose,
                                }}
                                isDisabled={isConfirmingDelete}
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
                            getUserProfileUrl={getUserProfileUrl}
                            id={createdByUser.id}
                            name={createdByUser.name}
                        />
                    </div>
                    <div className="bcs-Comment-timestamp">
                        <ActivityTimestamp date={createdAtTimestamp} />
                        {annotationActivityLink}
                    </div>
                    <ActivityStatus status={status} />
                    {isEditing ? (
                        <CommentForm
                            className={classNames('bcs-Comment-editor', {
                                'bcs-is-disabled': isDisabled,
                            })}
                            entityId={id}
                            getAvatarUrl={getAvatarUrl}
                            getMentionWithQuery={getMentionWithQuery}
                            // $FlowFixMe
                            isDisabled={isDisabled}
                            isEditing={isEditing}
                            isOpen={isInputOpen}
                            mentionSelectorContacts={mentionSelectorContacts}
                            onCancel={commentFormCancelHandler}
                            onFocus={commentFormFocusHandler}
                            tagged_message={tagged_message}
                            updateComment={handleMessageUpdate}
                            user={currentUser}
                        />
                    ) : (
                        <ActivityMessage
                            id={id}
                            isEdited={isEdited && !isResolved}
                            tagged_message={tagged_message}
                            translatedTaggedMessage={translatedTaggedMessage}
                            {...translations}
                            getUserProfileUrl={getUserProfileUrl}
                            translationFailed={error ? true : null}
                        />
                    )}
                </Media.Body>
            </Media>
            {/* $FlowFixMe */}
            {error ? <ActivityError {...error} /> : null}
            {hasReplies && (
                <Replies
                    {...commentProps}
                    isParentPending={isPending}
                    isRepliesLoading={isRepliesLoading}
                    onCommentEdit={onCommentEdit}
                    onHideReplies={onHideReplies}
                    onReplyCreate={onReplyCreate}
                    onReplySelect={onSelect}
                    onShowReplies={onShowReplies}
                    replies={replies}
                    repliesTotalCount={repliesTotalCount}
                />
            )}
        </div>
    );
};

// Added Replies to Comment file to avoid circular dependency warning
type RepliesProps = {
    currentUser?: User,
    getAvatarUrl: GetAvatarUrlCallback,
    getMentionWithQuery?: (searchStr: string) => void,
    getUserProfileUrl?: GetProfileUrlCallback,
    isParentPending?: boolean,
    isRepliesLoading?: boolean,
    mentionSelectorContacts?: SelectorItems<>,
    onCommentEdit: OnCommentEdit,
    onHideReplies?: (shownReplies: CommentType[]) => void,
    onReplyCreate?: (reply: string) => void,
    onReplySelect?: (isSelected: boolean) => void,
    onShowReplies?: () => void,
    replies: CommentType[],
    repliesTotalCount?: number,
    translations?: Translations,
};

export const Replies = ({
    currentUser,
    getAvatarUrl,
    getMentionWithQuery,
    getUserProfileUrl,
    isParentPending = false,
    isRepliesLoading = false,
    mentionSelectorContacts,
    onCommentEdit,
    onReplyCreate,
    onReplySelect = noop,
    onShowReplies,
    onHideReplies,
    replies,
    repliesTotalCount = 0,
    translations,
}: RepliesProps) => {
    const [showReplyForm, setShowReplyForm] = React.useState(false);
    const getReplyPermissions = (reply: CommentType): BoxCommentPermission => {
        const { permissions: { can_delete = false, can_edit = false, can_resolve = false } = {} } = reply;
        return {
            can_delete,
            can_edit,
            can_resolve,
        };
    };

    const handleNewReplyButton = () => {
        setShowReplyForm(true);
        onReplySelect(true);
    };

    const handleCancelNewReply = () => {
        setShowReplyForm(false);
        onReplySelect(false);
    };

    const handleSubmitNewReply = (reply: string, replyCreate: (reply: string) => void) => {
        setShowReplyForm(false);
        replyCreate(reply);
    };

    return (
        <div className="bcs-Replies">
            {!!onShowReplies && !!onHideReplies && (
                <RepliesToggle
                    onHideReplies={index => onHideReplies([replies[index]])}
                    onShowReplies={onShowReplies}
                    repliesShownCount={replies.length}
                    repliesTotalCount={repliesTotalCount}
                />
            )}
            <div className="bcs-Replies-content">
                {isRepliesLoading && (
                    <div className="bcs-Replies-loading" data-testid="replies-loading">
                        <LoadingIndicator />
                    </div>
                )}
                <ol className="bcs-Replies-list">
                    {replies.map(reply => {
                        const { id, type } = reply;

                        return (
                            <li key={`${type}${id}`}>
                                <BaseComment
                                    {...reply}
                                    currentUser={currentUser}
                                    getAvatarUrl={getAvatarUrl}
                                    getMentionWithQuery={getMentionWithQuery}
                                    getUserProfileUrl={getUserProfileUrl}
                                    isPending={isParentPending || reply.isPending}
                                    mentionSelectorContacts={mentionSelectorContacts}
                                    onCommentEdit={onCommentEdit}
                                    onDelete={noop}
                                    onSelect={onReplySelect}
                                    permissions={getReplyPermissions(reply)}
                                    translations={translations}
                                />
                            </li>
                        );
                    })}
                </ol>
            </div>
            {!!onReplyCreate && (
                <CreateReply
                    getMentionWithQuery={getMentionWithQuery}
                    isDisabled={isParentPending}
                    mentionSelectorContacts={mentionSelectorContacts}
                    onCancel={handleCancelNewReply}
                    onClick={handleNewReplyButton}
                    onFocus={() => onReplySelect(true)}
                    onSubmit={reply => handleSubmitNewReply(reply, onReplyCreate)}
                    showReplyForm={showReplyForm}
                />
            )}
        </div>
    );
};
