// @flow
import * as React from 'react';
import { select, text } from '@storybook/addon-knobs';
import { IntlProvider } from 'react-intl';
import { DEFAULT_HOSTNAME_API, TYPE_FILE, TYPE_FOLDER } from '../../../constants';
import Button from '../../../components/button/Button';
import ContentSharing from '../ContentSharing';
import notes from './ContentSharing.stories.md';

export const withModal = () => {
    const apiHost = text('API Host', DEFAULT_HOSTNAME_API);
    const itemID = text('Item ID');
    const itemType = select('Item Type', [TYPE_FILE, TYPE_FOLDER], TYPE_FILE);
    const token = text('Access Token');
    return (
        <>
            <p>
                Update the values in the Knobs section below to view the ContentSharing UI Element. The internal
                SharingModal will appear when valid values have been entered.
            </p>
            <IntlProvider locale="en">
                <ContentSharing
                    apiHost={apiHost}
                    config={{ showEmailSharedLinkForm: false }}
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

export const withModalAndCustomButton = () => {
    const apiHost = text('API Host', DEFAULT_HOSTNAME_API);
    const itemID = text('Item ID');
    const itemType = select('Item Type', [TYPE_FILE, TYPE_FOLDER], TYPE_FILE);
    const token = text('Access Token');
    const customButton = <Button>&#10047; Launch ContentSharing &#10047;</Button>;
    return (
        <>
            <p>
                Update the values in the Knobs section below to view the ContentSharing UI Element. The API will be
                instantiated on load, but the internal SharingModal will not be instantiated until the button is
                clicked.
            </p>
            <IntlProvider locale="en">
                <ContentSharing
                    apiHost={apiHost}
                    config={{ showEmailSharedLinkForm: false }}
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
            <p>
                Update the values in the Knobs section below to view the ContentSharing UI Element. The internal
                SharingModal will appear as a form within this page when valid values are entered.
            </p>
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
        </>
    );
};

export default {
    title: 'Elements|ContentSharing',
    component: ContentSharing,
    parameters: {
        notes,
    },
};
