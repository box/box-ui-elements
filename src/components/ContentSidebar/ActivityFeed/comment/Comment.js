/**
 * @flow
 * @file Comment component
 */

import * as React from 'react';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';
import getProp from 'lodash/get';

import Avatar from 'box-react-ui/lib/components/avatar';
import { Link } from 'box-react-ui/lib/components/link';
import { ReadableTime } from 'box-react-ui/lib/components/time';
import Tooltip from 'box-react-ui/lib/components/tooltip';

import type { ActionItemError, User } from '../../../../flowTypes';
import InlineDelete from './InlineDelete';
import InlineEdit from './InlineEdit';
import CommentInlineError from './CommentInlineError';
import CommentText from './CommentText';
import ApprovalCommentForm from '../approval-comment-form';
import formatTaggedMessage from '../utils/formatTaggedMessage';
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
    createdBy: User,
    createdAt: string | number,
    permissions?: {
        comment_delete?: boolean,
        comment_edit?: boolean,
        task_edit?: boolean,
        task_delete?: boolean
    },
    id: string,
    isPending?: boolean,
    error?: ActionItemError,
    onDelete?: Function,
    onEdit: Function,
    taggedMessage: string,
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
    mentionSelectorContacts?: SelectorItems
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
            createdBy,
            createdAt,
            permissions,
            id,
            isPending,
            error,
            onDelete,
            onEdit,
            taggedMessage,
            translatedTaggedMessage,
            translations,
            handlers,
            currentUser,
            isDisabled,
            approverSelectorContacts,
            mentionSelectorContacts
        } = this.props;
        const { toEdit } = this;
        const { isEditing, isFocused, isInputOpen } = this.state;
        const createdAtTimestamp = new Date(createdAt).getTime();
        const canDeleteTasks = getProp(permissions, 'task_delete', false);
        const canDeleteTasksOrComments = canDeleteTasks || getProp(permissions, 'comment_delete');
        const canEditTasksOrComments = getProp(permissions, 'task_edit') || getProp(permissions, 'comment_edit');

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
                    <Avatar className='bcs-comment-avatar' {...createdBy} />
                    <div className='bcs-comment-content'>
                        <div className='bcs-comment-headline'>
                            <Link className='bcs-comment-user-name' href={`/profile/${createdBy.id}`}>
                                {createdBy.name}
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
                            {onEdit && canEditTasksOrComments ? <InlineEdit id={id} toEdit={toEdit} /> : null}
                            {onDelete && canDeleteTasksOrComments ? (
                                <InlineDelete
                                    id={id}
                                    message={
                                        canDeleteTasks ? (
                                            <FormattedMessage {...messages.taskDeletePrompt} />
                                        ) : (
                                            <FormattedMessage {...messages.commentDeletePrompt} />
                                        )
                                    }
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
                                taggedMessage={formatTaggedMessage(taggedMessage, id, true)}
                            />
                        ) : null}
                        {!isEditing ? (
                            <CommentText
                                id={id}
                                taggedMessage={taggedMessage}
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
