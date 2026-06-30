import { defineMessages } from 'react-intl';

const messages = defineMessages({
    assigneeFieldRequiredError: {
        id: 'be.taskModalV2.assigneeFieldRequiredError',
        defaultMessage: 'Required Field',
        description: 'Error message when the assignee field is empty on submit',
    },
    assigneePlaceholder: {
        id: 'be.taskModalV2.assigneePlaceholder',
        defaultMessage: 'Add an assignee or group',
        description: 'Placeholder text for the assignee combobox in the task modal',
    },
    assigneeSelectorLabel: {
        id: 'be.taskModalV2.assigneeSelectorLabel',
        defaultMessage: 'Select Assignees',
        description: 'Label for the assignee combobox in the task modal',
    },
    cancelButtonLabel: {
        id: 'be.taskModalV2.cancelButtonLabel',
        defaultMessage: 'Cancel',
        description: 'Label for the Cancel button in the task modal footer',
    },
    closeLabel: {
        id: 'be.taskModalV2.close',
        defaultMessage: 'Close',
        description: 'aria-label for the task modal close button',
    },
    completionRuleCheckboxLabel: {
        id: 'be.taskModalV2.completionRuleCheckboxLabel',
        defaultMessage: 'Only one assignee is required to complete this task',
        description: 'Label for the checkbox that switches a task to any-assignee completion',
    },
    createApprovalTaskTitle: {
        id: 'be.taskModalV2.createApprovalTask',
        defaultMessage: 'Create Approval Task',
        description: 'Title of the modal for creating an approval task',
    },
    createButtonLabel: {
        id: 'be.taskModalV2.createButtonLabel',
        defaultMessage: 'Create',
        description: 'Label for the Create button in the task modal footer (create mode)',
    },
    createGeneralTaskTitle: {
        id: 'be.taskModalV2.createGeneralTask',
        defaultMessage: 'Create General Task',
        description: 'Title of the modal for creating a general task',
    },
    createTaskErrorMessage: {
        id: 'be.taskModalV2.createTaskErrorMessage',
        defaultMessage: 'An error occurred while creating this task. Please try again.',
        description: 'Body text of the error notice when creating a task fails',
    },
    createTaskErrorTitle: {
        id: 'be.taskModalV2.createTaskErrorTitle',
        defaultMessage: 'Error',
        description: 'Title of the error notice when creating or updating a task fails',
    },
    datePickerCalendarAriaLabel: {
        id: 'be.taskModalV2.datePickerCalendarAriaLabel',
        defaultMessage: 'Due date calendar',
        description: 'aria-label for the calendar inside the due-date date picker',
    },
    datePickerClearAriaLabel: {
        id: 'be.taskModalV2.datePickerClearAriaLabel',
        defaultMessage: 'Clear due date',
        description: 'aria-label for the clear button on the due-date date picker',
    },
    datePickerNextMonthAriaLabel: {
        id: 'be.taskModalV2.datePickerNextMonthAriaLabel',
        defaultMessage: 'Next month',
        description: 'aria-label for the next-month button in the due-date date picker',
    },
    datePickerOpenAriaLabel: {
        id: 'be.taskModalV2.datePickerOpenAriaLabel',
        defaultMessage: 'Open due date calendar',
        description: 'aria-label for the button that opens the due-date calendar',
    },
    datePickerPreviousMonthAriaLabel: {
        id: 'be.taskModalV2.datePickerPreviousMonthAriaLabel',
        defaultMessage: 'Previous month',
        description: 'aria-label for the previous-month button in the due-date date picker',
    },
    dueDateLabel: {
        id: 'be.taskModalV2.dueDateLabel',
        defaultMessage: 'Due Date (optional)',
        description: 'Label for the due-date field in the task modal; due date is optional',
    },
    editApprovalTaskTitle: {
        id: 'be.taskModalV2.editApprovalTask',
        defaultMessage: 'Modify Approval Task',
        description: 'Title of the modal for editing an existing approval task',
    },
    editApprovalTaskForbiddenMessage: {
        id: 'be.taskModalV2.editApprovalTaskForbiddenMessage',
        defaultMessage: 'Unable to remove assignee(s) because the task is now approved.',
        description: 'Warning shown when removing assignees from an approved task fails with 403',
    },
    editForbiddenTitle: {
        id: 'be.taskModalV2.editForbiddenTitle',
        defaultMessage: 'Task Updated with Errors',
        description: 'Title of the warning notice when an edit partially fails (403 on update)',
    },
    editGeneralTaskForbiddenMessage: {
        id: 'be.taskModalV2.editGeneralTaskForbiddenMessage',
        defaultMessage: 'Unable to remove assignee(s) because the task is now completed.',
        description: 'Warning shown when removing assignees from a completed task fails with 403',
    },
    editGeneralTaskTitle: {
        id: 'be.taskModalV2.editGeneralTask',
        defaultMessage: 'Modify General Task',
        description: 'Title of the modal for editing an existing general task',
    },
    groupExceedsLimitWarningMessage: {
        id: 'be.taskModalV2.groupExceedsLimitWarningMessage',
        defaultMessage:
            'One or more groups can not receive this task as a group size cannot exceed the limit of {max} assignees per group.',
        description: 'Body of the warning notice when a group assignee exceeds the per-group maximum',
    },
    groupExceedsLimitWarningTitle: {
        id: 'be.taskModalV2.groupExceedsLimitWarningTitle',
        defaultMessage: 'Exceeded max assignees per group',
        description: 'Title of the warning notice when a group assignee exceeds the per-group maximum',
    },
    inlineNoticeErrorAriaLabel: {
        id: 'be.taskModalV2.inlineNoticeErrorAriaLabel',
        defaultMessage: 'Error',
        description: 'aria-label for the error variant icon in the task modal inline notice',
    },
    inlineNoticeWarningAriaLabel: {
        id: 'be.taskModalV2.inlineNoticeWarningAriaLabel',
        defaultMessage: 'Warning',
        description: 'aria-label for the warning variant icon in the task modal inline notice',
    },
    loadingAriaLabel: {
        id: 'be.taskModalV2.loadingAriaLabel',
        defaultMessage: 'Loading',
        description: 'aria-label for the loading indicator on the submit button while a task is saving',
    },
    messageFieldRequiredError: {
        id: 'be.taskModalV2.messageFieldRequiredError',
        defaultMessage: 'Required Field',
        description: 'Error message when the task message field is empty on submit',
    },
    messageLabel: {
        id: 'be.taskModalV2.messageLabel',
        defaultMessage: 'Message',
        description: 'Label for the message field in the task modal',
    },
    messagePlaceholder: {
        id: 'be.taskModalV2.messagePlaceholder',
        defaultMessage: 'Write a message',
        description: 'Placeholder text for the message field in the task modal',
    },
    updateButtonLabel: {
        id: 'be.taskModalV2.updateButtonLabel',
        defaultMessage: 'Update',
        description: 'Label for the Update button in the task modal footer (edit mode)',
    },
    updateTaskErrorMessage: {
        id: 'be.taskModalV2.updateTaskErrorMessage',
        defaultMessage: 'An error occurred while modifying this task. Please try again.',
        description: 'Body text of the error notice when updating an existing task fails',
    },
});

export default messages;
