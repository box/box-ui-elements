// @flow
/* eslint-disable no-console */
import * as React from 'react';
import { IntlProvider } from 'react-intl';

import UnifiedShareModalElement from '../UnifiedShareModalElement';
import notes from './UnifiedShareModalElement.stories.md';

export const basic = () => (
    <IntlProvider locale="en">
        <UnifiedShareModalElement
            itemID={process.env.ITEM_ID}
            itemType={process.env.ITEM_TYPE}
            token={process.env.TOKEN}
        />
    </IntlProvider>
);

export default {
    title: 'Elements|UnifiedShareModal Element',
    component: UnifiedShareModalElement,
    parameters: {
        notes,
    },
};
