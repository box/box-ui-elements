// @flow
import * as React from 'react';
import { select, text } from '@storybook/addon-knobs';
import { IntlProvider } from 'react-intl';
import { DEFAULT_HOSTNAME_API, TYPE_FILE, TYPE_FOLDER } from '../../../constants';
import ContentSharing from '../ContentSharing';
import notes from './ContentSharing.stories.md';

export const basic = () => {
    const apiHost = text('API Host', DEFAULT_HOSTNAME_API);
    const itemID = text('Item ID');
    const itemType = select('Item Type', [TYPE_FILE, TYPE_FOLDER], TYPE_FILE);
    const token = text('Access Token');
    return (
        <IntlProvider locale="en">
            <ContentSharing
                apiHost={apiHost}
                displayInModal={false}
                itemID={itemID}
                itemType={itemType}
                language="en"
                token={token}
            />
        </IntlProvider>
    );
};

export default {
    title: 'Elements|ContentSharing',
    component: ContentSharing,
    parameters: {
        notes,
    },
};
