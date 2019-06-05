/**
 * @flow
 * @file Comment component
 */

import * as React from 'react';
import noop from 'lodash/noop';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';
import getProp from 'lodash/get';
import identity from 'lodash/identity';

import { ReadableTime } from '../../../../components/time';
import Tooltip from '../../../../components/tooltip';
import { Overlay } from '../../../../components/flyout';
import PrimaryButton from '../../../../components/primary-button';
import Button from '../../../../components/button';
import messages from '../../../common/messages';
import { ACTIVITY_TARGETS } from '../../../common/interactionTargets';

import CommentMenu from './CommentMenu';
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
    permissions?: BoxItemPermission,
    tagged_message: string,
    translatedTaggedMessage?: string,
    translations?: Translations,
    type?: typeof COMMENT_TYPE_DEFAULT | typeof COMMENT_TYPE_TASK,
    userHeadlineRenderer?: React.Node => React.Element<typeof FormattedMessage>,
};

type State = {
    isConfirming?: boolean,
    isEditing?: boolean,
    isFocused?: boolean,
    isInputOpen?: boolean,
};

class Comment extends React.Component<Props, State> {
    static defaultProps = {
        type: COMMENT_TYPE_DEFAULT,
    };

    state = {
        isConfirming: false,
        isEditing: false,
        isFocused: false,
        isInputOpen: false,
    };

    onDeleteConfirmedHandler = (): void => {
        const { id, onDelete, permissions } = this.props;

        if (onDelete) {
            onDelete({ id, permissions });
        }
    };

    onDeleteCancel = (): void => {
        this.setState({ isConfirming: false });
    };

    onDeleteClick = () => {
        this.setState({ isConfirming: true });
    };

    onKeyDown = (event: SyntheticKeyboardEvent<>): void => {
        const { nativeEvent } = event;
        nativeEvent.stopImmediatePropagation();
    };

    approvalCommentFormFocusHandler = (): void => this.setState({ isInputOpen: true });

    approvalCommentFormCancelHandler = (): void => this.setState({ isInputOpen: false, isEditing: false });

    approvalCommentFormSubmitHandler = (): void => this.setState({ isInputOpen: false, isEditing: false });

    updateTaskHandler = (args: any): void => {
        const { onEdit = noop } = this.props;
        onEdit(args);
        this.approvalCommentFormSubmitHandler();
    };

    toEdit = (): void => this.setState({ isEditing: true, isInputOpen: true });

    handleCommentFocus = (): void => {
        this.setState({ isFocused: true });
    };

    handleCommentBlur = (): void => {
        this.setState({ isFocused: false });
    };

    render(): React.Node {
        const {
            avatarRenderer = identity,
            created_by,
            created_at,
            permissions,
            id,
            isPending,
            error,
            onEdit,
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
        const { toEdit } = this;
        const { isConfirming, isEditing, isFocused, isInputOpen } = this.state;
        const createdAtTimestamp = new Date(created_at).getTime();
        const canDelete = getProp(permissions, 'can_delete', false);
        const canEdit = getProp(permissions, 'can_edit', false);
        const canShowMenu = canDelete || canEdit;
        const createdByUser = created_by || PLACEHOLDER_USER;
        const deleteConfirmMessage =
            type === COMMENT_TYPE_DEFAULT ? messages.commentDeletePrompt : messages.taskDeletePrompt;

        return (
            <div className="bcs-comment-container">
                <div
                    className={classNames('bcs-comment', {
                        'bcs-is-pending': isPending || error,
                        'bcs-is-focused': isFocused,
                    })}
                    onBlur={this.handleCommentBlur}
                    onFocus={this.handleCommentFocus}
                >
                    {avatarRenderer(
                        <Avatar className="bcs-comment-avatar" getAvatarUrl={getAvatarUrl} user={createdByUser} />,
                    )}
                    <div className="bcs-comment-content">
                        <div className="bcs-comment-headline">
                            {userHeadlineRenderer(
                                <UserLink
                                    className="bcs-comment-user-name"
                                    data-resin-target={ACTIVITY_TARGETS.PROFILE}
                                    id={createdByUser.id}
                                    name={createdByUser.name}
                                    getUserProfileUrl={getUserProfileUrl}
                                />,
                            )}
                            {canShowMenu && !isConfirming && (
                                <CommentMenu
                                    id={id}
                                    isDisabled={isConfirming}
                                    isPending={isPending}
                                    onDelete={this.onDeleteClick}
                                    onEdit={onEdit}
                                    permissions={permissions}
                                    toEdit={toEdit}
                                />
                            )}
                        </div>
                        <div>
                            <Tooltip
                                text={
                                    <FormattedMessage
                                        {...messages.commentPostedFullDateTime}
                                        values={{ time: createdAtTimestamp }}
                                    />
                                }
                            >
                                <small className="bcs-comment-created-at">
                                    <ReadableTime relativeThreshold={0} alwaysShowTime timestamp={createdAtTimestamp} />
                                </small>
                            </Tooltip>
                        </div>
                        {isEditing ? (
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
                        ) : null}
                        {!isEditing ? (
                            <CommentText
                                id={id}
                                tagged_message={tagged_message}
                                translatedTaggedMessage={translatedTaggedMessage}
                                {...translations}
                                translationFailed={error ? true : null}
                                getUserProfileUrl={getUserProfileUrl}
                            />
                        ) : null}
                    </div>
                </div>
                {error ? <CommentInlineError {...error} /> : null}
                {isConfirming && (
                    <Overlay className="bcs-comment-confirm-container">
                        <div className="bsc-comment-confirm-prompt">
                            <FormattedMessage {...deleteConfirmMessage} />
                        </div>
                        <div>
                            <PrimaryButton
                                className="bcs-comment-confirm-delete"
                                onClick={this.onDeleteConfirmedHandler}
                                type="button"
                            >
                                <FormattedMessage {...messages.delete} />
                            </PrimaryButton>
                            <Button className="bcs-comment-confirm-cancel" onClick={this.onDeleteCancel} type="button">
                                <FormattedMessage {...messages.cancel} />
                            </Button>
                        </div>
                    </Overlay>
                )}
            </div>
        );
    }
}

export default Comment;
