/**
 * @flow
 * @file Component for Approval comment form
 */

import * as React from 'react';
import noop from 'lodash/noop';
import classNames from 'classnames';
import { ContentState, EditorState } from 'draft-js';
import { FormattedMessage, injectIntl } from 'react-intl';
import commonMessages from '../../../../common/messages';
import messages from './messages';
import Form from '../../../../components/form-elements/form/Form';
import DraftJSMentionSelector, {
    DraftMentionDecorator,
} from '../../../../components/form-elements/draft-js-mention-selector';
import { FeatureFlag } from '../../../common/feature-checking';
import AddApproval from './AddApproval';
import CommentInputControls from './CommentInputControls';
import Avatar from '../Avatar';

import './ApprovalCommentForm.scss';

type Props = {
    approverSelectorContacts?: SelectorItems,
    className: string,
    createComment?: Function,
    createTask?: Function,
    entityId?: string,
    getApproverWithQuery?: Function,
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
    updateTask?: Function,
    user: User,
} & InjectIntlProvidedProps;

type State = {
    approvalDate: ?Date,
    approverSelectorError: string,
    approvers: SelectorItems,
    commentEditorState: any,
    isAddApprovalVisible: boolean,
};

class ApprovalCommentForm extends React.Component<Props, State> {
    static defaultProps = {
        isOpen: false,
    };

    state = {
        approvalDate: null,
        approvers: [],
        approverSelectorError: '',
        commentEditorState: EditorState.createWithContent(
            ContentState.createFromText(this.props.tagged_message || ''),
            DraftMentionDecorator,
        ),
        isAddApprovalVisible: false,
    };

    componentWillReceiveProps(nextProps: Props): void {
        const { isOpen } = nextProps;

        if (isOpen !== this.props.isOpen && !isOpen) {
            this.setState({
                commentEditorState: EditorState.createEmpty(DraftMentionDecorator),
                isAddApprovalVisible: false,
            });
        }
    }

    onFormChangeHandler = (formData: any): void =>
        this.setState({ isAddApprovalVisible: formData.addApproval === 'on' });

    onFormValidSubmitHandler = (formData: any): void => {
        const { createComment = noop, createTask = noop, intl, updateTask = noop, onSubmit, entityId } = this.props;

        const { text, hasMention } = this.getFormattedCommentText();
        if (!text) {
            return;
        }

        if (formData.addApproval === 'on') {
            const { approvers, approvalDate } = this.state;
            if (approvers.length === 0) {
                this.setState({
                    approverSelectorError: intl.formatMessage(commonMessages.requiredFieldError),
                });
                return;
            }

            createTask({
                text,
                assignees: approvers,
                dueAt: approvalDate,
            });
        } else if (entityId) {
            updateTask({ text, id: entityId });
        } else {
            createComment({ text, hasMention });
        }

        if (onSubmit) {
            onSubmit();
        }

        this.setState({
            commentEditorState: EditorState.createEmpty(DraftMentionDecorator),
            isAddApprovalVisible: false,
            approvalDate: null,
            approvers: [],
        });
    };

    onMentionSelectorChangeHandler = (nextEditorState: any): void =>
        this.setState({ commentEditorState: nextEditorState });

    onApprovalDateChangeHandler = (date: ?Date): void => {
        if (date) {
            // The date given to us is midnight of the date selected.
            // Modify date to be the end of day (minus 1 millisecond) for the given due date
            date.setHours(23, 59, 59, 999);
        }

        this.setState({ approvalDate: date });
    };

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

    handleApproverSelectorInput = (value: any): void => {
        const { getApproverWithQuery = noop } = this.props;
        getApproverWithQuery(value);
        this.setState({ approverSelectorError: '' });
    };

    scrollApproverSelector = () => {
        const input = document.querySelector('.bcs-comment-add-approver-fields-container .pill-selector-input-wrapper');

        if (input) {
            input.scrollTop = input.scrollHeight;
        }
    };

    handleApproverSelectorSelect = (pills: any): void => {
        this.setState({ approvers: this.state.approvers.concat(pills) }, this.scrollApproverSelector);
    };

    handleApproverSelectorRemove = (option: any, index: number): void => {
        const approvers = this.state.approvers.slice();
        approvers.splice(index, 1);
        this.setState({ approvers });
    };

    render(): React.Node {
        const {
            approverSelectorContacts,
            className,
            createTask,
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
        const { approvalDate, approvers, approverSelectorError, commentEditorState, isAddApprovalVisible } = this.state;
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
                <div className="bcs-comment-input-form-container">
                    <Form onChange={this.onFormChangeHandler} onValidSubmit={this.onFormValidSubmitHandler}>
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
                        {createTask ? (
                            <FeatureFlag feature="activityFeed.tasks.createFromComment">
                                <AddApproval
                                    approvalDate={approvalDate}
                                    approvers={approvers}
                                    approverSelectorContacts={approverSelectorContacts}
                                    approverSelectorError={approverSelectorError}
                                    formatMessage={formatMessage}
                                    isAddApprovalVisible={isAddApprovalVisible}
                                    onApprovalDateChange={this.onApprovalDateChangeHandler}
                                    onApproverSelectorInput={this.handleApproverSelectorInput}
                                    onApproverSelectorRemove={this.handleApproverSelectorRemove}
                                    onApproverSelectorSelect={this.handleApproverSelectorSelect}
                                />
                            </FeatureFlag>
                        ) : null}
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
