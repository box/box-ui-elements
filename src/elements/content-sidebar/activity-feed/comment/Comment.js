/**
 * @flow
 * @file Comment component
 */

import * as React from 'react';
import noop from 'lodash/noop';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';
import TetherComponent from 'react-tether';
import identity from 'lodash/identity';

import Media from '../../../../components/media';
import { MenuItem } from '../../../../components/menu';
import IconTrash from '../../../../icons/general/IconTrash';
import IconPencil from '../../../../icons/general/IconPencil';
import messages from './messages';
import { ACTIVITY_TARGETS } from '../../../common/interactionTargets';
import { bdlGray80 } from '../../../../styles/variables';

import DeleteConfirmation from '../common/DeleteConfirmation';
import Timestamp from '../common/Timestamp';
import UserLink from './UserLink';
import CommentInlineError from './CommentInlineError';
import CommentText from './CommentText';
import ApprovalCommentForm from '../approval-comment-form';
import formatTaggedMessage from '../utils/formatTaggedMessage';
import Avatar from '../Avatar';

import './Comment.scss';
import { COMMENT_TYPE_DEFAULT, COMMENT_TYPE_TASK, PLACEHOLDER_USER } from '../../../../constants';

type Props = {
    avatarRenderer?: React.Node => React.Element<any>,
    created_at: string | number,
    created_by: User,
    currentUser?: User,
    error?: ActionItemError,
    getAvatarUrl: GetAvatarUrlCallback,
    getMentionWithQuery?: Function,
    getUserProfileUrl?: GetProfileUrlCallback,
    id: string,
    isDisabled?: boolean,
    isPending?: boolean,
    is_reply_comment?: boolean,
    mentionSelectorContacts?: SelectorItems,
    modified_at?: string | number,
    onDelete?: Function,
    onEdit?: Function,
    onEditClick?: () => any,
    permissions?: BoxItemPermission,
    tagged_message: string,
    translatedTaggedMessage?: string,
    translations?: Translations,
    type: typeof COMMENT_TYPE_DEFAULT | typeof COMMENT_TYPE_TASK,
    userHeadlineRenderer?: React.Node => React.Element<typeof FormattedMessage>,
};

type State = {
    isConfirmingDelete: boolean,
    isEditing: boolean,
    isInputOpen: boolean,
};

class Comment extends React.Component<Props, State> {
    static defaultProps = {
        type: COMMENT_TYPE_DEFAULT,
    };

    state = {
        isConfirmingDelete: false,
        isEditing: false,
        isInputOpen: false,
    };

    handleDeleteConfirm = (): void => {
        const { id, onDelete, permissions } = this.props;

        if (onDelete) {
            onDelete({ id, permissions });
        }
    };

    handleDeleteCancel = (): void => {
        this.setState({ isConfirmingDelete: false });
    };

    handleDeleteClick = () => {
        this.setState({ isConfirmingDelete: true });
    };

    handleEditClick = (): void => {
        const { onEditClick } = this.props;

        if (onEditClick) {
            onEditClick();
        } else {
            this.setState({ isEditing: true, isInputOpen: true });
        }
    };

    approvalCommentFormFocusHandler = (): void => this.setState({ isInputOpen: true });

    approvalCommentFormCancelHandler = (): void => this.setState({ isInputOpen: false, isEditing: false });

    approvalCommentFormSubmitHandler = (): void => this.setState({ isInputOpen: false, isEditing: false });

    updateTaskHandler = (args: any): void => {
        const { onEdit = noop } = this.props;
        onEdit(args);
        this.approvalCommentFormSubmitHandler();
    };

    render(): React.Node {
        const {
            avatarRenderer = identity,
            created_by,
            created_at,
            permissions = {},
            id,
            isPending,
            error,
            tagged_message = '',
            userHeadlineRenderer = identity,
            translatedTaggedMessage,
            translations,
            type,
            currentUser,
            isDisabled,
            getAvatarUrl,
            getUserProfileUrl,
            getMentionWithQuery,
            mentionSelectorContacts,
        } = this.props;
        const { isConfirmingDelete, isEditing, isInputOpen } = this.state;
        const createdAtTimestamp = new Date(created_at).getTime();
        const createdByUser = created_by || PLACEHOLDER_USER;
        const isTask = type === COMMENT_TYPE_TASK;
        const canEdit = isTask && permissions.can_edit; // comment editing not supported
        const canDelete = permissions.can_delete;
        const confirmMessage = isTask ? messages.taskDeletePrompt : messages.commentDeletePrompt;
        const isMenuVisible = (canDelete || canEdit) && !isPending;

        return (
            <div className="bcs-comment-container">
                <Media
                    className={classNames('bcs-comment', {
                        'bcs-is-pending': isPending || error,
                    })}
                >
                    <Media.Figure>
                        {avatarRenderer(<Avatar getAvatarUrl={getAvatarUrl} user={createdByUser} />)}
                    </Media.Figure>
                    <Media.Body>
                        {isMenuVisible && (
                            <TetherComponent
                                attachment="top right"
                                className="bcs-comment-delete-confirm"
                                constraints={[{ to: 'scrollParent', attachment: 'together' }]}
                                targetAttachment="bottom right"
                            >
                                <Media.Menu isDisabled={isConfirmingDelete} data-testid="comment-actions-menu">
                                    {canEdit && (
                                        <MenuItem
                                            className="bcs-comment-menu-edit"
                                            data-resin-target={ACTIVITY_TARGETS.INLINE_EDIT}
                                            data-testid="edit-comment"
                                            onClick={this.handleEditClick}
                                        >
                                            <IconPencil color={bdlGray80} />
                                            <FormattedMessage
                                                {...(isTask ? messages.taskEditMenuItem : messages.commentEditMenuItem)}
                                            />
                                        </MenuItem>
                                    )}
                                    {canDelete && (
                                        <MenuItem
                                            className="bcs-comment-menu-delete"
                                            data-resin-target={ACTIVITY_TARGETS.INLINE_DELETE}
                                            data-testid="delete-comment"
                                            onClick={this.handleDeleteClick}
                                        >
                                            <IconTrash color={bdlGray80} />
                                            <FormattedMessage
                                                {...(isTask
                                                    ? messages.taskDeleteMenuItem
                                                    : messages.commentDeleteMenuItem)}
                                            />
                                        </MenuItem>
                                    )}
                                </Media.Menu>
                                {isConfirmingDelete && (
                                    <DeleteConfirmation
                                        isOpen={isConfirmingDelete}
                                        message={confirmMessage}
                                        onDeleteCancel={this.handleDeleteCancel}
                                        onDeleteConfirm={this.handleDeleteConfirm}
                                    />
                                )}
                            </TetherComponent>
                        )}
                        <div>
                            {userHeadlineRenderer(
                                <UserLink
                                    className="bcs-comment-user-name"
                                    data-resin-target={ACTIVITY_TARGETS.PROFILE}
                                    id={createdByUser.id}
                                    name={createdByUser.name}
                                    getUserProfileUrl={getUserProfileUrl}
                                />,
                            )}
                        </div>
                        <div>
                            <Timestamp date={createdAtTimestamp} />
                        </div>
                        {isEditing ? (
                            /* Inline editing is not currently supported for comments */
                            <ApprovalCommentForm
                                onSubmit={() => {}}
                                isDisabled={isDisabled}
                                className={classNames('bcs-activity-feed-comment-input', {
                                    'bcs-is-disabled': isDisabled,
                                })}
                                updateTask={this.updateTaskHandler}
                                isOpen={isInputOpen}
                                user={currentUser}
                                onCancel={this.approvalCommentFormCancelHandler}
                                onFocus={this.approvalCommentFormFocusHandler}
                                isEditing={isEditing}
                                entityId={id}
                                tagged_message={formatTaggedMessage(tagged_message, id, true, getUserProfileUrl)}
                                getAvatarUrl={getAvatarUrl}
                                mentionSelectorContacts={mentionSelectorContacts}
                                getMentionWithQuery={getMentionWithQuery}
                            />
                        ) : (
                            <CommentText
                                id={id}
                                tagged_message={tagged_message}
                                translatedTaggedMessage={translatedTaggedMessage}
                                {...translations}
                                translationFailed={error ? true : null}
                                getUserProfileUrl={getUserProfileUrl}
                            />
                        )}
                    </Media.Body>
                </Media>
                {error ? <CommentInlineError {...error} /> : null}
            </div>
        );
    }
}

export default Comment;
