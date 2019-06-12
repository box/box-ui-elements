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
import InlineError from '../../../../components/inline-error/InlineError';
import { TASK_EDIT_MODE_CREATE } from '../../../../constants';

import messages from '../../../common/messages';
import { ACTIVITY_TARGETS, INTERACTION_TARGET } from '../../../common/interactionTargets';

import './TaskForm.scss';

type TaskFormProps = {|
    error?: any,
    isDisabled?: boolean,
    onCancel: () => any,
    onCreateError: (e: ElementsXhrError) => any,
    onCreateSuccess: () => any,
    taskType: TaskType,
|};

type TaskFormFieldProps = {|
    approverSelectorContacts: SelectorItems,
    dueDate?: ?string,
    message: string,
|};

type TaskFormConsumerProps = {|
    ...TaskFormFieldProps,
    className?: string,
    createTask: (
        text: string,
        approvers: SelectorItems,
        taskType: TaskType,
        dueDate: ?string,
        onSuccess: ?Function,
        onError: ?Function,
    ) => any,
    editMode?: TaskEditMode,
    getApproverWithQuery?: Function,
    getAvatarUrl: GetAvatarUrlCallback,
|};

type Props = TaskFormProps & TaskFormConsumerProps & InjectIntlProvidedProps;

type TaskFormFieldName = 'taskName' | 'taskAssignees' | 'taskDueDate';

type State = {|
    approvers: SelectorItems,
    dueDate?: ?Date,
    formValidityState: { [key: TaskFormFieldName]: ?{ code: string, message: string } },
    isLoading: boolean,
    isValid: ?boolean,
    message: string,
|};

class TaskForm extends React.Component<Props, State> {
    static defaultProps = {
        approverSelectorContacts: [],
        editMode: TASK_EDIT_MODE_CREATE,
        message: '',
    };

    state = this.getInitialFormState();

    getInitialFormState() {
        const { dueDate, approverSelectorContacts, message } = this.props;
        return {
            approvers: approverSelectorContacts,
            dueDate: dueDate ? new Date(dueDate) : null,
            formValidityState: {},
            message,
            isLoading: false,
            isValid: null,
        };
    }

    validateForm = (only?: TaskFormFieldName) => {
        this.setState(state => {
            const { intl } = this.props;
            const { approvers, message } = state;
            const assigneeFieldError = {
                code: 'required',
                message: intl.formatMessage(commonMessages.invalidUserError),
            };
            const messageFieldError = {
                code: 'required',
                message: intl.formatMessage(commonMessages.requiredFieldError),
            };
            const formValidityState = {
                taskAssignees: approvers.length ? null : assigneeFieldError,
                taskName: message ? null : messageFieldError,
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

    handleInvalidSubmit = () => {
        this.validateForm();
    };

    handleCreateSuccess = () => {
        const { onCreateSuccess } = this.props;
        if (onCreateSuccess) {
            onCreateSuccess();
        }

        this.clearForm();
        this.setState({ isLoading: false });
    };

    handleCreateError = (e: ElementsXhrError) => {
        const { onCreateError } = this.props;
        onCreateError(e);
        this.setState({ isLoading: false });
    };

    handleValidSubmit = (): void => {
        const { createTask, taskType } = this.props;
        const { message, approvers, dueDate, isValid } = this.state;
        const dueDateString = dueDate && dueDate.toISOString();

        if (!isValid) return;

        this.setState({ isLoading: true });
        createTask(message, approvers, taskType, dueDateString, this.handleCreateSuccess, this.handleCreateError);
    };

    handleDueDateChange = (date: ?string): void => {
        let dateValue = null;
        if (date) {
            dateValue = new Date(date);
            // The date given to us is midnight of the date selected.
            // Modify date to be the end of day (minus 1 millisecond) for the given due date
            dateValue.setHours(23, 59, 59, 999);
        }

        this.setState({ dueDate: dateValue });
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
        const { approverSelectorContacts, className, error, isDisabled, intl, editMode } = this.props;
        const { dueDate, approvers, message, formValidityState, isLoading, isValid } = this.state;
        const inputContainerClassNames = classNames('bcs-task-input-container', 'bcs-task-input-is-open', className);
        const isCreateEditMode = editMode === TASK_EDIT_MODE_CREATE;

        // filter out selected approvers
        // map to datalist item format
        const approverOptions = approverSelectorContacts
            .filter(({ id }) => !approvers.find(({ value }) => value === id))
            .map(({ id, item }) => ({ ...item, text: item.name, value: id }));

        const pillSelectorOverlayClasses = classNames({
            scrollable: approverOptions.length > 4,
        });

        const submitButtonMessage = isCreateEditMode
            ? messages.tasksAddTaskFormSubmitLabel
            : messages.tasksEditTaskFormSubmitLabel;

        return (
            <div className={inputContainerClassNames}>
                <div className="bcs-task-input-form-container">
                    {error ? (
                        <InlineError title={<FormattedMessage {...messages.taskCreateErrorTitle} />}>
                            <FormattedMessage {...messages.taskCreateErrorMessage} />
                        </InlineError>
                    ) : null}
                    <Form
                        formValidityState={formValidityState}
                        onInvalidSubmit={this.handleInvalidSubmit}
                        onValidSubmit={this.handleValidSubmit}
                    >
                        <PillSelectorDropdown
                            className={pillSelectorOverlayClasses}
                            error={this.getErrorByFieldname('taskAssignees')}
                            disabled={isLoading || !isCreateEditMode}
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
                            disabled={isDisabled || isLoading || !isCreateEditMode}
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
                            isDisabled={isLoading || !isCreateEditMode}
                            isRequired={false}
                            isTextInputAllowed
                            label={<FormattedMessage {...messages.tasksAddTaskFormDueDateLabel} />}
                            minDate={new Date()}
                            name="taskDueDate"
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
                                isDisabled={isLoading}
                                type="button"
                            >
                                <FormattedMessage {...messages.tasksAddTaskFormCancelLabel} />
                            </Button>
                            <PrimaryButton
                                className="bcs-task-input-submit-btn"
                                data-resin-target={ACTIVITY_TARGETS.APPROVAL_FORM_POST}
                                data-testid="task-form-submit-button"
                                isDisabled={!isValid || isLoading || !isCreateEditMode}
                                isLoading={isLoading}
                            >
                                <FormattedMessage {...submitButtonMessage} />
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
export type { TaskFormConsumerProps as TaskFormProps };

export default injectIntl(TaskForm);
