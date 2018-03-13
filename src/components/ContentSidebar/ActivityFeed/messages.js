import { defineMessages } from 'react-intl';

const messages = defineMessages({
    approvalAddAssignee: {
        defaultMessage: 'Add an assignee',
        description: 'Placeholder for approvers input',
        id: 'boxui.activityFeed.approvalAddAssignee'
    },
    approvalAddTask: {
        defaultMessage: 'Add Task',
        description: 'Label for checkbox to add approvers to a comment',
        id: 'boxui.activityFeed.approvalAddTask'
    },
    approvalAddTaskTooltip: {
        defaultMessage:
            'Assigning a task to someone will send them a notification with the message in the comment box and allow them to approve or deny.',
        description: 'Tooltip text for checkbox to add approvers to a comment',
        id: 'boxui.activityFeed.approvalAddTaskTooltip'
    },
    approvalAssignees: {
        defaultMessage: 'Assignees',
        description: 'Title for assignees input',
        id: 'boxui.activityFeed.approvalAssignees'
    },
    approvalDueDate: {
        defaultMessage: 'Due Date',
        description: 'Title for approvers due date input',
        id: 'boxui.activityFeed.approvalDueDate'
    },
    approvalSelectDate: {
        defaultMessage: 'Select a date',
        description: 'Placeholder for due date input',
        id: 'boxui.activityFeed.approvalSelectDate'
    },
    atMentionTip: {
        defaultMessage: '@mention users to notify them.',
        description: 'Mentioning call to action displayed below the comment input',
        id: 'boxui.activityFeed.atMentionTip'
    },
    commentCancel: {
        defaultMessage: 'Cancel',
        description: 'Text for cancel button',
        id: 'boxui.activityFeed.commentCancel'
    },
    commentDeleteCancel: {
        defaultMessage: 'No',
        description: 'Button text to cancel comment deletion',
        id: 'boxui.activityFeed.commentDeleteCancel'
    },
    taskDeletePrompt: {
        defaultMessage: 'Delete task?',
        description: 'Confirmation prompt text to delete task',
        id: 'boxui.activityFeed.taskDeletePrompt'
    },
    commentDeleteConfirm: {
        defaultMessage: 'Yes',
        description: 'Button text to confirm comment deletion',
        id: 'boxui.activityFeed.commentDeleteConfirm'
    },
    commentDeletePrompt: {
        defaultMessage: 'Delete comment?',
        description: 'Confirmation prompt text to delete comment',
        id: 'boxui.activityFeed.commentDeletePrompt'
    },
    commentPost: {
        defaultMessage: 'Post',
        description: 'Text for post button',
        id: 'boxui.activityFeed.commentPost'
    },
    commentShowOriginal: {
        defaultMessage: 'Show Original',
        description: 'Show original button for showing original comment',
        id: 'boxui.activityFeed.commentShowOriginal'
    },
    commentTranslate: {
        defaultMessage: 'Translate',
        description: 'Translate button for translating comment',
        id: 'boxui.activityFeed.commentTranslate'
    },
    commentWrite: {
        defaultMessage: 'Write a comment',
        description: 'Placeholder for comment input',
        id: 'boxui.activityFeed.commentWrite'
    },
    commentPostedFullDateTime: {
        defaultMessage: '{time, date, full} at {time, time, short}',
        description: 'Comment posted full date time for title',
        id: 'boxui.activityFeed.commentPostedFullDateTime'
    },
    completedAssignment: {
        defaultMessage: 'Completed',
        description: 'Title for checkmark icon indicating someone completed a task',
        id: 'boxui.activityFeed.completedAssignment'
    },
    deleteLabel: {
        defaultMessage: 'Delete',
        description: 'Aria label for button to delete a comment or task',
        id: 'boxui.activityFeed.deleteLabel'
    },
    editLabel: {
        defaultMessage: 'Edit',
        description: 'Aria label for button to edit a comment or task',
        id: 'boxui.activityFeed.editLabel'
    },
    getVersionInfo: {
        defaultMessage: 'Get version information',
        description: 'Aria label for button to get information about a file\'s versions',
        id: 'boxui.activityFeed.getVersionInfo'
    },
    keywordsApplied: {
        defaultMessage: 'Keywords were applied',
        description: 'Message displayed in the activity feed for when image keyword search applies keywords',
        id: 'boxui.activityFeed.keywordsAppliedList'
    },
    keywordsList: {
        defaultMessage: 'Keywords: { words }',
        description: 'Label for a list of keywords. {words} are the list of keywords.',
        id: 'boxui.activityFeed.keywordsList'
    },
    noActivity: {
        defaultMessage: 'No Activity Yet',
        description: 'Message displayed in an empty activity feed',
        id: 'boxui.activityFeed.noActivity'
    },
    noActivityCommentPrompt: {
        defaultMessage: 'Comment and @mention people to notify them.',
        description: 'Message shown in ',
        id: 'boxui.activityFeed.noActivityCommentPrompt'
    },
    rejectedAssignment: {
        defaultMessage: 'Rejected',
        description: 'Title for x icon indicating someone rejected a task',
        id: 'boxui.activityFeed.rejectedAssignment'
    },
    taskApprove: {
        defaultMessage: 'Complete',
        description: 'Approve option for a task',
        id: 'boxui.activityFeed.taskApprove'
    },
    taskDueDate: {
        defaultMessage: 'Due',
        description: 'Due date for a task',
        id: 'boxui.activityFeed.taskDueDate'
    },
    tasksForApproval: {
        defaultMessage: 'Tasks',
        description: 'Tasks for approval',
        id: 'boxui.activityFeed.tasksForApproval'
    },
    taskReject: {
        defaultMessage: 'Decline',
        description: 'Reject option for a task',
        id: 'boxui.activityFeed.taskReject'
    },
    versionDeleted: {
        defaultMessage: '{ name } deleted version { versionNumber }',
        description:
            'Message displayed in the activity feed for a deleted version. {name} is the user who performed the action. { versionNumber } is the file version string.',
        id: 'boxui.activityFeed.versionDeleted'
    },
    versionRestored: {
        defaultMessage: '{ name } restored version { versionNumber }',
        description:
            'Message displayed in the activity feed for a restored version. {name} is the user who performed the action. { versionNumber } is the file version string.',
        id: 'boxui.activityFeed.versionRestored'
    },
    versionMultipleUsersUploaded: {
        defaultMessage: '{ numberOfCollaborators } collaborators uploaded versions { versions }',
        description:
            'Message displayed in the activity feed to represent the range of versions uploaded by multiple users. { numberOfCollaborators } is a number and { versions } is a range of versions.',
        id: 'boxui.activityFeed.versionMultipleUsersUploaded'
    },
    versionTooManyVersions: {
        defaultMessage: 'Multiple versions of this file',
        description: 'Message displayed in the activity feed when we have too many versions to display',
        id: 'boxui.activityFeed.versionTooManyVersions'
    },
    versionUploadCollapsed: {
        defaultMessage: '{ name } uploaded versions { versions }',
        description:
            'Message displayed in the activity feed to represent the range of versions uploaded by a single user. { name } is the user who uploaded. { versions } is a range of versions.',
        id: 'boxui.activityFeed.versionUploadCollapsed'
    },
    versionUploaded: {
        defaultMessage: '{ name } uploaded version { versionNumber }',
        description:
            'Message displayed in the activity feed for a newly uploaded version. {name} is the user who performed the action. { versionNumber } is the file version string.',
        id: 'boxui.activityFeed.versionUploaded'
    }
});

export default messages;
