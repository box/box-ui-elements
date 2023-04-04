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
import DeleteConfirmation from '../common/delete-confirmation';
import LoadingIndicator from '../../../../components/loading-indicator';
import Media from '../../../../components/media';
import messages from './messages';
import Pencil16 from '../../../../icon/line/Pencil16';
import Trash16 from '../../../../icon/line/Trash16';
import UserLink from '../common/user-link';
import X16 from '../../../../icon/fill/X16';
import { ACTIVITY_TARGETS } from '../../../common/interactionTargets';
import { COMMENT_STATUS_OPEN, COMMENT_STATUS_RESOLVED, PLACEHOLDER_USER } from '../../../../constants';
import { MenuItem } from '../../../../components/menu';
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

type BaseCommentProps = {
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
    onDelete: ({ id: string, permissions?: BoxCommentPermission }) => any,
    onEdit: (
        id: string,
        text?: string,
        status?: FeedItemStatus,
        hasMention: boolean,
        permissions: BoxCommentPermission,
        onSuccess: ?Function,
        onError: ?Function,
    ) => void,
    onReplySelect?: (id: number) => void,
    onSelect: (isSelected: boolean) => void,
    permissions: BoxCommentPermission,
    replies?: CommentType[],
    status?: FeedItemStatus,
    tagged_message: string,
    translatedTaggedMessage?: string,
    translations?: Translations,
};

// TODO: Replace and rename to Comment component once threaded replies refactor is fully implemented
const BaseComment = (props: BaseCommentProps) => {
    const {
        created_by,
        created_at,
        permissions = {},
        id,
        isPending,
        isRepliesLoading = false,
        error,
        tagged_message = '',
        translatedTaggedMessage,
        translations,
        currentUser,
        isDisabled,
        getAvatarUrl,
        getUserProfileUrl,
        getMentionWithQuery,
        hasReplies = false,
        mentionSelectorContacts,
        modified_at,
        onDelete,
        onEdit,
        onSelect,
        onReplySelect = noop,
        replies = [],
        status,
    } = props;

    const [isConfirmingDelete, setIsConfirmingDelete] = React.useState<boolean>(false);
    const [isEditing, setIsEditing] = React.useState<boolean>(false);
    const [isInputOpen, setIsInputOpen] = React.useState<boolean>(false);

    const selectComment = (isSelected: boolean = true): void => {
        onSelect(isSelected);
    };

    const handleDeleteConfirm = (): void => {
        onDelete({ id, permissions });
        selectComment(false);
    };

    const handleDeleteCancel = (): void => {
        setIsConfirmingDelete(false);
        selectComment(false);
    };

    const handleDeleteClick = (): void => {
        setIsConfirmingDelete(true);
        selectComment();
    };

    const handleEditClick = (): void => {
        setIsEditing(true);
        setIsInputOpen(true);
        selectComment();
    };

    const handleMenuClose = (): void => {
        if (isConfirmingDelete || isEditing || isInputOpen) {
            return;
        }
        selectComment(false);
    };

    const handleMenuOpen = (): void => {
        selectComment();
    };

    const commentFormFocusHandler = (): void => {
        setIsInputOpen(true);
        selectComment();
    };

    const commentFormCancelHandler = (): void => {
        setIsInputOpen(false);
        setIsEditing(false);
        selectComment(false);
    };

    const commentFormSubmitHandler = (): void => {
        setIsInputOpen(false);
        setIsEditing(false);
        selectComment(false);
    };

    const handleMessageUpdate = ({
        id: messageID,
        text,
        hasMention,
    }: {
        hasMention: boolean,
        id: string,
        text: string,
    }): void => {
        onEdit(messageID, text, undefined, hasMention, permissions);
        commentFormSubmitHandler();
    };

    const handleStatusUpdate = (selectedStatus: FeedItemStatus): void => {
        onEdit(id, undefined, selectedStatus, false, permissions);
    };

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
                    <Avatar getAvatarUrl={getAvatarUrl} user={createdByUser} />
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
                                    onMenuOpen: handleMenuOpen,
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
                            // $FlowFixMe
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
            {hasReplies && (
                <Replies
                    {...commentProps}
                    isRepliesLoading={isRepliesLoading}
                    onReplySelect={onReplySelect}
                    replies={replies}
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
    isRepliesLoading?: boolean,
    mentionSelectorContacts?: SelectorItems<>,
    onReplySelect?: (id: number) => void,
    replies: CommentType[],
    translations?: Translations,
};

const Replies = ({
    currentUser,
    getAvatarUrl,
    getMentionWithQuery,
    getUserProfileUrl,
    isRepliesLoading = false,
    mentionSelectorContacts,
    onReplySelect = noop,
    replies,
    translations,
}: RepliesProps) => {
    const getReplyPermissions = (reply: CommentType): BoxCommentPermission => {
        const { permissions: { can_delete = false, can_edit = false, can_resolve = false } = {} } = reply;
        return {
            can_delete,
            can_edit,
            can_resolve,
        };
    };

    return (
        <div className="bcs-Replies">
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
                                    mentionSelectorContacts={mentionSelectorContacts}
                                    onSelect={onReplySelect}
                                    onDelete={noop}
                                    onEdit={noop}
                                    permissions={getReplyPermissions(reply)}
                                    translations={translations}
                                />
                            </li>
                        );
                    })}
                </ol>
            </div>
        </div>
    );
};

export { BaseComment, Replies };
