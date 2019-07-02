/**
 * @flow
 * @file i18n messages
 * @author Box
 */

import { defineMessages } from 'react-intl';

const messages = defineMessages({
    taskCreateErrorTitle: {
        id: 'be.contentSidebar.activityFeed.taskForm.taskCreateErrorTitle',
        description: 'Title shown above error message when a task creation fails',
        defaultMessage: 'Error',
    },
    taskUpdateErrorMessage: {
        id: 'be.contentSidebar.activityFeed.taskForm.taskUpdateErrorMessage',
        description: 'Error message when a task edit fails',
        defaultMessage: 'An error occurred while modifying this task. Please try again.',
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
});

export default messages;
