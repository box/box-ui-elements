import { defineMessages } from 'react-intl';

const messages = defineMessages({
    success: {
        defaultMessage: 'Success!',
        description: 'Success message shown when a user successfully drags the cloud into position.',
        id: 'boxui.securityCloudGame.success',
    },
    instructions: {
        defaultMessage: 'For security purposes, please drag the white cloud into the dark cloud.',
        description: 'Instructional message displayed on the embed widget security drag-drop game',
        id: 'boxui.securityCloudGame.instructions',
    },
});

export default messages;
