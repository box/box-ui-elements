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
});

export default messages;
