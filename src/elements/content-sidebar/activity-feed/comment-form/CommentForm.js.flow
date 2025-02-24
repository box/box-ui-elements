/**
 * @flow
 * @file Component for Approval comment form
 */

import * as React from 'react';
import noop from 'lodash/noop';
import classNames from 'classnames';
import { EditorState } from 'draft-js';
import { FormattedMessage, injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';
import Avatar from '../Avatar';
import CommentFormControls from './CommentFormControls';
import DraftJSMentionSelector, {
    createMentionSelectorState,
    getFormattedCommentText,
} from '../../../../components/form-elements/draft-js-mention-selector';
import Form from '../../../../components/form-elements/form/Form';
import Media from '../../../../components/media';
import messages from './messages';
import type { GetAvatarUrlCallback } from '../../../common/flowTypes';
import type { SelectorItems, User } from '../../../../common/types/core';

import './CommentForm.scss';

type Props = {
    className: string,
    contactsLoaded?: boolean,
    createComment?: Function,
    entityId?: string,
    getAvatarUrl?: GetAvatarUrlCallback,
    getMentionWithQuery?: Function,
    intl: IntlShape,
    isDisabled?: boolean,
    isEditing?: boolean,
    isOpen: boolean,
    mentionSelectorContacts?: SelectorItems<>,
    onCancel: Function,
    onFocus?: Function,
    onSubmit?: Function,
    placeholder?: string,
    shouldFocusOnOpen: boolean,
    showTip?: boolean,
    tagged_message?: string,
    updateComment?: Function,
    user?: User,
};

const getEditorState = (shouldFocusOnOpen: boolean, message?: string): EditorState =>
    shouldFocusOnOpen
        ? EditorState.moveFocusToEnd(createMentionSelectorState(message))
        : createMentionSelectorState(message);

type State = {
    commentEditorState: any,
};

class CommentForm extends React.Component<Props, State> {
    static defaultProps = {
        isOpen: false,
        shouldFocusOnOpen: false,
    };

    state = {
        commentEditorState: getEditorState(this.props.shouldFocusOnOpen, this.props.tagged_message),
    };

    componentDidUpdate({ isOpen: prevIsOpen }: Props): void {
        const { isOpen } = this.props;

        if (isOpen !== prevIsOpen && !isOpen) {
            this.setState({
                commentEditorState: getEditorState(false),
            });
        }
    }

    onFormValidSubmitHandler = (): void => {
        const { createComment = noop, updateComment = noop, onSubmit, entityId } = this.props;

        const { text, hasMention } = this.getFormattedCommentText();

        if (!text) {
            return;
        }

        if (entityId) {
            updateComment({ id: entityId, text, hasMention });
        } else {
            createComment({ text, hasMention });
        }

        if (onSubmit) {
            onSubmit();
        }

        this.setState({
            commentEditorState: getEditorState(false),
        });
    };

    onMentionSelectorChangeHandler = (nextEditorState: any): void =>
        this.setState({ commentEditorState: nextEditorState });

    /**
     * Formats the comment editor's text such that it will be accepted by the server.
     *
     * @returns {Object}
     */
    getFormattedCommentText = (): { hasMention: boolean, text: string } => {
        const { commentEditorState } = this.state;

        return getFormattedCommentText(commentEditorState);
    };

    render(): React.Node {
        const {
            className,
            getMentionWithQuery,
            intl: { formatMessage },
            isDisabled,
            isOpen,
            mentionSelectorContacts = [],
            contactsLoaded,
            onCancel,
            onFocus,
            user,
            isEditing,
            tagged_message,
            getAvatarUrl,
            showTip = true,
            placeholder = formatMessage(messages.commentWrite),
        } = this.props;
        const { commentEditorState } = this.state;
        const inputContainerClassNames = classNames('bcs-CommentForm', className, {
            'bcs-is-open': isOpen,
        });

        return (
            <Media className={inputContainerClassNames}>
                {!isEditing && !!user && (
                    <Media.Figure className="bcs-CommentForm-avatar">
                        <Avatar getAvatarUrl={getAvatarUrl} user={user} />
                    </Media.Figure>
                )}

                <Media.Body className="bcs-CommentForm-body" data-testid="bcs-CommentForm-body">
                    <Form onValidSubmit={this.onFormValidSubmitHandler}>
                        <DraftJSMentionSelector
                            className="bcs-CommentForm-input"
                            contacts={isOpen ? mentionSelectorContacts : []}
                            contactsLoaded={contactsLoaded}
                            editorState={commentEditorState}
                            hideLabel
                            isDisabled={isDisabled}
                            isRequired={isOpen}
                            name="commentText"
                            label={formatMessage(messages.commentLabel)}
                            description={formatMessage(messages.atMentionTipDescription)}
                            onChange={this.onMentionSelectorChangeHandler}
                            onFocus={onFocus}
                            onMention={getMentionWithQuery}
                            placeholder={tagged_message ? undefined : placeholder}
                            validateOnBlur={false}
                        />
                        {showTip && (
                            <div className="bcs-CommentForm-tip">
                                <FormattedMessage {...messages.atMentionTip} />
                            </div>
                        )}

                        {isOpen && <CommentFormControls onCancel={onCancel} />}
                    </Form>
                </Media.Body>
            </Media>
        );
    }
}

// For testing only
export { CommentForm as CommentFormUnwrapped };
export default injectIntl(CommentForm);
