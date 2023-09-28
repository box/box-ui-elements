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
    commentResolveMenuItem: {
        id: 'be.contentSidebar.activityFeed.comment.commentResolveMenuItem',
        defaultMessage: 'Resolve',
        description: 'Text to show on menu item to resolve the comment',
    },
    commentUnresolveMenuItem: {
        id: 'be.contentSidebar.activityFeed.comment.commentUnresolveMenuItem',
        defaultMessage: 'Unresolve',
        description: 'Text to show on menu item to unresolve the comment',
    },
    reply: {
        id: 'be.contentSidebar.activityFeed.comment.reply',
        defaultMessage: 'Reply',
        description: 'Text to show on button to start replying to comment',
    },
    replyInThread: {
        id: 'be.contentSidebar.activityFeed.comment.replyInThread',
        defaultMessage: 'Reply in thread',
        description: 'Text to show on reply form input placeholder',
    },
    hideReplies: {
        id: 'be.contentSidebar.activityFeed.comment.hideReplies',
        defaultMessage: 'Hide replies',
        description: 'Text to show to hide more replies of comment or annotation',
    },
    showReplies: {
        id: 'be.contentSidebar.activityFeed.comment.showReplies',
        defaultMessage: 'See {repliesToLoadCount, plural, one {# reply} other {# replies}}',
        description: 'Text to show to get more replies of comment or annotation',
    },
    inlineCommentAnnotationIconTitle: {
        id: 'be.contentSidebar.activityFeed.comment.inlineCommentAnnotationIconTitle',
        defaultMessage: 'Inline Comment',
        description: 'Text for aria label of Inline comment circle type icon',
    },
});

export default messages;
