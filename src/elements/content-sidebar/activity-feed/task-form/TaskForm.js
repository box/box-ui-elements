/**
 * @flow
 * @file Component for Approval comment form
 */

import * as React from 'react';
import noop from 'lodash/noop';
import classNames from 'classnames';
import { FormattedMessage, injectIntl } from 'react-intl';
import commonMessages from '../../../../common/messages';
import Form from '../../../../components/form-elements/form/Form';
import ContactDatalistItem from '../../../../components/contact-datalist-item/ContactDatalistItem';
import TextArea from '../../../../components/text-area';
import DatePicker from '../../../../components/date-picker/DatePicker';
import PillSelectorDropdown from '../../../../components/pill-selector-dropdown/PillSelectorDropdown';
import Button from '../../../../components/button/Button';
import PrimaryButton from '../../../../components/primary-button/PrimaryButton';

import messages from '../../../common/messages';
import { ACTIVITY_TARGETS, INTERACTION_TARGET } from '../../../common/interactionTargets';

import './TaskForm.scss';

type TaskFormProps = {|
    approverSelectorContacts: SelectorItems,
    className?: string,
    createTask: (text: string, approvers: SelectorItems, taskType: TaskType, dueDate: ?Date) => any,
    getApproverWithQuery?: Function,
    getAvatarUrl: GetAvatarUrlCallback,
    isDisabled?: boolean,
    onCancel: () => any,
    onSubmit: () => any,
    taskType: TaskType,
|};

type Props = TaskFormProps & InjectIntlProvidedProps;

type TaskFormFieldName = 'taskName' | 'taskAssignees' | 'taskDueDate';

type State = {|
    approvers: SelectorItems,
    dueDate: ?Date,
    formValidityState: { [key: TaskFormFieldName]: ?{ code: string, message: string } },
    isValid: ?boolean,
    message: string,
|};

class TaskForm extends React.Component<Props, State> {
    static defaultProps = {
        approverSelectorContacts: [],
    };

    state = this.getInitialFormState();

    getInitialFormState() {
        return {
            approvers: [],
            dueDate: null,
            formValidityState: {},
            message: '',
            isValid: null,
        };
    }

    validateForm = (only?: TaskFormFieldName) => {
        this.setState(state => {
            const { intl } = this.props;
            const { approvers, message } = state;
            const requiredFieldError = {
                code: 'required',
                message: intl.formatMessage(commonMessages.requiredFieldError),
            };
            const formValidityState = {
                taskAssignees: approvers.length ? null : requiredFieldError,
                taskName: message ? null : requiredFieldError,
                taskDueDate: null,
            };
            const isValid = Object.values(formValidityState).every(val => val == null);
            return {
                isValid,
                formValidityState: only
                    ? { ...state.formValidityState, [only]: formValidityState[only] }
                    : formValidityState,
            };
        });
    };

    getErrorByFieldname = (fieldName: TaskFormFieldName) => {
        const { formValidityState } = this.state;
        return formValidityState[fieldName] ? formValidityState[fieldName].message : null;
    };

    clearForm = () => this.setState(this.getInitialFormState());

    handleFocusChange = () => {
        this.validateForm();
    };

    handleInvalidSubmit = () => {
        this.validateForm();
    };

    handleValidSubmit = (): void => {
        const { createTask, onSubmit, taskType } = this.props;
        const { message, approvers, dueDate, isValid } = this.state;

        if (!isValid) return;

        createTask(message, approvers, taskType, dueDate);

        if (onSubmit) {
            // TODO: could this show server errors? <ApprovalCommentForm /> does not.
            onSubmit();
        }

        this.clearForm();
    };

    handleDueDateChange = (date: ?Date): void => {
        if (date) {
            // The date given to us is midnight of the date selected.
            // Modify date to be the end of day (minus 1 millisecond) for the given due date
            date.setHours(23, 59, 59, 999);
        }

        this.setState({ dueDate: date });
    };

    handleApproverSelectorInput = (value: any): void => {
        const { getApproverWithQuery = noop } = this.props;
        getApproverWithQuery(value);
    };

    handleApproverSelectorSelect = (pills: any): void => {
        this.setState({ approvers: this.state.approvers.concat(pills) });
        this.validateForm('taskAssignees');
    };

    handleApproverSelectorRemove = (option: any, index: number): void => {
        const approvers = [...this.state.approvers];
        approvers.splice(index, 1);
        this.setState({ approvers });
        this.validateForm('taskAssignees');
    };

    handleChangeMessage = (e: SyntheticInputEvent<HTMLTextAreaElement>) => {
        e.persist();
        this.setState({ message: e.currentTarget.value });
        this.validateForm('taskName');
    };

    handleCancelClick = () => {
        this.props.onCancel();
    };

    render() {
        const { approverSelectorContacts, className, isDisabled, intl } = this.props;
        const { dueDate, approvers, message, formValidityState, isValid } = this.state;
        const inputContainerClassNames = classNames('bcs-task-input-container', 'bcs-task-input-is-open', className);

        // filter out selected approvers
        // map to datalist item format
        const approverOptions = approverSelectorContacts
            .filter(({ id }) => !approvers.find(({ value }) => value === id))
            .map(({ id, item }) => ({ ...item, text: item.name, value: id }));

        return (
            <div className={inputContainerClassNames}>
                <div className="bcs-task-input-form-container">
                    <Form
                        formValidityState={formValidityState}
                        onInvalidSubmit={this.handleInvalidSubmit}
                        onValidSubmit={this.handleValidSubmit}
                    >
                        <PillSelectorDropdown
                            error={this.getErrorByFieldname('taskAssignees')}
                            inputProps={{ 'data-testid': 'task-form-assignee-input' }}
                            isRequired
                            label={<FormattedMessage {...messages.tasksAddTaskFormSelectAssigneesLabel} />}
                            name="taskAssignees"
                            onBlur={() => this.validateForm('taskAssignees')}
                            onInput={this.handleApproverSelectorInput}
                            onRemove={this.handleApproverSelectorRemove}
                            onSelect={this.handleApproverSelectorSelect}
                            placeholder={intl.formatMessage(messages.approvalAddAssignee)}
                            selectedOptions={approvers}
                            selectorOptions={approverOptions}
                            validateForError={() => this.validateForm('taskAssignees')}
                        >
                            {approverOptions.map(({ id, name, email }) => (
                                <ContactDatalistItem
                                    key={id}
                                    data-testid="task-assignee-option"
                                    name={name}
                                    subtitle={email}
                                />
                            ))}
                        </PillSelectorDropdown>
                        <TextArea
                            className="bcs-task-name-input"
                            data-testid="task-form-name-input"
                            disabled={isDisabled}
                            error={this.getErrorByFieldname('taskName')}
                            isRequired
                            label={<FormattedMessage {...messages.tasksAddTaskFormMessageLabel} />}
                            name="taskName"
                            onBlur={() => this.validateForm('taskName')}
                            onChange={this.handleChangeMessage}
                            placeholder={intl.formatMessage(messages.commentWrite)}
                            value={message}
                        />
                        <DatePicker
                            className="bcs-task-add-due-date-input"
                            error={this.getErrorByFieldname('taskDueDate')}
                            inputProps={{
                                [INTERACTION_TARGET]: ACTIVITY_TARGETS.TASK_DATE_PICKER,
                                'data-testid': 'task-form-date-input',
                            }}
                            isRequired={false}
                            label={<FormattedMessage {...messages.tasksAddTaskFormDueDateLabel} />}
                            minDate={new Date()}
                            name="taskDueDate"
                            onBlur={() => this.validateForm('taskDueDate')}
                            onChange={this.handleDueDateChange}
                            placeholder={intl.formatMessage(messages.approvalSelectDate)}
                            value={dueDate || undefined}
                        />
                        <div className="bcs-task-input-controls">
                            <Button
                                className="bcs-task-input-cancel-btn"
                                data-resin-target={ACTIVITY_TARGETS.APPROVAL_FORM_CANCEL}
                                data-testid="task-form-cancel-button"
                                onClick={this.handleCancelClick}
                                type="button"
                            >
                                <FormattedMessage {...messages.tasksAddTaskFormCancelLabel} />
                            </Button>
                            <PrimaryButton
                                className="bcs-task-input-submit-btn"
                                data-resin-target={ACTIVITY_TARGETS.APPROVAL_FORM_POST}
                                data-testid="task-form-submit-button"
                                isDisabled={!isValid}
                                onFocus={this.handleFocusChange}
                                onMouseEnter={this.handleFocusChange}
                            >
                                <FormattedMessage {...messages.tasksAddTaskFormSubmitLabel} />
                            </PrimaryButton>
                        </div>
                    </Form>
                </div>
            </div>
        );
    }
}

// For testing only
export { TaskForm as TaskFormUnwrapped };

export default injectIntl(TaskForm);
