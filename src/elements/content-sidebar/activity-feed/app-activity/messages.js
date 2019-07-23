/**
 * @flow
 * @file i18n messages
 * @author Box
 */

import { defineMessages } from 'react-intl';

const messages = defineMessages({
    appActivityDeleteErrorMessage: {
        id: 'be.appActivityDeleteErrorMessage',
        description: 'Error message when an app activity deletion fails',
        defaultMessage: 'There was an error deleting this item.',
    },
    appActivityCreatedAtFullDateTime: {
        id: 'be.appActivityCreatedAtFullDateTime',
        defaultMessage: '{time, date, full} at {time, time, short}',
        description: 'App Activity created at full date time for title',
    },
    appActivityDeletePrompt: {
        id: 'be.appActivityDeletePrompt',
        defaultMessage: 'Are you sure you want to permanently delete this app activity?',
        description: 'Confirmation prompt text to delete app activity',
    },
    appActivityAltIcon: {
        id: 'be.appActivityAltIcon',
        defaultMessage: '{appActivityName} Icon',
        description: 'Alt message if app activity icon is missing or cannot load',
    },
});

export default messages;
