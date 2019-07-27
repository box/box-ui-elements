/**
 * @flow
 * @file i18n messages
 * @author Box
 */

import { defineMessages } from 'react-intl';

const messages = defineMessages({
    commentDeleteMenuItem: {
        id: 'be.contentSidebar.activityFeed.comment.commentDeleteMenuItem',
        defaultMessage: 'Delete',
        description: 'Text to show on menu item to delete comment',
    },
    commentDeletePrompt: {
        id: 'be.contentSidebar.activityFeed.comment.commentDeletePrompt',
        defaultMessage: 'Are you sure you want to permanently delete this comment?',
        description: 'Confirmation prompt text to delete comment',
    },
    commentEditMenuItem: {
        id: 'be.contentSidebar.activityFeed.comment.commentEditMenuItem',
        defaultMessage: 'Modify',
        description: 'Text to show on menu item to edit comment',
    },
    commentPostedFullDateTime: {
        id: 'be.contentSidebar.activityFeed.comment.commentPostedFullDateTime',
        defaultMessage: '{time, date, full} at {time, time, short}',
        description: 'Comment posted full date time for title',
    },
});

export default messages;
