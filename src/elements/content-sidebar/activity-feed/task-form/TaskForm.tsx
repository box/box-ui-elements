/**
 * @file Component for Approval comment form
 */

import * as React from 'react';
import { useState, useCallback } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';
import noop from 'lodash/noop';
import getProp from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import classNames from 'classnames';
import Form from '../../../../components/form-elements/form/Form';
import ModalActions from '../../../../components/modal/ModalActions';
import ContactDatalistItem from '../../../../components/contact-datalist-item/ContactDatalistItem';
import TextArea from '../../../../components/text-area';
import DatePicker from '../../../../components/date-picker/DatePicker';
import Checkbox from '../../../../components/checkbox';
import PillSelectorDropdown from '../../../../components/pill-selector-dropdown/PillSelectorDropdown';
import Button, { ButtonType } from '../../../../components/button';
import { FeatureFlag } from '../../../common/feature-checking';
import PrimaryButton from '../../../../components/primary-button/PrimaryButton';
import commonMessages from '../../../../common/messages';
import messages from './messages';
import commentFormMessages from '../comment-form/messages';
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
import type { ElementsXhrError } from '../../../../common/types/api';
import type { SelectorItems, SelectorItem, UserMini, GroupMini } from '../../../../common/types/core';

import './TaskForm.scss';

interface TaskFormFieldProps {
    approvers: Array<TaskCollabAssignee>;
    completionRule: TaskCompletionRule;
    dueDate?: string | null;
    id: string;
    message: string;
}

interface TaskFormProps {
    error?: ElementsXhrError;
    isDisabled?: boolean;
    onCancel: () => void;
    onSubmitError: (e: ElementsXhrError) => void;
    onSubmitSuccess: (task: TaskUpdatePayload) => void;
    taskType: TaskType;
}

interface TaskFormConsumerProps extends TaskFormFieldProps {
    approverSelectorContacts?: SelectorItems<UserMini | GroupMini>;
    className?: string;
    createTask: (
        text: string,
        assignees: Array<TaskCollabAssignee>,
        dueDate: string | null,
        completionRule: TaskCompletionRule,
        onSuccess: () => void,
        onError: (e: ElementsXhrError) => void,
    ) => void;
    editMode?: TaskEditMode;
    editTask?: (task: TaskUpdatePayload, onSuccess: () => void, onError: (e: ElementsXhrError) => void) => void;
    getApproverWithQuery?: (query: string) => Promise<Array<UserMini | GroupMini>>;
}

interface ResinButtonAttributes {
    'data-resin-taskid'?: string;
    'data-resin-tasktype'?: TaskType;
    'data-resin-isediting'?: boolean;
    'data-resin-numassigneesadded'?: number;
    'data-resin-numgroupssadded'?: number;
    'data-resin-numassigneesremoved'?: number;
    'data-resin-assigneesadded'?: string[];
    'data-resin-assigneesremoved'?: string[];
    'data-resin-duedate'?: number;
    'data-resin-target'?: string;
}

type Props = TaskFormProps & TaskFormConsumerProps & { intl: IntlShape };

type TaskFormFieldName = 'taskName' | 'taskAssignees' | 'taskDueDate';

interface TaskFormValidityState {
    validityState: {
        badInput: boolean;
        customError: boolean;
        patternMismatch: boolean;
        rangeOverflow: boolean;
        rangeUnderflow: boolean;
        stepMismatch: boolean;
        tooLong: boolean;
        tooShort: boolean;
        typeMismatch: boolean;
        valid: boolean;
        valueMissing: boolean;
    };
    error: {
        code: string;
        message: string;
    } | null;
}

type TaskFormInvalidSubmitState = Partial<Record<TaskFormFieldName, TaskFormValidityState | null>>;

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

const TaskForm: React.FC<Props> = ({
    approvers: initialApprovers = [],
    approverSelectorContacts = [],
    className,
    createTask,
    editMode = TASK_EDIT_MODE_CREATE,
    editTask,
    error,
    getApproverWithQuery = noop,
    id: initialId = '',
    isDisabled = false,
    message: initialMessage = '',
    onCancel,
    onSubmitError,
    onSubmitSuccess,
    taskType,
    intl,
}) => {
    const [approverTextInput, setApproverTextInput] = useState<string>('');
    const [approvers, setApprovers] = useState<Array<TaskCollabAssignee>>(initialApprovers);
    const [completionRule, setCompletionRule] = useState<TaskCompletionRule>(TASK_COMPLETION_RULE_ALL);
    const [dueDate, setDueDate] = useState<Date | null>(null);
    const [formValidityState, setFormValidityState] = useState<{
        [key in TaskFormFieldName]?: TaskFormValidityState;
    }>({});
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<string>(initialMessage);

    const validateForm = useCallback(
        (only?: TaskFormFieldName, invalidSubmitValidityState?: TaskFormInvalidSubmitState | null): void => {
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

            const baseValidityState = {
                badInput: false,
                customError: false,
                patternMismatch: false,
                rangeOverflow: false,
                rangeUnderflow: false,
                stepMismatch: false,
                tooLong: false,
                tooShort: false,
                typeMismatch: false,
                valid: false,
                valueMissing: false,
            };

            const newFormValidityState: {
                [key in TaskFormFieldName]: TaskFormValidityState;
            } = {
                taskAssignees: {
                    validityState: {
                        ...baseValidityState,
                        customError: approverTextInput.length > 0,
                        valid: approvers.length > 0 && approverTextInput.length === 0,
                        valueMissing: approvers.length === 0,
                    },
                    error:
                        (approverTextInput.length ? assigneeFieldInvalidError : null) ||
                        (approvers.length ? null : assigneeFieldMissingError),
                },
                taskName: {
                    validityState: {
                        ...baseValidityState,
                        valid: !!message,
                        valueMissing: !message,
                    },
                    error: message ? null : messageFieldError,
                },
                taskDueDate: {
                    validityState: {
                        ...baseValidityState,
                        patternMismatch: getProp(
                            invalidSubmitValidityState,
                            'taskDueDate.validityState.patternMismatch',
                            false,
                        ),
                        valid: !getProp(invalidSubmitValidityState, 'taskDueDate.validityState.patternMismatch', false),
                    },
                    error: getProp(invalidSubmitValidityState, 'taskDueDate.validityState.patternMismatch')
                        ? taskDueDateError
                        : null,
                },
            };

            setFormValidityState(prevState =>
                only ? { ...prevState, [only]: newFormValidityState[only] } : newFormValidityState,
            );
        },
        [approverTextInput, approvers.length, intl, message],
    );

    const getErrorByFieldname = useCallback(
        (fieldName: TaskFormFieldName): string | null => {
            return formValidityState[fieldName]?.error?.message || null;
        },
        [formValidityState],
    );

    const handleInvalidSubmit = useCallback(
        (invalidSubmitValidityState?: TaskFormInvalidSubmitState | null): void => {
            if (!isEmpty(invalidSubmitValidityState)) {
                validateForm(undefined, invalidSubmitValidityState);
            } else {
                validateForm();
            }
        },
        [validateForm],
    );

    const handleSubmitSuccess = useCallback(
        (task: TaskUpdatePayload): void => {
            if (onSubmitSuccess) {
                onSubmitSuccess(task);
            }
            setApprovers(initialApprovers);
            setApproverTextInput('');
            setCompletionRule(TASK_COMPLETION_RULE_ALL);
            setDueDate(null);
            setFormValidityState({});
            setMessage('');
            setIsLoading(false);
        },
        [initialApprovers, onSubmitSuccess],
    );

    const handleSubmitError = useCallback(
        (e: ElementsXhrError): void => {
            onSubmitError(e);
            setIsLoading(false);
        },
        [onSubmitError],
    );

    const getAddedAssignees = useCallback((): Array<TaskCollabAssignee> => {
        const approverIds = initialApprovers.map(approver => approver.id);
        return approvers.filter(currentApprover => approverIds.indexOf(currentApprover.id) === -1);
    }, [approvers, initialApprovers]);

    const getRemovedAssignees = useCallback((): Array<TaskCollabAssignee> => {
        const currentApproverIds = approvers.map(currentApprover => currentApprover.id);
        return initialApprovers.filter(approver => currentApproverIds.indexOf(approver.id) === -1);
    }, [approvers, initialApprovers]);

    const addResinInfo = useCallback((): ResinButtonAttributes => {
        const addedAssignees = getAddedAssignees();
        const removedAssignees = getRemovedAssignees();

        return {
            'data-resin-taskid': initialId,
            'data-resin-tasktype': taskType,
            'data-resin-isediting': editMode === TASK_EDIT_MODE_EDIT,
            'data-resin-numassigneesadded': addedAssignees.filter(assignee => assignee.target.type === 'user').length,
            'data-resin-numgroupssadded': addedAssignees.filter(assignee => assignee.target.type === 'group').length,
            'data-resin-numassigneesremoved': removedAssignees.length,
            'data-resin-assigneesadded': addedAssignees.map(assignee => assignee.target.id),
            'data-resin-assigneesremoved': removedAssignees.map(assignee => assignee.target.id),
            'data-resin-duedate': dueDate ? dueDate.getTime() : undefined,
        };
    }, [dueDate, editMode, getAddedAssignees, getRemovedAssignees, initialId, taskType]);

    const handleValidSubmit = useCallback(
        (data: { taskName: string; taskDueDate?: string }) => {
            setIsLoading(true);

            const taskPayload = {
                id: initialId,
                description: data.taskName || message,
                due_at: data.taskDueDate || (dueDate ? dueDate.toISOString() : null),
                completion_rule: completionRule,
            };

            if (editMode === TASK_EDIT_MODE_EDIT) {
                if (editTask) {
                    const addedAssignees = getAddedAssignees();
                    const removedAssignees = getRemovedAssignees();

                    editTask(
                        {
                            ...taskPayload,
                            addedAssignees,
                            removedAssignees,
                        },
                        () => {
                            handleSubmitSuccess({
                                ...taskPayload,
                                addedAssignees,
                                removedAssignees,
                            });
                        },
                        handleSubmitError,
                    );
                }
            } else {
                createTask(
                    taskPayload.description,
                    approvers,
                    taskPayload.due_at,
                    completionRule,
                    () => {
                        handleSubmitSuccess(taskPayload);
                    },
                    handleSubmitError,
                );
            }
        },
        [
            approvers,
            completionRule,
            createTask,
            dueDate,
            editMode,
            editTask,
            getAddedAssignees,
            getRemovedAssignees,
            handleSubmitError,
            handleSubmitSuccess,
            initialId,
            message,
        ],
    );

    const handleDueDateChange = useCallback(
        (date: string | null): void => {
            let dateValue = null;
            if (date) {
                dateValue = new Date(date);
                dateValue.setHours(23, 59, 59, 999);
            }
            setDueDate(dateValue);
            validateForm('taskDueDate');
        },
        [validateForm],
    );

    const handleCompletionRuleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>): void => {
        setCompletionRule(event.target.checked ? TASK_COMPLETION_RULE_ANY : TASK_COMPLETION_RULE_ALL);
    }, []);

    const handleApproverSelectorInput = useCallback(
        (value: string): void => {
            setApproverTextInput(value);
            getApproverWithQuery(value);
            validateForm('taskAssignees');
        },
        [getApproverWithQuery, validateForm],
    );

    const handleApproverSelectorSelect = useCallback(
        (pills: Array<SelectorItem<UserMini | GroupMini>>): void => {
            setApprovers(prevApprovers => [
                ...prevApprovers,
                ...pills.map(pill => ({
                    id: '',
                    target: pill.item,
                    role: 'ASSIGNEE',
                    type: 'task_collaborator',
                    status: 'NOT_STARTED',
                    permissions: { can_delete: false, can_update: false },
                })),
            ]);
            setApproverTextInput('');
            validateForm('taskAssignees');
        },
        [validateForm],
    );

    const handleApproverSelectorRemove = useCallback(
        (option: SelectorItem<UserMini | GroupMini>, index: number): void => {
            setApprovers(prevApprovers => {
                const newApprovers = [...prevApprovers];
                newApprovers.splice(index, 1);
                return newApprovers;
            });
            validateForm('taskAssignees');
        },
        [validateForm],
    );

    const handleChangeMessage = useCallback(
        (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
            e.persist();
            setMessage(e.currentTarget.value);
            validateForm('taskName');
        },
        [validateForm],
    );

    const handleCancelClick = useCallback(() => {
        onCancel();
    }, [onCancel]);

    // Render implementation
    const inputContainerClassNames = classNames('bcs-task-input-container', 'bcs-task-input-is-open', className);
    const isCreateEditMode = editMode === TASK_EDIT_MODE_CREATE;
    const selectedApprovers = convertAssigneesToSelectorItems(approvers);

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
                    onInvalidSubmit={handleInvalidSubmit}
                    onValidSubmit={handleValidSubmit}
                >
                    <PillSelectorDropdown
                        className={pillSelectorOverlayClasses}
                        error={getErrorByFieldname('taskAssignees')}
                        disabled={isForbiddenErrorOnEdit}
                        inputProps={{
                            'data-testid': 'task-form-assignee-input',
                            'data-target-id': 'PillSelectorDropdown-selectAssigneesInput',
                            name: 'taskAssignees',
                        }}
                        isRequired
                        label={<FormattedMessage {...messages.tasksAddTaskFormSelectAssigneesLabel} />}
                        name="taskAssignees"
                        onBlur={() => validateForm('taskAssignees')}
                        onInput={handleApproverSelectorInput}
                        onRemove={handleApproverSelectorRemove}
                        onSelect={handleApproverSelectorSelect}
                        placeholder={intl.formatMessage(commentFormMessages.approvalAddAssignee)}
                        selectedOptions={selectedApprovers}
                        selectorOptions={approverOptions}
                        shouldSetActiveItemOnOpen
                        shouldClearUnmatchedInput
                        validateForError={() => validateForm('taskAssignees')}
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
                                    onChange={handleCompletionRuleChange}
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
                                    onChange={handleCompletionRuleChange}
                                />
                            </FeatureFlag>
                        </>
                    )}

                    <TextArea
                        className="bcs-task-name-input"
                        data-testid="task-form-name-input"
                        data-target-id="TextArea-messageInput"
                        disabled={isDisabled || isForbiddenErrorOnEdit}
                        error={getErrorByFieldname('taskName')}
                        isRequired
                        label={<FormattedMessage {...messages.tasksAddTaskFormMessageLabel} />}
                        name="taskName"
                        onBlur={() => validateForm('taskName')}
                        onChange={handleChangeMessage}
                        placeholder={intl.formatMessage(commentFormMessages.commentWrite)}
                        value={message}
                    />
                    <DatePicker
                        className="bcs-task-add-due-date-input"
                        error={getErrorByFieldname('taskDueDate')}
                        inputProps={
                            {
                                [INTERACTION_TARGET]: ACTIVITY_TARGETS.TASK_DATE_PICKER,
                                'data-testid': 'task-form-date-input',
                                'data-target-id': 'DatePicker-dateInput',
                            } as React.InputHTMLAttributes<HTMLInputElement>
                        }
                        isAccessible
                        isDisabled={isForbiddenErrorOnEdit}
                        isKeyboardInputAllowed
                        isRequired={false}
                        label={<FormattedMessage {...messages.tasksAddTaskFormDueDateLabel} />}
                        minDate={new Date()}
                        name="taskDueDate"
                        onChange={handleDueDateChange}
                        placeholder={intl.formatMessage(commentFormMessages.approvalSelectDate)}
                        value={dueDate || undefined}
                    />
                    <ModalActions>
                        <Button
                            className="bcs-task-input-cancel-btn"
                            data-resin-target={ACTIVITY_TARGETS.APPROVAL_FORM_CANCEL}
                            data-testid="task-form-cancel-button"
                            onClick={handleCancelClick}
                            isDisabled={isLoading}
                            isLoading={false}
                            showRadar={false}
                            type={ButtonType.BUTTON}
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
                            {...addResinInfo()}
                        >
                            <FormattedMessage {...submitButtonMessage} />
                        </PrimaryButton>
                    </ModalActions>
                </Form>
            </div>
        </div>
    );
};

export { TaskForm as TaskFormUnwrapped };
export type { Props as TaskFormProps };

const TaskFormWithIntl = (props: Omit<Props, 'intl'>) => {
    const intl = useIntl();
    return <TaskForm {...props} intl={intl} />;
};

export default TaskFormWithIntl;
