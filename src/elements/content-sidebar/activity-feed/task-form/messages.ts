import { defineMessages } from 'react-intl';

const messages = defineMessages({
    taskCreateErrorTitle: {
        id: 'be.contentSidebar.activityFeed.taskForm.taskCreateErrorTitle',
        description: 'Title shown above error message when a task creation fails',
        defaultMessage: 'Error',
    },
    taskEditWarningTitle: {
        id: 'be.contentSidebar.activityFeed.taskForm.taskEditWarningTitle',
        description: 'Title shown above warning message when a task create/edit partially fails',
        defaultMessage: 'Task Updated with Errors',
    },
    taskGroupExceedsLimitWarningTitle: {
        id: 'be.contentSidebar.activityFeed.taskForm.taskGroupExceedsWarningTitle',
        description: 'Title shown above warning message when task group exceeds limit',
        defaultMessage: 'Exceeded max assignees per group',
    },
    taskUpdateErrorMessage: {
        id: 'be.contentSidebar.activityFeed.taskForm.taskUpdateErrorMessage',
        description: 'Error message when a task edit fails',
        defaultMessage: 'An error occurred while modifying this task. Please try again.',
    },
    taskApprovalAssigneeRemovalWarningMessage: {
        id: 'be.contentSidebar.activityFeed.taskForm.taskApprovalAssigneeRemovalWarningMessage',
        description: 'Warning message showing that, while the task was updated, not all assignees (1+) were removed',
        defaultMessage: 'Unable to remove assignee(s) because the task is now approved.',
    },
    taskGeneralAssigneeRemovalWarningMessage: {
        id: 'be.contentSidebar.activityFeed.taskForm.taskGeneralAssigneeRemovalWarningMessage',
        description: 'Warning message showing that, while the task was updated, not all assignees (1+) were removed',
        defaultMessage: 'Unable to remove assignee(s) because the task is now completed.',
    },
    tasksAddTaskFormSelectAssigneesLabel: {
        id: 'be.contentSidebar.activityFeed.taskForm.tasksAddTaskFormSelectAssigneesLabel',
        defaultMessage: 'Select Assignees',
        description: 'label for task create form assignee input',
    },
    tasksAddTaskFormMessageLabel: {
        id: 'be.contentSidebar.activityFeed.taskForm.tasksAddTaskFormMessageLabel',
        defaultMessage: 'Message',
        description: 'label for task create form message input',
    },
    tasksAddTaskFormDueDateLabel: {
        id: 'be.contentSidebar.activityFeed.taskForm.tasksAddTaskFormDueDateLabel',
        defaultMessage: 'Due Date',
        description: 'label for task create form due date input',
    },
    tasksAddTaskFormSubmitLabel: {
        id: 'be.contentSidebar.activityFeed.taskForm.tasksAddTaskFormSubmitLabel',
        defaultMessage: 'Create',
        description: 'label for create button in create task modal in create mode',
    },
    tasksEditTaskFormSubmitLabel: {
        id: 'be.contentSidebar.activityFeed.taskForm.tasksEditTaskFormSubmitLabel',
        defaultMessage: 'Update',
        description: 'label for edit button in create task modal in edit mode',
    },
    tasksAddTaskFormCancelLabel: {
        id: 'be.contentSidebar.activityFeed.taskForm.tasksAddTaskFormCancelLabel',
        defaultMessage: 'Cancel',
        description: 'label for cancel button in create task popup',
    },
    taskAnyCheckboxLabel: {
        id: 'be.contentSidebar.activityFeed.taskForm.taskAnyCheckboxLabel',
        defaultMessage: 'Only one assignee is required to complete this task',
        description: 'Label for checkbox to set a task that requires only one assignee to complete.',
    },
    taskAnyInfoTooltip: {
        id: 'be.contentSidebar.activityFeed.taskForm.taskAnyInfoTooltip',
        defaultMessage:
            'By default, all assignees are required to take action before a task is complete. Selecting this option will require only one assignee to complete this task.',
        description: 'Text in tooltip explaining completion rule for an any assignee task.',
    },
    taskAnyInfoGroupTooltip: {
        id: 'be.contentSidebar.activityFeed.taskForm.taskAnyInfoGroupTooltip',
        defaultMessage:
            'Selecting this option will require only one assignee to complete this task. This will include assignees across all groups.',
        description: 'Text in tooltip explaining completion rule for an any assignee task (with optional groups).',
    },
    taskCreateGroupLabel: {
        id: 'be.contentSidebar.activityFeed.taskForm.taskCreateGroupLabel',
        description: 'Subheading for dropdown where user can select assignees and the item is a group',
        defaultMessage: 'Group',
    },
});

export default messages;
