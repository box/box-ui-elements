import * as React from 'react';
import noop from 'lodash/noop';
import getProp from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import classNames from 'classnames';
import { FormattedMessage, injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';
import commonMessages from '../../../../common/messages';
import messages from './messages';
import commentFormMessages from '../comment-form/messages';
import Form from '../../../../components/form-elements/form/Form';
import ModalActions from '../../../../components/modal/ModalActions';
import ContactDatalistItem from '../../../../components/contact-datalist-item/ContactDatalistItem';
import TextArea from '../../../../components/text-area';
import DatePicker from '../../../../components/date-picker/DatePicker';
import Checkbox from '../../../../components/checkbox';
import PillSelectorDropdown from '../../../../components/pill-selector-dropdown/PillSelectorDropdown';
import Button from '../../../../components/button/Button';
import { FeatureFlag } from '../../../common/feature-checking';
import PrimaryButton from '../../../../components/primary-button/PrimaryButton';
import { ButtonType } from '../../../../components/button';
import { TooltipPosition } from '../../../../components/tooltip';
import {
    TASK_COMPLETION_RULE_ANY,
    TASK_COMPLETION_RULE_ALL,
    TASK_EDIT_MODE_CREATE,
    TASK_EDIT_MODE_EDIT,
} from '../../../../constants';
import { ACTIVITY_TARGETS, INTERACTION_TARGET } from '../../../common/interactionTargets';
import type {
    TaskCompletionRule,
    TaskCollabAssignee,
    TaskType,
    TaskEditMode,
    TaskUpdatePayload,
} from '../../../../common/types/tasks';
import TaskError from './TaskError';
import type { GetAvatarUrlCallback } from '../../../common/flowTypes';
import type { ElementsXhrError } from '../../../../common/types/api';
import type { SelectorItems, SelectorItem, UserMini, GroupMini } from '../../../../common/types/core';

import './TaskForm.scss';

export interface TaskFormProps {
    error?: { status: number }; // TODO: update to ElementsXhrError once API supports it
    isDisabled?: boolean;
    onCancel: () => void;
    onSubmitError: (e: ElementsXhrError) => void;
    onSubmitSuccess: () => void;
    taskType: TaskType;
}

export interface TaskFormFieldProps {
    approvers: Array<TaskCollabAssignee>;
    completionRule: TaskCompletionRule;
    dueDate?: string | null;
    id: string;
    message: string;
}

export interface TaskFormConsumerProps extends TaskFormFieldProps {
    approverSelectorContacts: SelectorItems<UserMini | GroupMini>;
    className?: string;
    createTask: (
        text: string,
        approvers: SelectorItems<UserMini | GroupMini>,
        taskType: TaskType,
        dueDate: string | null,
        completionRule: TaskCompletionRule,
        onSuccess: ((data: unknown) => void) | null,
        onError: ((error: ElementsXhrError) => void) | null,
    ) => void;
    editMode?: TaskEditMode;
    editTask?: (
        task: TaskUpdatePayload,
        onSuccess: ((data: unknown) => void) | null,
        onError: ((error: ElementsXhrError) => void) | null,
    ) => void;
    getApproverWithQuery?: (query: string) => void;
    getAvatarUrl: GetAvatarUrlCallback;
}

interface Props extends TaskFormProps, TaskFormConsumerProps {
    intl: IntlShape;
}

type TaskFormFieldName = 'taskName' | 'taskAssignees' | 'taskDueDate';

type TaskFormInvalidSubmitState = {
    [key in TaskFormFieldName]?: {
        validityState?: {
            patternMismatch: boolean;
        };
    };
};

interface State {
    approverTextInput: string; // partial text input value for approver field before autocomplete/select
    approvers: Array<TaskCollabAssignee>;
    completionRule: TaskCompletionRule;
    dueDate?: Date | null;
    formValidityState: { [key in TaskFormFieldName]?: { code: string; message: string } };
    id: string;
    isLoading: boolean;
    isValid: boolean | null;
    message: string;
}

function convertAssigneesToSelectorItems(approvers: Array<TaskCollabAssignee>): SelectorItems<UserMini | GroupMini> {
    return approvers.map(({ target }) => {
        const newSelectorItem: SelectorItem<UserMini | GroupMini> = {
            id: target.id,
            name: target.name,
            item: target,
            value: target.id,
            text: target.name, // for PillSelectorDropdown SelectorOptions type
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
        const { dueDate, id, message, approvers, completionRule } = this.props;
        return {
            id,
            completionRule: completionRule || TASK_COMPLETION_RULE_ALL,
            approvers,
            approverTextInput: '',
            dueDate: dueDate ? new Date(dueDate) : null,
            formValidityState: {},
            message,
            isLoading: false,
            isValid: null,
        };
    }

    validateForm = (only?: TaskFormFieldName, invalidSubmitValidityState?: TaskFormInvalidSubmitState) => {
        this.setState(state => {
            const { intl } = this.props;
            const { approvers, message, approverTextInput } = state;
            const assigneeFieldMissingError = {
                code: 'required',
                message: intl.formatMessage(commonMessages.requiredFieldError),
            };
            const assigneeFieldInvalidError = {
                code: 'invalid',
                message: intl.formatMessage(commonMessages.invalidUserError),
            };
            const messageFieldError = {
                code: 'required',
                message: intl.formatMessage(commonMessages.requiredFieldError),
            };
            const taskDueDateError = {
                code: 'invalid',
                message: intl.formatMessage(commonMessages.invalidDateError),
            };
            const formValidityState = {
                taskAssignees:
                    (approverTextInput.length ? assigneeFieldInvalidError : null) ||
                    (approvers.length ? null : assigneeFieldMissingError),
                taskName: message ? null : messageFieldError,
                taskDueDate: getProp(invalidSubmitValidityState, 'taskDueDate.validityState.patternMismatch')
                    ? taskDueDateError
                    : null,
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
        return formValidityState[fieldName] ? formValidityState[fieldName]?.message : null;
    };

    clearForm = () => this.setState(this.getInitialFormState());

    handleInvalidSubmit = (invalidSubmitValidityState?: TaskFormInvalidSubmitState) => {
        if (!isEmpty(invalidSubmitValidityState)) {
            this.validateForm(undefined, invalidSubmitValidityState);
        } else {
            this.validateForm();
        }
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

    addResinInfo = (): Record<string, string | number | boolean | string[] | undefined> => {
        const { id, taskType, editMode } = this.props;
        const { dueDate } = this.state;
        const addedAssignees = this.getAddedAssignees();
        const removedAssignees = this.getRemovedAssignees();

        return {
            'data-resin-taskid': id,
            'data-resin-tasktype': taskType,
            'data-resin-isediting': editMode === TASK_EDIT_MODE_EDIT,
            'data-resin-numassigneesadded': addedAssignees.filter(assignee => assignee.target.type === 'user').length,
            'data-resin-numgroupssadded': addedAssignees.filter(assignee => assignee.target.type === 'group').length,
            'data-resin-numassigneesremoved': removedAssignees.length,
            'data-resin-assigneesadded': addedAssignees.map(assignee => assignee.target.id),
            'data-resin-assigneesremoved': removedAssignees.map(assignee => assignee.target.id),
            'data-resin-duedate': dueDate && dueDate.getTime(),
        };
    };

    getAddedAssignees = (): Array<TaskCollabAssignee> => {
        // Added assignees are the ones in state that weren't in the prop
        const { approvers } = this.props;
        const { approvers: currentApprovers } = this.state;
        const approverIds = approvers.map(approver => approver.id);
        return currentApprovers.filter(currentApprover => approverIds.indexOf(currentApprover.id) === -1);
    };

    getRemovedAssignees = (): Array<TaskCollabAssignee> => {
        // Assignees to remove are the ones in the prop that cannot be found in state
        const { approvers } = this.props;
        const { approvers: currentApprovers } = this.state;
        const currentApproverIds = currentApprovers.map(currentApprover => currentApprover.id);
        return approvers.filter(approver => currentApproverIds.indexOf(approver.id) === -1);
    };

    handleValidSubmit = (): void => {
        const { id, createTask, editTask, editMode, taskType } = this.props;
        const { message, approvers: currentApprovers, dueDate, completionRule, isValid } = this.state;
        const dueDateString = dueDate && dueDate.toISOString();

        if (!isValid) return;

        this.setState({ isLoading: true });

        if (editMode === TASK_EDIT_MODE_EDIT && editTask) {
            editTask(
                {
                    id,
                    completion_rule: completionRule,
                    description: message,
                    due_at: dueDateString,
                    addedAssignees: convertAssigneesToSelectorItems(this.getAddedAssignees()),
                    removedAssignees: this.getRemovedAssignees(),
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
                completionRule,
                this.handleSubmitSuccess,
                this.handleSubmitError,
            );
        }
    };

    handleDueDateChange = (date: string | null): void => {
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

    handleCompletionRuleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ completionRule: event.target.checked ? TASK_COMPLETION_RULE_ANY : TASK_COMPLETION_RULE_ALL });
    };

    handleApproverSelectorInput = (value: string): void => {
        const { getApproverWithQuery = noop } = this.props;
        this.setState({ approverTextInput: value });
        getApproverWithQuery(value);
    };

    handleApproverSelectorSelect = (pills: Array<SelectorItem<UserMini | GroupMini>>): void => {
        this.setState({
            approvers: this.state.approvers.concat(
                pills.map(pill => {
                    return {
                        id: '',
                        target: pill.item,
                        role: 'ASSIGNEE',
                        type: 'task_collaborator',
                        status: 'NOT_STARTED',
                        permissions: { can_delete: false, can_update: false },
                    };
                }),
            ),
            approverTextInput: '',
        });

        this.validateForm('taskAssignees');
    };

    handleApproverSelectorRemove = (option: SelectorItem<UserMini | GroupMini>, index: number): void => {
        const approvers = [...this.state.approvers];
        approvers.splice(index, 1);
        this.setState({ approvers });
        this.validateForm('taskAssignees');
    };

    handleChangeMessage = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        e.persist();
        this.setState({ message: e.currentTarget.value });
        this.validateForm('taskName');
    };

    handleCancelClick = () => {
        this.props.onCancel();
    };

    render() {
        const { approverSelectorContacts, className, error, isDisabled, intl, editMode, taskType } = this.props;
        const { dueDate, approvers, message, formValidityState, isLoading, completionRule } = this.state;
        const inputContainerClassNames = classNames('bcs-task-input-container', 'bcs-task-input-is-open', className);
        const isCreateEditMode = editMode === TASK_EDIT_MODE_CREATE;
        const selectedApprovers = convertAssigneesToSelectorItems(approvers);

        // filter out selected approvers
        // map to datalist item format
        const approverOptions = approverSelectorContacts.filter(
            ({ id }) => !selectedApprovers.find(({ value }) => value === id),
        );

        const pillSelectorOverlayClasses = classNames({
            scrollable: approverOptions.length > 4,
        });

        const submitButtonMessage = isCreateEditMode
            ? messages.tasksAddTaskFormSubmitLabel
            : messages.tasksEditTaskFormSubmitLabel;
        const shouldShowCompletionRule = approvers.length > 0;

        // Enable checkbox when there is a group or multiple users being assigned
        // TODO: consider setting contants for assignee types to src/constants.js
        // - move from src/features/collaborator-avatars/constants.js
        const isCompletionRuleCheckboxDisabled =
            approvers.filter(approver => approver.target.type === 'group').length <= 0 &&
            approvers.filter(approver => approver.target.type === 'user').length <= 1;

        const isCompletionRuleCheckboxChecked = completionRule === TASK_COMPLETION_RULE_ANY;
        const isForbiddenErrorOnEdit = isLoading || (getProp(error, 'status') === 403 && !isCreateEditMode);

        return (
            <div className={inputContainerClassNames} data-resin-component="taskform">
                <div className="bcs-task-input-form-container">
                    <TaskError editMode={editMode} error={error} taskType={taskType} />
                    <Form
                        formValidityState={formValidityState}
                        onInvalidSubmit={this.handleInvalidSubmit}
                        onValidSubmit={this.handleValidSubmit}
                    >
                        <PillSelectorDropdown
                            className={pillSelectorOverlayClasses}
                            error={this.getErrorByFieldname('taskAssignees')}
                            disabled={isForbiddenErrorOnEdit}
                            inputProps={{
                                'data-testid': 'task-form-assignee-input',
                                'data-target-id': 'PillSelectorDropdown-selectAssigneesInput',
                            }}
                            isRequired
                            label={<FormattedMessage {...messages.tasksAddTaskFormSelectAssigneesLabel} />}
                            name="taskAssignees"
                            onBlur={() => this.validateForm('taskAssignees')}
                            onInput={this.handleApproverSelectorInput}
                            onRemove={this.handleApproverSelectorRemove}
                            onSelect={this.handleApproverSelectorSelect}
                            placeholder={intl.formatMessage(commentFormMessages.approvalAddAssignee)}
                            selectedOptions={selectedApprovers}
                            selectorOptions={approverOptions}
                            shouldSetActiveItemOnOpen
                            shouldClearUnmatchedInput
                            validateForError={() => this.validateForm('taskAssignees')}
                        >
                            {approverOptions.map(({ id, name, item = {} }) => (
                                <ContactDatalistItem
                                    key={id}
                                    data-testid="task-assignee-option"
                                    name={name}
                                    subtitle={
                                        (item as UserMini | GroupMini).type === 'group' ? (
                                            <FormattedMessage {...messages.taskCreateGroupLabel} />
                                        ) : (
                                            (item as UserMini).email
                                        )
                                    }
                                />
                            ))}
                        </PillSelectorDropdown>
                        {shouldShowCompletionRule && (
                            <>
                                <FeatureFlag feature="activityFeed.tasks.assignToGroup">
                                    <Checkbox
                                        data-testid="task-form-completion-rule-checkbox-group"
                                        isChecked={isCompletionRuleCheckboxChecked}
                                        isDisabled={isCompletionRuleCheckboxDisabled || isForbiddenErrorOnEdit}
                                        label={<FormattedMessage {...messages.taskAnyCheckboxLabel} />}
                                        tooltip={intl.formatMessage(messages.taskAnyInfoGroupTooltip)}
                                        name="completionRule"
                                        onChange={this.handleCompletionRuleChange}
                                    />
                                </FeatureFlag>
                                <FeatureFlag not feature="activityFeed.tasks.assignToGroup">
                                    <Checkbox
                                        data-testid="task-form-completion-rule-checkbox"
                                        isChecked={isCompletionRuleCheckboxChecked}
                                        isDisabled={isCompletionRuleCheckboxDisabled || isForbiddenErrorOnEdit}
                                        label={<FormattedMessage {...messages.taskAnyCheckboxLabel} />}
                                        tooltip={intl.formatMessage(messages.taskAnyInfoTooltip)}
                                        name="completionRule"
                                        onChange={this.handleCompletionRuleChange}
                                    />
                                </FeatureFlag>
                            </>
                        )}

                        <TextArea
                            className="bcs-task-name-input"
                            data-testid="task-form-name-input"
                            data-target-id="TextArea-messageInput"
                            disabled={isDisabled || isForbiddenErrorOnEdit}
                            error={this.getErrorByFieldname('taskName')}
                            isRequired
                            label={<FormattedMessage {...messages.tasksAddTaskFormMessageLabel} />}
                            name="taskName"
                            onBlur={() => this.validateForm('taskName')}
                            onChange={this.handleChangeMessage}
                            placeholder={intl.formatMessage(commentFormMessages.commentWrite)}
                            value={message}
                        />
                        <DatePicker
                            className="bcs-task-add-due-date-input"
                            error={this.getErrorByFieldname('taskDueDate')}
                            errorTooltipPosition={TooltipPosition.BOTTOM_RIGHT}
                            inputProps={{
                                [INTERACTION_TARGET]: ACTIVITY_TARGETS.TASK_DATE_PICKER,
                                'data-testid': 'task-form-date-input',
                                'data-target-id': 'DatePicker-dateInput',
                            }}
                            isAccessible
                            isDisabled={isForbiddenErrorOnEdit}
                            isKeyboardInputAllowed
                            isRequired={false}
                            label={<FormattedMessage {...messages.tasksAddTaskFormDueDateLabel} />}
                            minDate={new Date()}
                            name="taskDueDate"
                            onChange={this.handleDueDateChange}
                            placeholder={intl.formatMessage(commentFormMessages.approvalSelectDate)}
                            value={dueDate || undefined}
                        />
                        <ModalActions>
                            <Button
                                className="bcs-task-input-cancel-btn"
                                data-resin-target={ACTIVITY_TARGETS.APPROVAL_FORM_CANCEL}
                                data-testid="task-form-cancel-button"
                                data-target-id="Button-cancelButton"
                                onClick={this.handleCancelClick}
                                isDisabled={isLoading}
                                type={ButtonType.BUTTON}
                                {...this.addResinInfo()}
                            >
                                <FormattedMessage {...messages.tasksAddTaskFormCancelLabel} />
                            </Button>
                            <PrimaryButton
                                className="bcs-task-input-submit-btn"
                                data-resin-target={ACTIVITY_TARGETS.APPROVAL_FORM_POST}
                                data-testid="task-form-submit-button"
                                data-target-id="PrimaryButton-submitButton"
                                isDisabled={isForbiddenErrorOnEdit}
                                isLoading={isLoading}
                                {...this.addResinInfo()}
                            >
                                <FormattedMessage {...submitButtonMessage} />
                            </PrimaryButton>
                        </ModalActions>
                    </Form>
                </div>
            </div>
        );
    }
}

// For testing only
export { TaskForm as TaskFormUnwrapped };

export default injectIntl(TaskForm);
