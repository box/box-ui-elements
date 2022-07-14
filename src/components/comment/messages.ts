/**
 * @file i18n messages
 * @author Box
 */

import { defineMessages } from 'react-intl';

const messages = defineMessages({
    commentDeleteMenuItem: {
        id: 'boxui.comment.commentDeleteMenuItem',
        defaultMessage: 'Delete',
        description: 'Text to show on menu item to delete comment',
    },
    commentDeletePrompt: {
        id: 'boxui.comment.commentDeletePrompt',
        defaultMessage: 'Are you sure you want to permanently delete this comment?',
        description: 'Confirmation prompt text to delete comment',
    },
    commentDeleteThreadPrompt: {
        id: 'boxui.comment.commentDeleteThreadPrompt',
        defaultMessage: 'Are you sure you want to permanently delete this thread?',
        description: 'Confirmation prompt text to delete thread of comments',
    },
    commentEditMenuItem: {
        id: 'boxui.comment.commentEditMenuItem',
        defaultMessage: 'Modify',
        description: 'Text to show on menu item to edit comment',
    },
    commentResolveMenuItem: {
        id: 'boxui.comment.commentResolveMenuItem',
        defaultMessage: 'Resolve',
        description: 'Text to show on menu item to resolve comment',
    },
});

export default messages;
