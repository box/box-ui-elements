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
    createGeneralTaskTitle: {
        id: 'be.taskModalV2.createGeneralTask',
        defaultMessage: 'Create General Task',
        description: 'Title of the modal for creating a general task',
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
        defaultMessage: 'Due Date',
        description: 'Label for the due-date field in the task modal',
    },
    editApprovalTaskTitle: {
        id: 'be.taskModalV2.editApprovalTask',
        defaultMessage: 'Modify Approval Task',
        description: 'Title of the modal for editing an existing approval task',
    },
    editGeneralTaskTitle: {
        id: 'be.taskModalV2.editGeneralTask',
        defaultMessage: 'Modify General Task',
        description: 'Title of the modal for editing an existing general task',
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
});

export default messages;
