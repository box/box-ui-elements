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
    showReplies: {
        id: 'be.activitySidebar.activityFeed.showReplies',
        defaultMessage: 'See {repliesToLoadCount, plural, one {# reply} other {# replies}}',
        description: 'Text to show to get more replies of comment or annotation',
    },
    hideReplies: {
        id: 'be.activitySidebar.activityFeed.hideReplies',
        defaultMessage: 'Hide replies',
        description: 'Text to show to hide more replies of comment or annotation',
    },
    reply: {
        id: 'be.activitySidebar.activityFeed.reply',
        defaultMessage: 'Reply',
        description: 'Text to show on button to start replying to comment',
    },
    replyInThread: {
        id: 'be.activitySidebar.activityFeed.replyInThread',
        defaultMessage: 'Reply in thread',
        description: 'Text to show on reply form input placeholder',
    },
});

export default messages;
