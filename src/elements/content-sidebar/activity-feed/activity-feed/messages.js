/**
 * @flow
 * @file i18n messages
 * @author Box
 */

import { defineMessages } from 'react-intl';

const messages = defineMessages({
    feedInlineErrorTitle: {
        id: 'be.activitySidebar.activityFeed.feedInlineErrorTitle',
        defaultMessage: 'Error',
        description: 'Error title',
    },
    taskDelete: {
        id: 'be.activitySidebar.activityFeed.taskDelete',
        defaultMessage: 'This task no longer exists',
        description: 'Text to show when a task no longer exists',
    },
    commentDelete: {
        id: 'be.activitySidebar.activityFeed.commentDelete',
        defaultMessage: 'This comment no longer exists',
        description: 'Text to show when comment no longer exists',
    },
});

export default messages;
