/**
 * @flow
 * @file i18n messages
 * @author Box
 */

import { defineMessages } from 'react-intl';

const messages = defineMessages({
    taskDeletePrompt: {
        id: 'be.contentSidebar.activityFeed.taskDeletePrompt',
        defaultMessage: 'Are you sure you want to permanently delete this task?',
        description: 'Confirmation prompt text to delete task',
    },
});

export default messages;
