/**
 * @flow
 * @file i18n messages
 * @author Box
 */

import { defineMessages } from 'react-intl';

const messages = defineMessages({
    commentCancel: {
        id: 'be.comment.commentForm.commentCancel',
        defaultMessage: 'Cancel',
        description: 'Text for cancel button',
    },
    commentPost: {
        id: 'be.comment.commentForm.commentPost',
        defaultMessage: 'Post',
        description: 'Text for post button',
    },
    commentWrite: {
        id: 'be.comment.commentForm.commentWrite',
        defaultMessage: 'Write a comment',
        description: 'Placeholder for comment input',
    },
    atMentionTip: {
        id: 'be.comment.commentForm.atMentionTip',
        defaultMessage: '@mention users to notify them.',
        description: 'Mentioning call to action displayed below the comment input',
    },
});

export default messages;
