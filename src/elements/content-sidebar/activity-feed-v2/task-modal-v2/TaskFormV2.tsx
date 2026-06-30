import * as React from 'react';
import { useIntl } from 'react-intl';

import { Checkbox, DatePicker, TextArea } from '@box/blueprint-web';
import { UserSelectorContainer } from '@box/user-selector';
import type { FetchedAvatarUrls, UserContactType } from '@box/user-selector';
import type { DateValue } from 'react-aria-components';
import { fromDate, getLocalTimeZone, today } from '@internationalized/date';

import { TASK_COMPLETION_RULE_ALL, TASK_COMPLETION_RULE_ANY, TASK_EDIT_MODE_EDIT } from '../../../../constants';

import type { TaskCompletionRule, TaskEditMode, TaskType } from '../../../../common/types/tasks';

import { mapAssigneeToUserContact, mapUserContactToAssignee, type RuntimeAssignee } from './utils/contactMapping';

import messages from './messages';

import './TaskFormV2.scss';

export const TASK_FORM_V2_ID = 'task-form-v2';

export type TaskFormV2SubmitPayload = {
    assignees: RuntimeAssignee[];
    completionRule: TaskCompletionRule;
    dueDate: Date | null;
    message: string;
};

export type TaskFormV2Props = {
    editMode?: TaskEditMode;
    fetchAvatarUrls: (contacts: UserContactType[]) => Promise<FetchedAvatarUrls>;
    fetchUsers: (query: string) => Promise<UserContactType[]>;
    initialAssignees?: RuntimeAssignee[];
    initialCompletionRule?: TaskCompletionRule;
    initialDueDate?: Date | null;
    initialMessage?: string;
    isDisabled?: boolean;
    onSubmit: (payload: TaskFormV2SubmitPayload) => void | Promise<void>;
    taskId?: string;
    taskType: TaskType;
};

// Backend treats dueDate as inclusive end-of-day for new tasks; existing tasks
// keep their original time so edit-mode round-trips do not silently retime.
const toSubmitDate = (
    value: DateValue,
    originalTime: { hours: number; minutes: number; seconds: number; ms: number } | null,
): Date => {
    const date = value.toDate(getLocalTimeZone());
    if (originalTime) {
        date.setHours(originalTime.hours, originalTime.minutes, originalTime.seconds, originalTime.ms);
    } else {
        date.setHours(23, 59, 59, 999);
    }
    return date;
};

const captureTime = (date: Date | null) =>
    date
        ? {
              hours: date.getHours(),
              minutes: date.getMinutes(),
              seconds: date.getSeconds(),
              ms: date.getMilliseconds(),
          }
        : null;

const TaskFormV2 = ({
    editMode,
    fetchAvatarUrls,
    fetchUsers,
    initialAssignees = [],
    initialCompletionRule = TASK_COMPLETION_RULE_ALL,
    initialDueDate = null,
    initialMessage = '',
    isDisabled = false,
    onSubmit,
    taskId = '',
    taskType,
}: TaskFormV2Props) => {
    const { formatMessage } = useIntl();
    const isEditMode = editMode === TASK_EDIT_MODE_EDIT;

    const [formElement, setFormElement] = React.useState<HTMLFormElement | null>(null);
    const portalElement = React.useCallback(() => formElement ?? document.body, [formElement]);

    const [selectedUsers, setSelectedUsers] = React.useState<UserContactType[]>(() =>
        initialAssignees.map(mapAssigneeToUserContact),
    );
    const [completionRule, setCompletionRule] = React.useState<TaskCompletionRule>(initialCompletionRule);
    const [message, setMessage] = React.useState<string>(initialMessage);
    const [dueDate, setDueDate] = React.useState<DateValue | null>(
        initialDueDate ? fromDate(initialDueDate, getLocalTimeZone()) : null,
    );
    const originalDueDateTime = React.useMemo(
        () => (isEditMode ? captureTime(initialDueDate) : null),
        [isEditMode, initialDueDate],
    );
    const [hasAttemptedSubmit, setHasAttemptedSubmit] = React.useState<boolean>(false);

    const isGroupSelected = selectedUsers.some(user => user.type === 'group');
    const userAssigneeCount = selectedUsers.filter(user => user.type === 'user').length;
    const shouldShowCompletionRule = selectedUsers.length > 0;
    const isCompletionRuleDisabled = !isGroupSelected && userAssigneeCount <= 1;

    const messageError =
        hasAttemptedSubmit && message.trim() === '' ? formatMessage(messages.messageFieldRequiredError) : undefined;
    const assigneeError =
        hasAttemptedSubmit && selectedUsers.length === 0
            ? formatMessage(messages.assigneeFieldRequiredError)
            : undefined;

    const resinTags = React.useMemo(() => {
        const initialIds = new Set(initialAssignees.map(a => a.target.id));
        const currentIds = new Set(selectedUsers.map(u => u.value));
        const added = selectedUsers.filter(u => !initialIds.has(u.value));
        const removed = initialAssignees.filter(a => !currentIds.has(a.target.id));
        const userCount = added.filter(u => u.type === 'user').length;
        const groupCount = added.filter(u => u.type === 'group').length;
        const submitDate = dueDate ? toSubmitDate(dueDate, originalDueDateTime).getTime() : undefined;
        return {
            'data-resin-assigneesadded': added.map(u => u.value).join(','),
            'data-resin-assigneesremoved': removed.map(a => a.target.id).join(','),
            'data-resin-duedate': submitDate,
            'data-resin-numassigneesadded': userCount,
            'data-resin-numassigneesremoved': removed.length,
            'data-resin-numgroupsadded': groupCount,
            'data-resin-taskid': taskId,
        };
    }, [dueDate, initialAssignees, originalDueDateTime, selectedUsers, taskId]);

    const minCalendarDate = React.useMemo(() => {
        const todayDate = today(getLocalTimeZone());
        if (initialDueDate && initialDueDate < todayDate.toDate(getLocalTimeZone())) {
            return undefined;
        }
        return todayDate;
    }, [initialDueDate]);

    const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (isDisabled) {
            return;
        }
        setHasAttemptedSubmit(true);
        if (selectedUsers.length === 0 || message.trim() === '') {
            return;
        }
        onSubmit({
            assignees: selectedUsers.map(mapUserContactToAssignee),
            completionRule,
            dueDate: dueDate ? toSubmitDate(dueDate, originalDueDateTime) : null,
            message,
        });
    };

    return (
        <form
            ref={setFormElement}
            className="bcs-NewTaskForm"
            data-resin-component="taskformv2"
            data-resin-isediting={isEditMode}
            data-resin-tasktype={taskType}
            id={TASK_FORM_V2_ID}
            onSubmit={handleFormSubmit}
            {...resinTags}
        >
            <UserSelectorContainer
                data-target-id="TaskFormV2-assigneeInput"
                disabled={isDisabled}
                error={assigneeError}
                fetchAvatarUrls={fetchAvatarUrls}
                fetchUsers={fetchUsers}
                label={formatMessage(messages.assigneeSelectorLabel)}
                onSelectedUsersChange={setSelectedUsers}
                placeholder={selectedUsers.length ? '' : formatMessage(messages.assigneePlaceholder)}
                portalElement={portalElement}
                selectedUsers={selectedUsers}
            />
            {shouldShowCompletionRule && (
                <Checkbox.Item
                    checked={completionRule === TASK_COMPLETION_RULE_ANY}
                    data-target-id="TaskFormV2-completionRuleCheckbox"
                    disabled={isDisabled || isCompletionRuleDisabled}
                    label={formatMessage(messages.completionRuleCheckboxLabel)}
                    name="completionRule"
                    onCheckedChange={checked =>
                        setCompletionRule(checked === true ? TASK_COMPLETION_RULE_ANY : TASK_COMPLETION_RULE_ALL)
                    }
                    value="any"
                />
            )}
            <TextArea
                data-target-id="TaskFormV2-messageInput"
                disabled={isDisabled}
                error={messageError}
                label={formatMessage(messages.messageLabel)}
                minRows={3}
                name="taskMessage"
                onChange={event => setMessage(event.target.value)}
                placeholder={formatMessage(messages.messagePlaceholder)}
                value={message}
            />
            <DatePicker
                calendarAriaLabel={formatMessage(messages.datePickerCalendarAriaLabel)}
                clearDatePickerAriaLabel={formatMessage(messages.datePickerClearAriaLabel)}
                dataTargetId="TaskFormV2-dueDateInput"
                isDisabled={isDisabled}
                label={formatMessage(messages.dueDateLabel)}
                minValue={minCalendarDate}
                nextMonthAriaLabel={formatMessage(messages.datePickerNextMonthAriaLabel)}
                onChange={setDueDate}
                openCalendarDropdownAriaLabel={formatMessage(messages.datePickerOpenAriaLabel)}
                previousMonthAriaLabel={formatMessage(messages.datePickerPreviousMonthAriaLabel)}
                value={dueDate}
            />
        </form>
    );
};

export default TaskFormV2;
