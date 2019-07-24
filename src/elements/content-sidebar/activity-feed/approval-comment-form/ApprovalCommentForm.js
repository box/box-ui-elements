/**
 * @flow
 * @file Component for Approval comment form
 */

import * as React from 'react';
import noop from 'lodash/noop';
import classNames from 'classnames';
import { ContentState, EditorState } from 'draft-js';
import { FormattedMessage, injectIntl } from 'react-intl';
import messages from './messages';
import Form from '../../../../components/form-elements/form/Form';
import DraftJSMentionSelector, {
    DraftMentionDecorator,
} from '../../../../components/form-elements/draft-js-mention-selector';
import CommentInputControls from './CommentInputControls';
import Avatar from '../Avatar';

import './ApprovalCommentForm.scss';

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
    user: User,
} & InjectIntlProvidedProps;

type State = {
    commentEditorState: any,
};

class ApprovalCommentForm extends React.Component<Props, State> {
    static defaultProps = {
        isOpen: false,
    };

    state = {
        commentEditorState: EditorState.createWithContent(
            ContentState.createFromText(this.props.tagged_message || ''),
            DraftMentionDecorator,
        ),
    };

    componentWillReceiveProps(nextProps: Props): void {
        const { isOpen } = nextProps;

        if (isOpen !== this.props.isOpen && !isOpen) {
            this.setState({
                commentEditorState: EditorState.createEmpty(DraftMentionDecorator),
            });
        }
    }

    onFormValidSubmitHandler = (): void => {
        const { createComment = noop, onSubmit } = this.props;

        const { text, hasMention } = this.getFormattedCommentText();
        if (!text) {
            return;
        }

        createComment({ text, hasMention });

        if (onSubmit) {
            onSubmit();
        }

        this.setState({
            commentEditorState: EditorState.createEmpty(DraftMentionDecorator),
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
        const inputContainerClassNames = classNames('bcs-comment-input-container', className, {
            'bcs-comment-input-is-open': isOpen,
        });

        return (
            <div className={inputContainerClassNames}>
                {!isEditing && (
                    <div className="bcs-avatar-container">
                        <Avatar getAvatarUrl={getAvatarUrl} user={user} />
                    </div>
                )}
                <div className="bcs-comment-input-form-container" data-testid="bcs-comment-input-form-container">
                    <Form onValidSubmit={this.onFormValidSubmitHandler}>
                        <DraftJSMentionSelector
                            className="bcs-comment-input"
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
                        <aside
                            className={classNames('bcs-at-mention-tip', {
                                'accessibility-hidden': isOpen,
                            })}
                        >
                            <FormattedMessage {...messages.atMentionTip} />
                        </aside>
                        <CommentInputControls onCancel={onCancel} />
                    </Form>
                </div>
            </div>
        );
    }
}

// For testing only
export { ApprovalCommentForm as ApprovalCommentFormUnwrapped };

export default injectIntl(ApprovalCommentForm);
