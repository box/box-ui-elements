// @flow
import * as React from 'react';
import { select, text } from '@storybook/addon-knobs';
import { IntlProvider } from 'react-intl';
import { DEFAULT_HOSTNAME_API, TYPE_FILE, TYPE_FOLDER } from '../../../constants';
import Button from '../../../components/button/Button';
import ContentSharingLauncher from '../ContentSharingLauncher';
import notes from './ContentSharing.stories.md';

export const withModal = () => {
    const apiHost = text('API Host', DEFAULT_HOSTNAME_API);
    const itemID = text('Item ID');
    const itemType = select('Item Type', [TYPE_FILE, TYPE_FOLDER], TYPE_FILE);
    const token = text('Access Token');
    const customButton = <Button>&#10047; Launch ContentSharing &#10047;</Button>;
    return (
        <>
            <p>
                Update the values in the Knobs section below to view the ContentSharing UI Element. The API will be
                instantiated on load, but ContentSharing will not be instantiated until the button is clicked.
            </p>
            <IntlProvider locale="en">
                <ContentSharingLauncher
                    apiHost={apiHost}
                    customButton={customButton}
                    displayInModal
                    itemID={itemID}
                    itemType={itemType}
                    language="en"
                    token={token}
                />
            </IntlProvider>
        </>
    );
};

export const withoutModal = () => {
    const apiHost = text('API Host', DEFAULT_HOSTNAME_API);
    const itemID = text('Item ID');
    const itemType = select('Item Type', [TYPE_FILE, TYPE_FOLDER], TYPE_FILE);
    const token = text('Access Token');
    return (
        <>
            <p>Update the values in the Knobs section below to view the ContentSharing UI Element.</p>
            <IntlProvider locale="en">
                <ContentSharingLauncher
                    apiHost={apiHost}
                    displayInModal={false}
                    itemID={itemID}
                    itemType={itemType}
                    language="en"
                    token={token}
                />
            </IntlProvider>
        </>
    );
};

export default {
    title: 'Elements|ContentSharing',
    component: ContentSharingLauncher,
    parameters: {
        notes,
    },
};
