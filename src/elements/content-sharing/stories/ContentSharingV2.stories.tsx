import * as React from 'react';

import { TYPE_FILE, TYPE_FOLDER } from '../../../constants';
import { mockApiWithSharedLink, mockApiWithoutSharedLink } from '../utils/__mocks__/ContentSharingV2Mocks';
import ContentSharingV2 from '../ContentSharingV2';

export const basic = {};

export const withSharedLink = {
    args: {
        api: mockApiWithSharedLink,
    },
};

export default {
    title: 'Elements/ContentSharingV2',
    component: ContentSharingV2,
    args: {
        api: mockApiWithoutSharedLink,
        children: <button>Open Unified Share Modal</button>,
        itemType: TYPE_FILE,
        itemId: global.FILE_ID,
    },
    argTypes: {
        itemType: {
            options: [TYPE_FILE, TYPE_FOLDER],
            control: { type: 'select' },
        },
    },
    parameters: {
        chromatic: {
            disableSnapshot: true,
        },
    },
};
