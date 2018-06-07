/**
 * @flow
 * @file Comment component
 */

import * as React from 'react';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';
import getProp from 'lodash/get';

import { Link } from 'box-react-ui/lib/components/link';
import { ReadableTime } from 'box-react-ui/lib/components/time';
import Tooltip from 'box-react-ui/lib/components/tooltip';

import InlineDelete from './InlineDelete';
import InlineEdit from './InlineEdit';
import CommentInlineError from './CommentInlineError';
import CommentText from './CommentText';
import ApprovalCommentForm from '../approval-comment-form';
import formatTaggedMessage from '../utils/formatTaggedMessage';
import Avatar from '../Avatar';
import messages from '../../../messages';

import './Comment.scss';
import type {
    CommentHandlers,
    VersionHandlers,
    ContactHandlers,
    TaskHandlers,
    Translations
} from '../activityFeedFlowTypes';

const ONE_HOUR_MS = 3600000; // 60 * 60 * 1000

type Props = {
    created_by: User,
    created_at: string | number,
    is_reply_comment?: boolean,
    modified_at?: string | number,
    permissions?: {
        can_delete?: boolean,
        can_edit?: boolean
    },
    id: string,
    isPending?: boolean,
    inlineDeleteMessage?: MessageDescriptor,
    error?: ActionItemError,
    onDelete?: Function,
    onEdit: Function,
    tagged_message: string,
    translatedTaggedMessage?: string,
    translations: Translations,
    handlers: {
        comments?: CommentHandlers,
        tasks?: TaskHandlers,
        contacts?: ContactHandlers,
        versions?: VersionHandlers
    },
    currentUser: User,
    isDisabled?: boolean,
    approverSelectorContacts?: SelectorItems,
    mentionSelectorContacts?: SelectorItems,
    getAvatarUrl: (string) => Promise<?string>
};

type State = {
    isEditing?: boolean,
    isFocused?: boolean,
    isInputOpen?: boolean
};

class Comment extends React.Component<Props, State> {
    state = {
        isEditing: false,
        isFocused: false,
        isInputOpen: false
    };

    onKeyDown = (event: SyntheticKeyboardEvent<>): void => {
        const { nativeEvent } = event;
        nativeEvent.stopImmediatePropagation();
    };

    approvalCommentFormFocusHandler = (): void => this.setState({ isInputOpen: true });
    approvalCommentFormCancelHandler = (): void => this.setState({ isInputOpen: false, isEditing: false });
    approvalCommentFormSubmitHandler = (): void => this.setState({ isInputOpen: false, isEditing: false });
    updateTaskHandler = (args: any): void => {
        const { onEdit } = this.props;
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
            created_by,
            created_at,
            permissions,
            id,
            inlineDeleteMessage = messages.commentDeletePrompt,
            isPending,
            error,
            onDelete,
            onEdit,
            tagged_message = '',
            translatedTaggedMessage,
            translations,
            handlers,
            currentUser,
            isDisabled,
            approverSelectorContacts,
            mentionSelectorContacts,
            getAvatarUrl
        } = this.props;
        const { toEdit } = this;
        const { isEditing, isFocused, isInputOpen } = this.state;
        const createdAtTimestamp = new Date(created_at).getTime();
        const canDelete = getProp(permissions, 'can_delete', false);
        const canEdit = getProp(permissions, 'can_edit', false);

        // const canDeleteTasks = getProp(permissions, 'task_delete', false);
        // const canDeleteTasksOrComments = canDeleteTasks || getProp(permissions, 'comment_delete');
        // const canEditTasksOrComments = getProp(permissions, 'task_edit') || getProp(permissions, 'comment_edit');

        return (
            <div className='bcs-comment-container'>
                <div
                    className={classNames('bcs-comment', {
                        'bcs-is-pending': isPending || error,
                        'bcs-is-focused': isFocused
                    })}
                    onBlur={this.handleCommentBlur}
                    onFocus={this.handleCommentFocus}
                >
                    <Avatar className='bcs-comment-avatar' getAvatarUrl={getAvatarUrl} user={created_by} />
                    <div className='bcs-comment-content'>
                        <div className='bcs-comment-headline'>
                            <Link className='bcs-comment-user-name' href={`/profile/${created_by.id}`}>
                                {created_by.name}
                            </Link>
                            <Tooltip
                                text={
                                    <FormattedMessage
                                        {...messages.commentPostedFullDateTime}
                                        values={{ time: createdAtTimestamp }}
                                    />
                                }
                            >
                                <small className='bcs-comment-created-at'>
                                    <ReadableTime timestamp={createdAtTimestamp} relativeThreshold={ONE_HOUR_MS} />
                                </small>
                            </Tooltip>
                            {onEdit && canEdit ? <InlineEdit id={id} toEdit={toEdit} /> : null}
                            {onDelete && canDelete ? (
                                <InlineDelete
                                    id={id}
                                    permissions={permissions}
                                    message={<FormattedMessage {...inlineDeleteMessage} />}
                                    onDelete={onDelete}
                                />
                            ) : null}
                        </div>
                        {isEditing ? (
                            <ApprovalCommentForm
                                onSubmit={() => {}}
                                isDisabled={isDisabled}
                                approverSelectorContacts={approverSelectorContacts}
                                mentionSelectorContacts={mentionSelectorContacts}
                                className={classNames('bcs-activity-feed-comment-input', {
                                    'bcs-is-disabled': isDisabled
                                })}
                                // createComment={this.createCommentHandler}
                                updateTask={this.updateTaskHandler}
                                getApproverContactsWithQuery={
                                    handlers && handlers.contacts ? handlers.contacts.getApproverWithQuery : null
                                }
                                getMentionContactsWithQuery={
                                    handlers && handlers.contacts ? handlers.contacts.getMentionWithQuery : null
                                }
                                isOpen={isInputOpen}
                                user={currentUser}
                                onCancel={this.approvalCommentFormCancelHandler}
                                onFocus={this.approvalCommentFormFocusHandler}
                                isEditing={isEditing}
                                entityId={id}
                                tagged_message={formatTaggedMessage(tagged_message, id, true)}
                            />
                        ) : null}
                        {!isEditing ? (
                            <CommentText
                                id={id}
                                tagged_message={tagged_message}
                                translatedTaggedMessage={translatedTaggedMessage}
                                {...translations}
                                translationFailed={error ? true : null}
                            />
                        ) : null}
                    </div>
                </div>
                {error ? <CommentInlineError {...error} /> : null}
            </div>
        );
    }
}

export default Comment;
