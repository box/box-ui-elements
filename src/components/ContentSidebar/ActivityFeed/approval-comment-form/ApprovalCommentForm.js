import PropTypes from 'prop-types';
import React, { Component } from 'react';
import cx from 'classnames';
import { EditorState } from 'draft-js';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';

import Avatar from '../../../components/avatar';
import Button from '../../../components/button';
import Checkbox from '../../../components/checkbox';
import ContactDatalistItem from '../../../components/contact-datalist-item';
import DatePicker from '../../../components/date-picker';
import PrimaryButton from '../../../components/primary-button';

import Form from '../../../components/form-elements/form';
import DraftJSMentionSelector, {
    DraftMentionDecorator
} from '../../../components/form-elements/draft-js-mention-selector';
import PillSelectorDropdown from '../../../components/pill-selector-dropdown';

import { OptionsPropType, SelectorItemsPropType, UserPropType } from '../../../common/box-proptypes';
import commonMessages from '../../../common/messages';

import messages from '../messages';

import './ApprovalCommentForm.scss';

const CommentInputControls = ({ onCancel }) => (
    <div className='comment-input-controls'>
        <Button className='comment-input-cancel-btn' onClick={onCancel} type='button'>
            <FormattedMessage {...messages.commentCancel} />
        </Button>
        <PrimaryButton className='comment-input-submit-btn'>
            <FormattedMessage {...messages.commentPost} />
        </PrimaryButton>
    </div>
);

CommentInputControls.propTypes = {
    onCancel: PropTypes.func
};

const AddApprovalFields = ({
    approvalDate,
    approvers,
    approverSelectorContacts = [],
    approverSelectorError,
    formatMessage,
    onApprovalDateChange,
    onApproverSelectorInput,
    onApproverSelectorRemove,
    onApproverSelectorSelect
}) => {
    const approverOptions = approverSelectorContacts
        // filter selected approvers
        .filter(({ id }) => !approvers.find(({ value }) => value === id))
        // map to datalist item format
        .map(({ id, item }) => ({
            email: item.email,
            text: item.name,
            value: id
        }));

    return (
        <div className='comment-add-approver-fields-container'>
            <PillSelectorDropdown
                error={approverSelectorError}
                label={<FormattedMessage {...messages.approvalAssignees} />}
                onInput={onApproverSelectorInput}
                onRemove={onApproverSelectorRemove}
                onSelect={onApproverSelectorSelect}
                placeholder={formatMessage(messages.approvalAddAssignee)}
                selectedOptions={approvers}
                selectorOptions={approverOptions}
            >
                {approverOptions.map(({ email, text, value }) => (
                    <ContactDatalistItem key={value} name={text} subtitle={email} />
                ))}
            </PillSelectorDropdown>
            <DatePicker
                className='comment-add-approver-date-input'
                label={<FormattedMessage {...messages.approvalDueDate} />}
                minDate={new Date()}
                name='approverDateInput'
                placeholder={formatMessage(messages.approvalSelectDate)}
                onChange={onApprovalDateChange}
                value={approvalDate}
            />
        </div>
    );
};

AddApprovalFields.propTypes = {
    approvalDate: PropTypes.instanceOf(Date),
    approvers: OptionsPropType,
    approverSelectorContacts: SelectorItemsPropType,
    approverSelectorError: PropTypes.string,
    formatMessage: PropTypes.func.isRequired,
    onApprovalDateChange: PropTypes.func,
    onApproverSelectorInput: PropTypes.func.isRequired,
    onApproverSelectorRemove: PropTypes.func.isRequired,
    onApproverSelectorSelect: PropTypes.func.isRequired
};

const AddApproval = ({
    approvalDate,
    approvers,
    approverSelectorContacts,
    approverSelectorError,
    formatMessage,
    isAddApprovalVisible,
    onApprovalDateChange,
    onApproverSelectorInput,
    onApproverSelectorRemove,
    onApproverSelectorSelect
}) => (
    <div className='comment-add-approver'>
        <Checkbox
            className='box-ui-comment-add-approver-checkbox'
            label={formatMessage(messages.approvalAddTask)}
            name='addApproval'
            isChecked={isAddApprovalVisible}
            tooltip={formatMessage(messages.approvalAddTaskTooltip)}
        />
        {isAddApprovalVisible ? (
            <AddApprovalFields
                approvalDate={approvalDate}
                approvers={approvers}
                approverSelectorContacts={approverSelectorContacts}
                approverSelectorError={approverSelectorError}
                formatMessage={formatMessage}
                onApproverSelectorInput={onApproverSelectorInput}
                onApproverSelectorRemove={onApproverSelectorRemove}
                onApproverSelectorSelect={onApproverSelectorSelect}
                onApprovalDateChange={onApprovalDateChange}
            />
        ) : null}
    </div>
);

AddApproval.propTypes = {
    approvalDate: PropTypes.instanceOf(Date),
    approvers: OptionsPropType,
    approverSelectorContacts: SelectorItemsPropType,
    approverSelectorError: PropTypes.string,
    formatMessage: PropTypes.func,
    isAddApprovalVisible: PropTypes.bool,
    onApprovalDateChange: PropTypes.func,
    onApproverSelectorInput: PropTypes.func,
    onApproverSelectorRemove: PropTypes.func,
    onApproverSelectorSelect: PropTypes.func
};

class ApprovalCommentForm extends Component {
    static propTypes = {
        approverSelectorContacts: SelectorItemsPropType,
        className: PropTypes.string,
        createComment: PropTypes.func,
        createTask: PropTypes.func,
        updateTask: PropTypes.func,
        getApproverContactsWithQuery: PropTypes.func,
        getMentionContactsWithQuery: PropTypes.func,
        intl: intlShape.isRequired,
        isDisabled: PropTypes.bool,
        isOpen: PropTypes.bool,
        mentionSelectorContacts: SelectorItemsPropType,
        onCancel: PropTypes.func,
        onFocus: PropTypes.func,
        onSubmit: PropTypes.func,
        user: UserPropType.isRequired,
        isEditing: PropTypes.bool,
        entityId: PropTypes.string,
        taggedMessage: PropTypes.string
    };

    static defaultProps = {
        isOpen: false
    };

    constructor(props) {
        super(props);

        this.state = {
            approvalDate: null,
            approvers: [],
            approverSelectorError: '',
            commentEditorState: EditorState.createEmpty(DraftMentionDecorator),
            isAddApprovalVisible: false
        };
    }

    componentWillReceiveProps(nextProps) {
        const { isOpen } = nextProps;

        if (isOpen !== this.props.isOpen && !isOpen) {
            this.setState({
                commentEditorState: EditorState.createEmpty(DraftMentionDecorator),
                isAddApprovalVisible: false
            });
        }
    }

    onFormChangeHandler = (formData) => this.setState({ isAddApprovalVisible: formData.addApproval === 'on' });

    onFormValidSubmitHandler = (formData) => {
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

    onMentionSelectorChangeHandler = (nextEditorState) => this.setState({ commentEditorState: nextEditorState });

    onApprovalDateChangeHandler = (date) => this.setState({ approvalDate: date });

    /**
     * Formats the comment editor's text such that it will be accepted by the server.
     *
     * @returns {string}
     */
    getFormattedCommentText = () => {
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

    handleApproverSelectorInput = (value) => {
        this.props.getApproverContactsWithQuery(value);
        this.setState({ approverSelectorError: '' });
    };

    handleApproverSelectorSelect = (pills) => {
        this.setState({ approvers: this.state.approvers.concat(pills) });
    };

    handleApproverSelectorRemove = (option, index) => {
        const approvers = this.state.approvers.slice();
        approvers.splice(index, 1);
        this.setState({ approvers });
    };

    render() {
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
        const classNames = cx('comment-input-container', className, {
            'comment-input-is-open': isOpen
        });

        return (
            <div className={classNames}>
                {!isEditing && (
                    <div className='avatar-container'>
                        <Avatar id={id} avatarUrl={avatarUrl} name={name} />
                    </div>
                )}
                <div className='comment-input-form-container'>
                    <Form onChange={this.onFormChangeHandler} onValidSubmit={this.onFormValidSubmitHandler}>
                        <DraftJSMentionSelector
                            className='comment-input'
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
                            className={cx('at-mention-tip', {
                                'accessibility-hidden': isOpen
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
