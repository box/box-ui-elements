// @flow
import * as React from 'react';
import classNames from 'classnames';
import noop from 'lodash/noop';
import { FormattedMessage } from 'react-intl';
import TetherComponent from 'react-tether';
import Checkmark16 from '../../../../icon/line/Checkmark16';
import Trash16 from '../../../../icon/line/Trash16';
import Pencil16 from '../../../../icon/line/Pencil16';
import X16 from '../../../../icon/fill/X16';
import Avatar from '../Avatar';
import Media from '../../../../components/media';
import { MenuItem } from '../../../../components/menu';
import { ACTIVITY_TARGETS } from '../../../common/interactionTargets';
import DeleteConfirmation from '../common/delete-confirmation';
import ActivityTimestamp from '../common/activity-timestamp';
import UserLink from '../common/user-link';
import ActivityCard from '../ActivityCard';
import ActivityError from '../common/activity-error';
import ActivityMessage from '../common/activity-message';
import ActivityStatus from '../common/activity-status';
import CommentForm from '../comment-form';
import { COMMENT_STATUS_OPEN, COMMENT_STATUS_RESOLVED, PLACEHOLDER_USER } from '../../../../constants';
import messages from './messages';
import type { GetAvatarUrlCallback, GetProfileUrlCallback } from '../../../common/flowTypes';
import type { Translations } from '../../flowTypes';
import type { SelectorItems, User } from '../../../../common/types/core';
import type { ActionItemError, BoxCommentPermission, FeedItemStatus } from '../../../../common/types/feed';
import './Comment.scss';

type Props = {
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
    permissions: BoxCommentPermission,
    status?: FeedItemStatus,
    tagged_message: string,
    translatedTaggedMessage?: string,
    translations?: Translations,
};

type State = {
    isConfirmingDelete: boolean,
    isEditing: boolean,
    isInputOpen: boolean,
};

class Comment extends React.Component<Props, State> {
    static defaultProps = {
        onDelete: noop,
        onEdit: noop,
    };

    state = {
        isConfirmingDelete: false,
        isEditing: false,
        isInputOpen: false,
    };

    handleDeleteConfirm = (): void => {
        const { id, onDelete, permissions } = this.props;
        onDelete({ id, permissions });
    };

    handleDeleteCancel = (): void => {
        this.setState({ isConfirmingDelete: false });
    };

    handleDeleteClick = () => {
        this.setState({ isConfirmingDelete: true });
    };

    handleEditClick = (): void => {
        this.setState({ isEditing: true, isInputOpen: true });
    };

    commentFormFocusHandler = (): void => this.setState({ isInputOpen: true });

    commentFormCancelHandler = (): void => this.setState({ isInputOpen: false, isEditing: false });

    commentFormSubmitHandler = (): void => this.setState({ isInputOpen: false, isEditing: false });

    handleMessageUpdate = ({ id, text, hasMention }: { hasMention: boolean, id: string, text: string }): void => {
        const { onEdit, permissions } = this.props;
        onEdit(id, text, undefined, hasMention, permissions);
        this.commentFormSubmitHandler();
    };

    handleStatusUpdate = (status: FeedItemStatus): void => {
        const { id, onEdit, permissions } = this.props;
        onEdit(id, undefined, status, false, permissions);
    };

    render(): React.Node {
        const {
            created_by,
            created_at,
            permissions = {},
            id,
            isPending,
            error,
            tagged_message = '',
            translatedTaggedMessage,
            translations,
            currentUser,
            isDisabled,
            getAvatarUrl,
            getUserProfileUrl,
            getMentionWithQuery,
            mentionSelectorContacts,
            modified_at,
            onEdit,
            status,
        } = this.props;
        const { isConfirmingDelete, isEditing, isInputOpen } = this.state;
        const canDelete = permissions.can_delete;
        const canEdit = onEdit !== noop && permissions.can_edit;
        const canResolve = onEdit !== noop && permissions.can_resolve;
        const createdAtTimestamp = new Date(created_at).getTime();
        const createdByUser = created_by || PLACEHOLDER_USER;
        const isEdited = modified_at !== undefined && modified_at !== created_at;
        const isMenuVisible = (canDelete || canEdit || canResolve) && !isPending;
        const isResolved = status === COMMENT_STATUS_RESOLVED;

        return (
            <ActivityCard className="bcs-Comment">
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
                                    menuProps={{
                                        'data-resin-component': ACTIVITY_TARGETS.COMMENT_OPTIONS,
                                    }}
                                >
                                    {canResolve && isResolved && (
                                        <MenuItem
                                            data-resin-target={ACTIVITY_TARGETS.COMMENT_OPTIONS_EDIT}
                                            data-testid="unresolve-comment"
                                            onClick={() => this.handleStatusUpdate(COMMENT_STATUS_OPEN)}
                                        >
                                            <X16 />
                                            <FormattedMessage {...messages.commentUnresolveMenuItem} />
                                        </MenuItem>
                                    )}
                                    {canResolve && !isResolved && (
                                        <MenuItem
                                            data-resin-target={ACTIVITY_TARGETS.COMMENT_OPTIONS_EDIT}
                                            data-testid="resolve-comment"
                                            onClick={() => this.handleStatusUpdate(COMMENT_STATUS_RESOLVED)}
                                        >
                                            <Checkmark16 />
                                            <FormattedMessage {...messages.commentResolveMenuItem} />
                                        </MenuItem>
                                    )}
                                    {canEdit && (
                                        <MenuItem
                                            data-resin-target={ACTIVITY_TARGETS.COMMENT_OPTIONS_EDIT}
                                            data-testid="edit-comment"
                                            onClick={this.handleEditClick}
                                        >
                                            <Pencil16 />
                                            <FormattedMessage {...messages.commentEditMenuItem} />
                                        </MenuItem>
                                    )}
                                    {canDelete && (
                                        <MenuItem
                                            data-resin-target={ACTIVITY_TARGETS.COMMENT_OPTIONS_DELETE}
                                            data-testid="delete-comment"
                                            onClick={this.handleDeleteClick}
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
                                        onDeleteCancel={this.handleDeleteCancel}
                                        onDeleteConfirm={this.handleDeleteConfirm}
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
                        <div>
                            <ActivityTimestamp date={createdAtTimestamp} />
                        </div>
                        <ActivityStatus status={status} />
                        {isEditing ? (
                            <CommentForm
                                isDisabled={isDisabled}
                                className={classNames('bcs-Comment-editor', {
                                    'bcs-is-disabled': isDisabled,
                                })}
                                updateComment={this.handleMessageUpdate}
                                isOpen={isInputOpen}
                                // $FlowFixMe
                                user={currentUser}
                                onCancel={this.commentFormCancelHandler}
                                onFocus={this.commentFormFocusHandler}
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
                                isEdited={(isEdited: boolean)}
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
            </ActivityCard>
        );
    }
}

export default Comment;
