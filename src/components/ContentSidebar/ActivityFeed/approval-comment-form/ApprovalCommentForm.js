/**
 * @flow
 * @file Component for Approval comment form
 */

import * as React from 'react';
import classNames from 'classnames';
import { EditorState } from 'draft-js';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';

import Avatar from 'box-react-ui/lib/components/avatar/Avatar';
import Form from 'box-react-ui/lib/components/form-elements/form/Form';
import DraftJSMentionSelector, {
    DraftMentionDecorator
} from 'box-react-ui/lib/components/form-elements/draft-js-mention-selector';
import commonMessages from 'box-react-ui/lib/common/messages';

import AddApproval from './AddApproval';
import CommentInputControls from './CommentInputControls';
import messages from '../../../messages';
import type { SelectorItems, User } from '../../../../flowTypes';

import './ApprovalCommentForm.scss';

type Props = {
    approverSelectorContacts: SelectorItems,
    className: string,
    createComment: Function,
    createTask: Function,
    updateTask: Function,
    getApproverContactsWithQuery: Function,
    getMentionContactsWithQuery: Function,
    intl: intlShape.isRequired,
    isDisabled: boolean,
    isOpen: boolean,
    mentionSelectorContacts: SelectorItems,
    onCancel: Function,
    onFocus: Function,
    onSubmit: Function,
    user: User,
    isEditing: boolean,
    entityId: string,
    taggedMessage: string
};

type State = {
    approvalDate: ?number,
    approvers: SelectorItems,
    approverSelectorError: string,
    commentEditorState: any,
    isAddApprovalVisible: boolean
};

class ApprovalCommentForm extends React.Component<Props, State> {
    static defaultProps = {
        isOpen: false
    };

    state = {
        approvalDate: null,
        approvers: [],
        approverSelectorError: '',
        commentEditorState: EditorState.createEmpty(DraftMentionDecorator),
        isAddApprovalVisible: false
    };

    componentWillReceiveProps(nextProps: Props): void {
        const { isOpen } = nextProps;

        if (isOpen !== this.props.isOpen && !isOpen) {
            this.setState({
                commentEditorState: EditorState.createEmpty(DraftMentionDecorator),
                isAddApprovalVisible: false
            });
        }
    }

    onFormChangeHandler = (formData: any): void =>
        this.setState({ isAddApprovalVisible: formData.addApproval === 'on' });

    onFormValidSubmitHandler = (formData: any): void => {
        const { createComment, createTask, intl, updateTask, onSubmit, entityId } = this.props;

        const commentText = this.getFormattedCommentText();
        if (!commentText) {
            return;
        }

        if (formData.addApproval === 'on') {
            const { approvers } = this.state;
            if (approvers.length === 0) {
                this.setState({
                    approverSelectorError: intl.formatMessage(commonMessages.requiredFieldError)
                });
                return;
            }
            createTask({
                text: commentText,
                approvers: approvers.map(({ value }) => value),
                dueDate: formData.approverDateInput
            });
        } else if (entityId) {
            updateTask({ text: commentText, id: entityId });
        } else {
            createComment({ text: commentText });
        }

        if (onSubmit) {
            onSubmit();
        }

        this.setState({
            commentEditorState: EditorState.createEmpty(DraftMentionDecorator),
            isAddApprovalVisible: false,
            approvalDate: null,
            approvers: []
        });
    };

    onMentionSelectorChangeHandler = (nextEditorState: any): void =>
        this.setState({ commentEditorState: nextEditorState });

    onApprovalDateChangeHandler = (date: number): void => this.setState({ approvalDate: date });

    /**
     * Formats the comment editor's text such that it will be accepted by the server.
     *
     * @returns {string}
     */
    getFormattedCommentText = (): string => {
        const { commentEditorState } = this.state;

        const contentState = commentEditorState.getCurrentContent();
        const blockMap = contentState.getBlockMap();

        const resultStringArr = [];

        // For all ContentBlocks in the ContentState:
        blockMap.forEach((block) => {
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
                    } else {
                        blockMapStringArr.push(text.substring(start, end));
                    }
                }
            );
            resultStringArr.push(blockMapStringArr.join(''));
        });

        // Concatentate the array of block strings with newlines
        // (Each block represents a paragraph)
        return resultStringArr.join('\n');
    };

    handleApproverSelectorInput = (value: any): void => {
        this.props.getApproverContactsWithQuery(value);
        this.setState({ approverSelectorError: '' });
    };

    handleApproverSelectorSelect = (pills: any): void => {
        this.setState({ approvers: this.state.approvers.concat(pills) });
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
            getMentionContactsWithQuery,
            intl: { formatMessage },
            isDisabled,
            isOpen,
            mentionSelectorContacts = [],
            onCancel,
            onFocus,
            user,
            isEditing,
            taggedMessage
        } = this.props;
        const { approvalDate, approvers, approverSelectorError, commentEditorState, isAddApprovalVisible } = this.state;
        const { avatarUrl, id, name } = user;
        const inputContainerClassNames = classNames('bcs-comment-input-container', className, {
            'bcs-comment-input-is-open': isOpen
        });

        return (
            <div className={inputContainerClassNames}>
                {!isEditing && (
                    <div className='bcs-avatar-container'>
                        <Avatar id={id} avatarUrl={avatarUrl} name={name} />
                    </div>
                )}
                <div className='bcs-comment-input-form-container'>
                    <Form onChange={this.onFormChangeHandler} onValidSubmit={this.onFormValidSubmitHandler}>
                        <DraftJSMentionSelector
                            className='bcs-comment-input'
                            contacts={isOpen ? mentionSelectorContacts : []}
                            editorState={commentEditorState}
                            hideLabel
                            isDisabled={isDisabled}
                            isRequired={isOpen}
                            name='commentText'
                            label='Comment'
                            onChange={this.onMentionSelectorChangeHandler}
                            onFocus={onFocus}
                            onMention={getMentionContactsWithQuery}
                            placeholder={taggedMessage || formatMessage(messages.commentWrite)}
                            validateOnBlur={false}
                        />
                        <aside
                            className={classNames('bcs-at-mention-tip', {
                                'bcs-accessibility-hidden': isOpen
                            })}
                        >
                            <FormattedMessage {...messages.atMentionTip} />
                        </aside>
                        {createTask ? (
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
