/**
 * @flow
 * @file Component for Approval comment form
 */

import * as React from 'react';
import noop from 'lodash/noop';
import classNames from 'classnames';
import { FormattedMessage, injectIntl } from 'react-intl';
import type { InjectIntlProvidedProps } from 'react-intl';
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
    createComment?: Function,
    entityId?: string,
    getAvatarUrl: GetAvatarUrlCallback,
    getMentionWithQuery?: Function,
    isDisabled?: boolean,
    isEditing?: boolean,
    isOpen: boolean,
    mentionSelectorContacts?: SelectorItems<>,
    onCancel: Function,
    onFocus: Function,
    onSubmit?: Function,
    showTip?: boolean,
    tagged_message?: string,
    updateComment?: Function,
    user: User,
} & InjectIntlProvidedProps;

type State = {
    commentEditorState: any,
};

class CommentForm extends React.Component<Props, State> {
    static defaultProps = {
        isOpen: false,
    };

    state = {
        commentEditorState: createMentionSelectorState(this.props.tagged_message),
    };

    componentDidUpdate({ isOpen: prevIsOpen }: Props): void {
        const { isOpen } = this.props;

        if (isOpen !== prevIsOpen && !isOpen) {
            this.setState({
                commentEditorState: createMentionSelectorState(),
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
            commentEditorState: createMentionSelectorState(),
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
            onCancel,
            onFocus,
            user,
            isEditing,
            tagged_message,
            getAvatarUrl,
            showTip = true,
        } = this.props;
        const { commentEditorState } = this.state;
        const inputContainerClassNames = classNames('bcs-CommentForm', className, {
            'bcs-is-open': isOpen,
        });

        return (
            <Media className={inputContainerClassNames}>
                {!isEditing && (
                    <Media.Figure className="bcs-CommentForm-avatar">
                        <Avatar getAvatarUrl={getAvatarUrl} user={user} />
                    </Media.Figure>
                )}

                <Media.Body className="bcs-CommentForm-body" data-testid="bcs-CommentForm-body">
                    <Form onValidSubmit={this.onFormValidSubmitHandler}>
                        <DraftJSMentionSelector
                            className="bcs-CommentForm-input"
                            contacts={isOpen ? mentionSelectorContacts : []}
                            editorState={commentEditorState}
                            hideLabel
                            isDisabled={isDisabled}
                            isRequired={isOpen}
                            name="commentText"
                            label={formatMessage(messages.commentLabel)}
                            onChange={this.onMentionSelectorChangeHandler}
                            onFocus={onFocus}
                            onMention={getMentionWithQuery}
                            placeholder={tagged_message ? undefined : formatMessage(messages.commentWrite)}
                            validateOnBlur={false}
                        />
                        {showTip && (
                            <aside className="bcs-CommentForm-tip">
                                <FormattedMessage {...messages.atMentionTip} />
                            </aside>
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
