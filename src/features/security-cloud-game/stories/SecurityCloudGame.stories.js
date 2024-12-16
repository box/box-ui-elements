// @flow
import * as React from 'react';

import SecurityCloudGame from '../SecurityCloudGame';
import notes from './SecurityCloudGame.stories.md';

export const Basic = () => {
    return <SecurityCloudGame height={500} width={500} />;
};

export default {
    title: 'Features/SecurityCloudGame',
    component: SecurityCloudGame,
    parameters: {
        notes,
        chromatic: {
            disableSnapshot: true,
        },
    },
};
