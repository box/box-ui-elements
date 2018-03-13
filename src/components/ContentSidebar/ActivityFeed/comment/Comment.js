import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';

import Avatar from '../../../components/avatar';
import InlineError from '../../../components/inline-error';
import { Link } from '../../../components/link';
import PlainButton from '../../../components/plain-button';
import { ReadableTime } from '../../../components/time';
import Tooltip from '../../../components/tooltip';
import { ActionItemErrorPropType, UserPropType, SelectorItemsPropType } from '../../../common/box-proptypes';

import InlineDelete from './InlineDelete';
import InlineEdit from './InlineEdit';
import CommentText from './CommentText';
import ApprovalCommentForm from '../approval-comment-form';
import formatTaggedMessage from '../utils/formatTaggedMessage';
import messages from '../messages';

import './Comment.scss';

const oneHourInMs = 3600000; // 60 * 60 * 1000

const CommentInlineError = ({ action, message, title }) => (
    <InlineError className='box-ui-comment-error' title={title}>
        <div>{message}</div>
        {action ? (
            <PlainButton className='lnk box-ui-comment-error-action' onClick={action.onAction} type='button'>
                {action.text}
            </PlainButton>
        ) : null}
    </InlineError>
);

CommentInlineError.propTypes = {
    action: PropTypes.shape({
        onAction: PropTypes.func,
        text: PropTypes.node
    }),
    message: PropTypes.node,
    title: PropTypes.node
};

class Comment extends Component {
    static displayName = 'Comment';

    static propTypes = {
        createdBy: UserPropType.isRequired,
        createdAt: PropTypes.any,
        permissions: PropTypes.shape({
            comment_delete: PropTypes.bool,
            comment_edit: PropTypes.bool
        }),
        id: PropTypes.string.isRequired,
        isPending: PropTypes.bool,
        error: ActionItemErrorPropType,
        onDelete: PropTypes.func,
        onEdit: PropTypes.func,
        taggedMessage: PropTypes.string.isRequired,
        translatedTaggedMessage: PropTypes.string,
        translations: PropTypes.shape({
            translationEnabled: PropTypes.bool,
            onTranslate: PropTypes.func
        }),
        handlers: PropTypes.shape({
            tasks: PropTypes.shape({
                update: PropTypes.func
            }),
            contacts: PropTypes.shape({
                getApproverWithQuery: PropTypes.func.isRequired,
                getMentionWithQuery: PropTypes.func.isRequired
            }),
            versions: PropTypes.shape({
                info: PropTypes.func
            })
        }),
        inputState: PropTypes.shape({
            approverSelectorContacts: SelectorItemsPropType,
            mentionSelectorContacts: SelectorItemsPropType,
            currentUser: UserPropType.isRequired,
            isDisabled: PropTypes.bool
        })
    };

    constructor(props) {
        super(props);
        this.state = {
            isEditing: false,
            isFocused: false,
            isInputOpen: false
        };
    }

    onKeyDown = (event) => {
        const { nativeEvent } = event;
        nativeEvent.stopImmediatePropagation();
    };

    approvalCommentFormFocusHandler = () => this.setState({ isInputOpen: true });
    approvalCommentFormCancelHandler = () => this.setState({ isInputOpen: false, isEditing: false });
    approvalCommentFormSubmitHandler = () => this.setState({ isInputOpen: false, isEditing: false });
    updateTaskHandler = (args) => {
        const { onEdit } = this.props;
        onEdit(args);
        this.approvalCommentFormSubmitHandler();
    };

    toEdit = () => this.setState({ isEditing: true, isInputOpen: true });

    handleCommentFocus = () => {
        this.setState({ isFocused: true });
    };

    handleCommentBlur = () => {
        this.setState({ isFocused: false });
    };

    render() {
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
        const toEdit = this.toEdit;
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
                                    <ReadableTime timestamp={createdAtTimestamp} relativeThreshold={oneHourInMs} />
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
