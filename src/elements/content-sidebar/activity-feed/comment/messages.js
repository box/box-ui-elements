/**
 * @flow
 * @file i18n messages
 * @author Box
 */

import { defineMessages } from 'react-intl';

const messages = defineMessages({
    taskDeleteMenuItem: {
        id: 'be.contentSidebar.activityFeed.comment.taskDeleteMenuItem',
        defaultMessage: 'Delete task',
        description: 'Text to show on menu item to delete task',
    },
    taskEditMenuItem: {
        id: 'be.contentSidebar.activityFeed.comment.taskEditMenuItem',
        defaultMessage: 'Modify task',
        description: 'Text to show on menu item to edit task',
    },
    taskDeletePrompt: {
        id: 'be.contentSidebar.activityFeed.comment.taskDeletePrompt',
        defaultMessage: 'Are you sure you want to permanently delete this task?',
        description: 'Confirmation prompt text to delete task',
    },
    commentDeletePrompt: {
        id: 'be.contentSidebar.activityFeed.comment.commentDeletePrompt',
        defaultMessage: 'Delete comment?',
        description: 'Confirmation prompt text to delete comment',
    },
    commentShowOriginal: {
        id: 'be.contentSidebar.activityFeed.comment.commentShowOriginal',
        defaultMessage: 'Show Original',
        description: 'Show original button for showing original comment',
    },
    commentTranslate: {
        id: 'be.contentSidebar.activityFeed.comment.commentTranslate',
        defaultMessage: 'Translate',
        description: 'Translate button for translating comment',
    },
    commentPostedFullDateTime: {
        id: 'be.contentSidebar.activityFeed.comment.commentPostedFullDateTime',
        defaultMessage: '{time, date, full} at {time, time, short}',
        description: 'Comment posted full date time for title',
    },
});

export default messages;
