/**
 * 
 * @file i18n messages
 * @author Box
 */

import { defineMessages } from 'react-intl';
const messages = defineMessages({
  appActivityDeleteErrorMessage: {
    "id": "be.api.appActivityDeleteErrorMessage",
    "defaultMessage": "There was an error deleting this item."
  },
  commentCreateErrorMessage: {
    "id": "be.api.commentCreateErrorMessage",
    "defaultMessage": "There was an error creating this comment."
  },
  commentCreateConflictMessage: {
    "id": "be.api.commentCreateConflictMessage",
    "defaultMessage": "This comment already exists."
  },
  commentDeleteErrorMessage: {
    "id": "be.api.commentDeleteErrorMessage",
    "defaultMessage": "There was an error deleting this comment."
  },
  commentUpdateErrorMessage: {
    "id": "be.api.commentUpdateErrorMessage",
    "defaultMessage": "This comment could not be modified."
  },
  repliesFetchErrorMessage: {
    "id": "be.api.repliesFetchErrorMessage",
    "defaultMessage": "The replies to this comment could not be loaded."
  },
  taskActionErrorTitle: {
    "id": "be.api.taskActionErrorTitle",
    "defaultMessage": "Error"
  },
  taskApproveErrorMessage: {
    "id": "be.api.taskApproveErrorMessage",
    "defaultMessage": "An error has occurred while approving this task. Please refresh the page and try again."
  },
  taskCompleteErrorMessage: {
    "id": "be.api.taskCompleteErrorMessage",
    "defaultMessage": "An error has occurred while completing this task. Please refresh the page and try again."
  },
  taskRejectErrorMessage: {
    "id": "be.api.taskRejectErrorMessage",
    "defaultMessage": "An error has occurred while rejecting this task. Please refresh the page and try again."
  },
  taskDeleteErrorMessage: {
    "id": "be.api.taskDeleteErrorMessage",
    "defaultMessage": "There was an error while deleting this task. Please refresh the page and try again."
  },
  taskCreateErrorMessage: {
    "id": "be.api.taskCreateErrorMessage",
    "defaultMessage": "An error occurred while creating this task. Please try again."
  },
  taskGroupExceedsLimitWarningMessage: {
    "id": "be.api.taskGroupExceedsWarningTitle",
    "defaultMessage": "One or more groups can not receive this task as a group size cannot exceed the limit of {max} assignees per group."
  }
});
export default messages;
//# sourceMappingURL=messages.js.map