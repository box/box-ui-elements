/**
 * @flow
 * @file i18n messages
 * @author Box
 */

import { defineMessages } from 'react-intl';

const messages = defineMessages({
    blockedByShieldAccessPolicy: {
        id: 'be.additionalTab.blockedByShieldAccessPolicy',
        defaultMessage: 'Use of this app has been disabled by the applied access policy',
        description: 'Text to display when app is disabled by applied access policy',
    },
});

export default messages;
