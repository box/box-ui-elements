/**
 * @flow
 * @file Comment component
 */

import React, { Component, ReactNode } from 'react';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';

import Avatar from 'box-react-ui/lib/components/avatar';
import { Link } from 'box-react-ui/lib/components/link';
import { ReadableTime } from 'box-react-ui/lib/components/time';
import Tooltip from 'box-react-ui/lib/components/tooltip';

import type { ActionItemError, SelectorItems, User } from '../../../../flowTypes';
import InlineDelete from './InlineDelete';
import InlineEdit from './InlineEdit';
import CommentInlineError from './CommentInlineError';
import CommentText from './CommentText';
import ApprovalCommentForm from '../approval-comment-form';
import formatTaggedMessage from '../utils/formatTaggedMessage';
import messages from '../messages';

import './Comment.scss';

const ONE_HOUR_MS = 3600000; // 60 * 60 * 1000

type Props = {
    createdBy: User,
    createdAt: string | number,
    permissions: {
        comment_delete: boolean,
        comment_edit: boolean
    },
    id: string,
    isPending: boolean,
    error: ActionItemError,
    onDelete: Function,
    onEdit: Function,
    taggedMessage: string,
    translatedTaggedMessage: string,
    translations: {
        translationEnabled: boolean,
        onTranslate: Function
    },
    handlers: {
        tasks: {
            update: Function
        },
        contacts: {
            getApproverWithQuery: Function,
            getMentionWithQuery: Function
        },
        versions: {
            info: Function
        }
    },
    inputState: {
        approverSelectorContacts: SelectorItems,
        mentionSelectorContacts: SelectorItems,
        currentUser: User,
        isDisabled: boolean
    }
};

class Comment extends Component<Props> {
    static displayName = 'Comment';

    state = {
        isEditing: false,
        isFocused: false,
        isInputOpen: false
    };

    onKeyDown = (event: React.SyntheticEvent): void => {
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

    render(): ReactNode {
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
            inputState
        } = this.props;
        const { approverSelectorContacts, mentionSelectorContacts, currentUser } = inputState;
        const { toEdit } = this;
        const { isEditing, isFocused, isInputOpen } = this.state;
        const createdAtTimestamp = new Date(createdAt).getTime();
        return (
            <div className='box-ui-comment-container'>
                <div
                    className={classNames('box-ui-comment', {
                        'is-pending': isPending || error,
                        'is-focused': isFocused
                    })}
                    onBlur={this.handleCommentBlur}
                    onFocus={this.handleCommentFocus}
                >
                    <Avatar className='box-ui-comment-avatar' {...createdBy} />
                    <div className='box-ui-comment-content'>
                        <div className='box-ui-comment-headline'>
                            <Link className='box-ui-comment-user-name' href={`/profile/${createdBy.id}`}>
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
                                <small className='box-ui-comment-created-at'>
                                    <ReadableTime timestamp={createdAtTimestamp} relativeThreshold={ONE_HOUR_MS} />
                                </small>
                            </Tooltip>
                            {onEdit && permissions && permissions.task_edit ? (
                                <InlineEdit id={id} toEdit={toEdit} />
                            ) : null}
                            {onDelete && permissions && (permissions.comment_delete || permissions.task_delete) ? (
                                <InlineDelete
                                    id={id}
                                    message={
                                        permissions.task_delete || false ? (
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
                                isDisabled={inputState.isDisabled}
                                approverSelectorContacts={approverSelectorContacts}
                                mentionSelectorContacts={mentionSelectorContacts}
                                className={`box-ui-activity-feed-comment-input ${
                                    inputState.isDisabled ? 'is-disabled' : ''
                                }`}
                                createComment={this.createCommentHandler}
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
