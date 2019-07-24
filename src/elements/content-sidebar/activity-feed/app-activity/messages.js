/**
 * @flow
 * @file i18n messages
 * @author Box
 */

import { defineMessages } from 'react-intl';

const messages = defineMessages({
    appActivityDeleteMenuItem: {
        id: 'be.appActivity.deleteMenuItem',
        defaultMessage: 'Delete',
        description: 'Text to display in the delete app activity submit button',
    },
    appActivityDeletePrompt: {
        id: 'be.appActivity.deletePrompt',
        defaultMessage: 'Are you sure you want to permanently delete this app activity?',
        description: 'Confirmation prompt text to delete app activity',
    },
    appActivityAltIcon: {
        id: 'be.appActivity.altIcon',
        defaultMessage: '{appActivityName} Icon',
        description: 'Alt message if app activity icon is missing or cannot load',
    },
});

export default messages;
