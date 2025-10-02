/**
 * 
 * @file i18n messages
 * @author Box
 */

import { defineMessages } from 'react-intl';
const messages = defineMessages({
  taskCreateErrorTitle: {
    "id": "be.contentSidebar.activityFeed.taskForm.taskCreateErrorTitle",
    "defaultMessage": "Error"
  },
  taskEditWarningTitle: {
    "id": "be.contentSidebar.activityFeed.taskForm.taskEditWarningTitle",
    "defaultMessage": "Task Updated with Errors"
  },
  taskGroupExceedsLimitWarningTitle: {
    "id": "be.contentSidebar.activityFeed.taskForm.taskGroupExceedsWarningTitle",
    "defaultMessage": "Exceeded max assignees per group"
  },
  taskUpdateErrorMessage: {
    "id": "be.contentSidebar.activityFeed.taskForm.taskUpdateErrorMessage",
    "defaultMessage": "An error occurred while modifying this task. Please try again."
  },
  taskApprovalAssigneeRemovalWarningMessage: {
    "id": "be.contentSidebar.activityFeed.taskForm.taskApprovalAssigneeRemovalWarningMessage",
    "defaultMessage": "Unable to remove assignee(s) because the task is now approved."
  },
  taskGeneralAssigneeRemovalWarningMessage: {
    "id": "be.contentSidebar.activityFeed.taskForm.taskGeneralAssigneeRemovalWarningMessage",
    "defaultMessage": "Unable to remove assignee(s) because the task is now completed."
  },
  tasksAddTaskFormSelectAssigneesLabel: {
    "id": "be.contentSidebar.activityFeed.taskForm.tasksAddTaskFormSelectAssigneesLabel",
    "defaultMessage": "Select Assignees"
  },
  tasksAddTaskFormMessageLabel: {
    "id": "be.contentSidebar.activityFeed.taskForm.tasksAddTaskFormMessageLabel",
    "defaultMessage": "Message"
  },
  tasksAddTaskFormDueDateLabel: {
    "id": "be.contentSidebar.activityFeed.taskForm.tasksAddTaskFormDueDateLabel",
    "defaultMessage": "Due Date"
  },
  tasksAddTaskFormSubmitLabel: {
    "id": "be.contentSidebar.activityFeed.taskForm.tasksAddTaskFormSubmitLabel",
    "defaultMessage": "Create"
  },
  tasksEditTaskFormSubmitLabel: {
    "id": "be.contentSidebar.activityFeed.taskForm.tasksEditTaskFormSubmitLabel",
    "defaultMessage": "Update"
  },
  tasksAddTaskFormCancelLabel: {
    "id": "be.contentSidebar.activityFeed.taskForm.tasksAddTaskFormCancelLabel",
    "defaultMessage": "Cancel"
  },
  taskAnyCheckboxLabel: {
    "id": "be.contentSidebar.activityFeed.taskForm.taskAnyCheckboxLabel",
    "defaultMessage": "Only one assignee is required to complete this task"
  },
  taskAnyInfoTooltip: {
    "id": "be.contentSidebar.activityFeed.taskForm.taskAnyInfoTooltip",
    "defaultMessage": "By default, all assignees are required to take action before a task is complete. Selecting this option will require only one assignee to complete this task."
  },
  taskAnyInfoGroupTooltip: {
    "id": "be.contentSidebar.activityFeed.taskForm.taskAnyInfoGroupTooltip",
    "defaultMessage": "Selecting this option will require only one assignee to complete this task. This will include assignees across all groups."
  },
  taskCreateGroupLabel: {
    "id": "be.contentSidebar.activityFeed.taskForm.taskCreateGroupLabel",
    "defaultMessage": "Group"
  }
});
export default messages;
//# sourceMappingURL=messages.js.map