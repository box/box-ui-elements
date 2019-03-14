/**
 * @flow
 * @file i18n messages for InlineDelete component
 * @author Box
 */

import { defineMessages } from 'react-intl';

const messages: { [string]: MessageDescriptor } = defineMessages({
    deleteLabel: {
        id: 'be.deleteLabel',
        defaultMessage: 'Delete',
        description: 'Aria label for button to delete a comment, task, or app activity',
    },
    inlineDeleteCancel: {
        id: 'be.inlineDeleteCancel',
        defaultMessage: 'No',
        description: 'Button text to cancel inline item deletion',
    },
    inlineDeleteConfirm: {
        id: 'be.inlineDeleteConfirm',
        defaultMessage: 'Yes',
        description: 'Button text to confirm inline item deletion',
    },
});

export default messages;
