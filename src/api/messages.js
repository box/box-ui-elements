/**
 * @flow
 * @file i18n messages
 * @author Box
 */

import { defineMessages } from 'react-intl';

const messages = defineMessages({
    appActivityDeleteErrorMessage: {
        id: 'be.api.appActivityDeleteErrorMessage',
        description: 'Error message when an app activity deletion fails',
        defaultMessage: 'There was an error deleting this item.',
    },
    commentCreateErrorMessage: {
        id: 'be.api.commentCreateErrorMessage',
        description: 'Error message when a comment creation fails',
        defaultMessage: 'There was an error creating this comment.',
    },
    commentCreateConflictMessage: {
        id: 'be.api.commentCreateConflictMessage',
        description: 'Error message when a comment creation fails due to a conflict',
        defaultMessage: 'This comment already exists.',
    },
    commentDeleteErrorMessage: {
        id: 'be.api.commentDeleteErrorMessage',
        description: 'Error message when a comment deletion fails',
        defaultMessage: 'There was an error deleting this comment.',
    },
    taskActionErrorTitle: {
        id: 'be.api.taskActionErrorTitle',
        description: 'Title shown when an error occurs performing an action on a task',
        defaultMessage: 'Error',
    },
    taskApproveErrorMessage: {
        id: 'be.api.taskApproveErrorMessage',
        description: 'Error message when approving a task fails',
        defaultMessage: 'An error has occurred while approving this task. Please refresh the page and try again.',
    },
    taskCompleteErrorMessage: {
        id: 'be.api.taskCompleteErrorMessage',
        description: 'Error message when completing a task fails',
        defaultMessage: 'An error has occurred while completing this task. Please refresh the page and try again.',
    },
    taskRejectErrorMessage: {
        id: 'be.api.taskRejectErrorMessage',
        description: 'Error message when rejecting a task fails',
        defaultMessage: 'An error has occurred while rejecting this task. Please refresh the page and try again.',
    },
    taskDeleteErrorMessage: {
        id: 'be.api.taskDeleteErrorMessage',
        description: 'Error message when a task deletion fails',
        defaultMessage: 'There was an error while deleting this task. Please refresh the page and try again.',
    },
    taskCreateErrorMessage: {
        id: 'be.api.taskCreateErrorMessage',
        description: 'Error message when a task creation fails',
        defaultMessage: 'An error occurred while creating this task. Please try again.',
    },
});

export default messages;
