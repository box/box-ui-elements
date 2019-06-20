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
import { TASK_EDIT_MODE_CREATE, TASK_EDIT_MODE_EDIT } from '../../../../constants';
import messages from '../../../common/messages';
import { ACTIVITY_TARGETS, INTERACTION_TARGET } from '../../../common/interactionTargets';
import type { TaskCollabAssignee, TaskType, TaskEditMode, TaskUpdatePayload } from '../../../../common/types/tasks';

import './TaskForm.scss';

type TaskFormProps = {|
    error?: any,
    isDisabled?: boolean,
    onCancel: () => any,
    onSubmitError: (e: ElementsXhrError) => any,
    onSubmitSuccess: () => any,
    taskType: TaskType,
|};

type TaskFormFieldProps = {|
    approvers: Array<TaskCollabAssignee>,
    dueDate?: ?string,
    id: string,
    message: string,
|};

type TaskFormConsumerProps = {|
    ...TaskFormFieldProps,
    approverSelectorContacts: SelectorItems,
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
    editTask?: (task: TaskUpdatePayload, onSuccess: ?Function, onError: ?Function) => any,
    getApproverWithQuery?: Function,
    getAvatarUrl: GetAvatarUrlCallback,
|};

type Props = TaskFormProps & TaskFormConsumerProps & InjectIntlProvidedProps;

type TaskFormFieldName = 'taskName' | 'taskAssignees' | 'taskDueDate';

type State = {|
    approvers: Array<TaskCollabAssignee>,
    dueDate?: ?Date,
    formValidityState: { [key: TaskFormFieldName]: ?{ code: string, message: string } },
    id: string,
    isLoading: boolean,
    isValid: ?boolean,
    message: string,
|};

function convertAssigneesToSelectorItems(approvers: Array<TaskCollabAssignee>): SelectorItems {
    return approvers.map(({ target }) => {
        const newSelectorItem: SelectorItem = {
            ...target,
            item: {},
            value: target.id,
            text: target.name,
        };

        return newSelectorItem;
    });
}

class TaskForm extends React.Component<Props, State> {
    static defaultProps = {
        approvers: [],
        approverSelectorContacts: [],
        editMode: TASK_EDIT_MODE_CREATE,
        id: '',
        message: '',
    };

    state = this.getInitialFormState();

    getInitialFormState() {
        const { dueDate, id, message, approvers } = this.props;
        return {
            id,
            approvers,
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

    handleSubmitSuccess = () => {
        const { onSubmitSuccess } = this.props;
        if (onSubmitSuccess) {
            onSubmitSuccess();
        }

        this.clearForm();
        this.setState({ isLoading: false });
    };

    handleSubmitError = (e: ElementsXhrError) => {
        const { onSubmitError } = this.props;
        onSubmitError(e);
        this.setState({ isLoading: false });
    };

    handleValidSubmit = (): void => {
        const { id, createTask, approvers, editTask, editMode, taskType } = this.props;
        const { message, approvers: currentApprovers, dueDate, isValid } = this.state;
        const dueDateString = dueDate && dueDate.toISOString();

        if (!isValid) return;

        this.setState({ isLoading: true });

        if (editMode === TASK_EDIT_MODE_EDIT && editTask) {
            // Added assignees are the ones in state that weren't in the prop
            // Assignees to remove are the ones in the prop that cannot be found in state
            const approverIds = approvers.map(approver => approver.id);
            const currentApproverIds = currentApprovers.map(currentApprover => currentApprover.id);

            editTask(
                {
                    id,
                    description: message,
                    due_at: dueDateString,
                    addedAssignees: convertAssigneesToSelectorItems(
                        currentApprovers.filter(currentApprover => approverIds.indexOf(currentApprover.id) === -1),
                    ),
                    removedAssignees: approvers.filter(approver => currentApproverIds.indexOf(approver.id) === -1),
                },
                this.handleSubmitSuccess,
                this.handleSubmitError,
            );
        } else {
            createTask(
                message,
                convertAssigneesToSelectorItems(currentApprovers),
                taskType,
                dueDateString,
                this.handleSubmitSuccess,
                this.handleSubmitError,
            );
        }
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
        this.validateForm('taskDueDate');
    };

    handleApproverSelectorInput = (value: any): void => {
        const { getApproverWithQuery = noop } = this.props;
        getApproverWithQuery(value);
    };

    handleApproverSelectorSelect = (pills: Array<any>): void => {
        this.setState({
            approvers: this.state.approvers.concat(
                pills.map(pill => {
                    return {
                        id: '',
                        target: {
                            id: pill.id,
                            name: pill.text,
                            type: 'user',
                        },
                        role: 'ASSIGNEE',
                        type: 'task_collaborator',
                        status: 'NOT_STARTED',
                        permissions: { can_delete: false, can_update: false },
                    };
                }),
            ),
        });

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
        const renderApprovers = convertAssigneesToSelectorItems(approvers);

        // filter out selected approvers
        // map to datalist item format
        const approverOptions = approverSelectorContacts
            .filter(({ id }) => !renderApprovers.find(({ value }) => value === id))
            .map(({ id, item }) => ({ ...item, text: item.name, value: id }));

        const pillSelectorOverlayClasses = classNames({
            scrollable: approverOptions.length > 4,
        });

        const submitButtonMessage = isCreateEditMode
            ? messages.tasksAddTaskFormSubmitLabel
            : messages.tasksEditTaskFormSubmitLabel;

        const taskErrorMessage = isCreateEditMode ? messages.taskCreateErrorMessage : messages.taskUpdateErrorMessage;

        return (
            <div className={inputContainerClassNames} data-resin-component="taskform">
                <div className="bcs-task-input-form-container">
                    {error ? (
                        <InlineError title={<FormattedMessage {...messages.taskCreateErrorTitle} />}>
                            <FormattedMessage {...taskErrorMessage} />
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
                            disabled={isLoading}
                            inputProps={{ 'data-testid': 'task-form-assignee-input' }}
                            isRequired
                            label={<FormattedMessage {...messages.tasksAddTaskFormSelectAssigneesLabel} />}
                            name="taskAssignees"
                            onBlur={() => this.validateForm('taskAssignees')}
                            onInput={this.handleApproverSelectorInput}
                            onRemove={this.handleApproverSelectorRemove}
                            onSelect={this.handleApproverSelectorSelect}
                            placeholder={intl.formatMessage(messages.approvalAddAssignee)}
                            selectedOptions={renderApprovers}
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
                            disabled={isDisabled || isLoading}
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
                            isDisabled={isLoading}
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
                                isDisabled={!isValid || isLoading}
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
