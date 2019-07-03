/**
 * @flow
 * @file i18n messages
 * @author Box
 */

import { defineMessages } from 'react-intl';

const messages = defineMessages({
    rejectedAssignment: {
        id: 'be.contentSidebar.activityFeed.task.rejectedAssignment',
        defaultMessage: 'Rejected',
        description: 'Title for x icon indicating someone rejected a task',
    },
    taskApprove: {
        id: 'be.contentSidebar.activityFeed.task.taskApprove',
        defaultMessage: 'Complete',
        description: 'Approve option for a task',
    },
    taskReject: {
        id: 'be.contentSidebar.activityFeed.task.taskReject',
        defaultMessage: 'Decline',
        description: 'Reject option for a task',
    },
    tasksForApproval: {
        id: 'be.contentSidebar.activityFeed.task.tasksForApproval',
        defaultMessage: 'Tasks',
        description: 'Tasks for approval',
    },
    taskDueDate: {
        id: 'be.contentSidebar.activityFeed.task.taskDueDate',
        defaultMessage: 'Due',
        description: 'Due date for a task',
    },
});

export default messages;
