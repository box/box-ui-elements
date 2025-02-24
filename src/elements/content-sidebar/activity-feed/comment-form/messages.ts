/**
 * @file i18n messages
 * @author Box
 */

import { defineMessages } from 'react-intl';

const messages = defineMessages({
    commentCancel: {
        id: 'be.contentSidebar.activityFeed.commentForm.commentCancel',
        defaultMessage: 'Cancel',
        description: 'Text for cancel button',
    },
    commentLabel: {
        id: 'be.contentSidebar.activityFeed.commentForm.commentLabel',
        defaultMessage: 'Write a comment',
        description: 'Accessible label for comment input field',
    },
    commentPost: {
        id: 'be.contentSidebar.activityFeed.commentForm.commentPost',
        defaultMessage: 'Post',
        description: 'Text for post button',
    },
    commentWrite: {
        id: 'be.contentSidebar.activityFeed.commentForm.commentWrite',
        defaultMessage: 'Write a comment',
        description: 'Placeholder for comment input',
    },
    approvalAddAssignee: {
        id: 'be.contentSidebar.activityFeed.commentForm.approvalAddAssignee',
        defaultMessage: 'Add an assignee',
        description: 'Placeholder for approvers input',
    },
    approvalAddTask: {
        id: 'be.contentSidebar.activityFeed.commentForm.approvalAddTask',
        defaultMessage: 'Add Task',
        description: 'Label for checkbox to add approvers to a comment',
    },
    approvalAddTaskTooltip: {
        id: 'be.contentSidebar.activityFeed.commentForm.approvalAddTaskTooltip',
        defaultMessage:
            'Assigning a task to someone will send them a notification with the message in the comment box and allow them to approve or deny.',
        description: 'Tooltip text for checkbox to add approvers to a comment',
    },
    approvalAssignees: {
        id: 'be.contentSidebar.activityFeed.commentForm.approvalAssignees',
        defaultMessage: 'Assignees',
        description: 'Title for assignees input',
    },
    approvalDueDate: {
        id: 'be.contentSidebar.activityFeed.commentForm.approvalDueDate',
        defaultMessage: 'Due Date',
        description: 'Title for approvers due date input',
    },
    approvalSelectDate: {
        id: 'be.contentSidebar.activityFeed.commentForm.approvalSelectDate',
        defaultMessage: 'Select a date',
        description: 'Placeholder for due date input',
    },
    atMentionTip: {
        id: 'be.contentSidebar.activityFeed.commentForm.atMentionTip',
        defaultMessage: '@mention users to notify them.',
        description: 'Mentioning call to action displayed below the comment input',
    },
    atMentionTipDescription: {
        id: 'be.contentSidebar.activityFeed.commentForm.atMentionTipDescription',
        defaultMessage:
            'Use the @ symbol to mention users and use the up and down arrow keys to scroll through autocomplete suggestions.',
        description: 'Mentioning call to action detailed description for screen reader users',
    },
});

export default messages;
