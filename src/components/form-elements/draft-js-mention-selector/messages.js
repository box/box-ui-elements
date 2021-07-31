// @flow
import { defineMessages } from 'react-intl';

const messages = defineMessages({
    startMention: {
        defaultMessage: 'Mention someone to notify them',
        description: 'Message to display when a user triggers a mention',
        id: 'boxui.draftjs.mentionSelector.startMention',
    },
    noUsersFound: {
        defaultMessage: 'No users found',
        description: 'Message for screenReader users when trying to mention a user but there are no matches',
        id: 'boxui.draftjs.mentionSelector.noUsersFound',
    },
    usersFound: {
        defaultMessage: '{usersFound} users found',
        description: 'Message for screenReader users when a certain number of users is being mentioned',
        id: 'boxui.draftjs.mentionSelector.usersFound',
    },
});

export default messages;
