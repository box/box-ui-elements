// @flow
import * as React from 'react';
import { IntlProvider } from 'react-intl';
import { number } from '@storybook/addon-knobs';

import SecurityCloudGame from '../SecurityCloudGame';
import notes from './SecurityCloudGame.stories.md';

export const Basic = () => {
    return (
        <IntlProvider locale="en">
            <SecurityCloudGame height={number('height', 500)} width={number('width', 500)} />
        </IntlProvider>
    );
};

export default {
    title: 'Features|SecurityCloudGame',
    component: SecurityCloudGame,
    parameters: {
        notes,
    },
};
