// @flow
import * as React from 'react';
import { select, text } from '@storybook/addon-knobs';
import { IntlProvider } from 'react-intl';
import { TYPE_FILE, TYPE_FOLDER } from '../../../constants';
import UnifiedShareModalElement from '../UnifiedShareModalElement';
import notes from './UnifiedShareModalElement.stories.md';

export const basic = () => {
    const itemID = text('Item ID', global.FILE_ID);
    const itemType = select('Item Type', [TYPE_FILE, TYPE_FOLDER], TYPE_FILE);
    const token = text('Access Token', global.TOKEN);
    return (
        <IntlProvider locale="en">
            <UnifiedShareModalElement itemID={itemID} itemType={itemType} token={token} />
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
