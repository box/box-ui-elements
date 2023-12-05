// @flow
import * as React from 'react';
import { DEFAULT_HOSTNAME_API, TYPE_FILE, TYPE_FOLDER } from '../../../constants';
import Button from '../../../components/button/Button';
import ContentSharing from '../ContentSharing';

export const basic = {};

export const withCustomButton = {
    args: {
        displayInModal: true,
        customButton: <Button>&#10047; Launch ContentSharing &#10047;</Button>,
    },
};

export default {
    title: 'Elements/ContentSharing',
    component: ContentSharing,
    args: {
        apiHost: DEFAULT_HOSTNAME_API,
        config: { showEmailSharedLinkForm: false, showInviteCollaboratorMessageSection: false },
        displayInModal: false,
        itemType: TYPE_FILE,
    },
    argTypes: {
        itemType: {
            options: [TYPE_FILE, TYPE_FOLDER],
            control: { type: 'select' },
        },
    },
    parameters: {
        chromatic: { disableSnapshot: false },
    },
};
