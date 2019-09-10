/**
 * @flow
 * @file Component for Approval comment form
 */

import * as React from 'react';
import noop from 'lodash/noop';
import classNames from 'classnames';
import { FormattedMessage, injectIntl } from 'react-intl';
import Avatar from '../Avatar';
import CommentFormControls from './CommentFormControls';
import DraftJSMentionSelector, {
    createMentionSelectorState,
} from '../../../../components/form-elements/draft-js-mention-selector';
import Form from '../../../../components/form-elements/form/Form';
import Media from '../../../../components/media';
import messages from './messages';

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
    mentionSelectorContacts?: SelectorItems,
    onCancel: Function,
    onFocus: Function,
    onSubmit: Function,
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

        const contentState = commentEditorState.getCurrentContent();
        const blockMap = contentState.getBlockMap();

        const resultStringArr = [];

        // The API needs to explicitly know if a message contains a mention.
        let hasMention = false;

        // For all ContentBlocks in the ContentState:
        blockMap.forEach(block => {
            const text = block.getText();
            const blockMapStringArr = [];

            // Break down the ContentBlock into ranges
            block.findEntityRanges(
                () => true,
                (start, end) => {
                    const entityKey = block.getEntityAt(start);
                    // If the range is an Entity, format its text eg "@[1:Username]"
                    // Otherwise append its text to the block result as-is
                    if (entityKey) {
                        const entity = contentState.getEntity(entityKey);
                        const stringToAdd = `@[${entity.getData().id}:${text.substring(start + 1, end)}]`;
                        blockMapStringArr.push(stringToAdd);
                        hasMention = true;
                    } else {
                        blockMapStringArr.push(text.substring(start, end));
                    }
                },
            );
            resultStringArr.push(blockMapStringArr.join(''));
        });

        // Concatenate the array of block strings with newlines
        // (Each block represents a paragraph)
        return { text: resultStringArr.join('\n'), hasMention };
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
                            label="Comment"
                            onChange={this.onMentionSelectorChangeHandler}
                            onFocus={onFocus}
                            onMention={getMentionWithQuery}
                            placeholder={tagged_message ? undefined : formatMessage(messages.commentWrite)}
                            validateOnBlur={false}
                        />
                        <aside className="bcs-CommentForm-tip">
                            <FormattedMessage {...messages.atMentionTip} />
                        </aside>

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
