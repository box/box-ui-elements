// @flow
import * as React from 'react';
import classNames from 'classnames';
import noop from 'lodash/noop';
import { FormattedMessage } from 'react-intl';
import TetherComponent from 'react-tether';
import Trash16 from '../../../../icon/line/Trash16';
import Pencil16 from '../../../../icon/line/Pencil16';
import Avatar from '../Avatar';
import Media from '../../../../components/media';
import { MenuItem } from '../../../../components/menu';
import { ACTIVITY_TARGETS } from '../../../common/interactionTargets';
import DeleteConfirmation from '../common/delete-confirmation';
import ActivityTimestamp from '../common/activity-timestamp';
import UserLink from '../common/user-link';
import ActivityError from '../common/activity-error';
import ActivityMessage from '../common/activity-message';
import CommentForm from '../comment-form';
import { PLACEHOLDER_USER } from '../../../../constants';
import messages from './messages';
import type { GetAvatarUrlCallback, GetProfileUrlCallback } from '../../../common/flowTypes';
import type { Translations } from '../../flowTypes';
import type { SelectorItems, User } from '../../../../common/types/core';
import type { BoxCommentPermission, ActionItemError } from '../../../../common/types/feed';
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
    onEdit: (id: string, text: string, hasMention: boolean, permissions?: BoxCommentPermission) => any,
    permissions?: BoxCommentPermission,
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

    handleUpdate = ({ id, text, hasMention }: { hasMention: boolean, id: string, text: string }): void => {
        const { onEdit, permissions } = this.props;
        onEdit(id, text, hasMention, permissions);
        this.commentFormSubmitHandler();
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
            onEdit,
        } = this.props;
        const { isConfirmingDelete, isEditing, isInputOpen } = this.state;
        const createdAtTimestamp = new Date(created_at).getTime();
        const createdByUser = created_by || PLACEHOLDER_USER;
        const canEdit = onEdit !== noop && permissions.can_edit;
        const canDelete = permissions.can_delete;
        const isMenuVisible = (canDelete || canEdit) && !isPending;

        return (
            <div className="bcs-Comment">
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
                        {isEditing ? (
                            <CommentForm
                                isDisabled={isDisabled}
                                className={classNames('bcs-Comment-editor', {
                                    'bcs-is-disabled': isDisabled,
                                })}
                                updateComment={this.handleUpdate}
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
            </div>
        );
    }
}

export default Comment;
