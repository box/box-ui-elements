/**
 * @flow
 * @file i18n messages
 * @author Box
 */

import { defineMessages } from 'react-intl';

const messages = defineMessages({
    annotationMissingError: {
        id: 'be.activitySidebar.activityFeed.annotationMissingError',
        defaultMessage: 'This comment no longer exists',
        description: 'Text to show when an annotation activity no longer exists',
    },
    feedInlineErrorTitle: {
        id: 'be.activitySidebar.activityFeed.feedInlineErrorTitle',
        defaultMessage: 'Error',
        description: 'Error title',
    },
    taskMissingError: {
        id: 'be.activitySidebar.activityFeed.taskMissingError',
        defaultMessage: 'This task no longer exists',
        description: 'Text to show when a task no longer exists',
    },
    commentMissingError: {
        id: 'be.activitySidebar.activityFeed.commentMissingError',
        defaultMessage: 'This comment no longer exists',
        description: 'Text to show when comment no longer exists',
    },
});

export default messages;
