// @flow
import * as React from 'react';
import { select, text } from '@storybook/addon-knobs';
import { IntlProvider } from 'react-intl';
import { DEFAULT_HOSTNAME_API, TYPE_FILE, TYPE_FOLDER } from '../../../constants';
import UnifiedShareModalElement from '../UnifiedShareModalElement';
import notes from './UnifiedShareModalElement.stories.md';

export const basic = () => {
    const apiHost = text('API Host', DEFAULT_HOSTNAME_API);
    const itemID = text('Item ID', global.FILE_ID);
    const itemType = select('Item Type', [TYPE_FILE, TYPE_FOLDER], TYPE_FILE);
    const token = text('Access Token', global.TOKEN);
    return (
        <IntlProvider locale="en">
            <UnifiedShareModalElement
                apiHost={apiHost}
                itemID={itemID}
                itemType={itemType}
                language="en"
                token={token}
            />
        </IntlProvider>
    );
};

export default {
    title: 'Elements|UnifiedShareModal Element',
    component: UnifiedShareModalElement,
    parameters: {
        notes,
    },
};
