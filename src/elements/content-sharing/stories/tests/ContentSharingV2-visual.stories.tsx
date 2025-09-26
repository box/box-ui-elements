import * as React from 'react';
import { TYPE_FILE } from '../../../../constants';
import { mockAPIWithSharedLink, mockAPIWithoutSharedLink } from '../../utils/__mocks__/ContentSharingV2Mocks';
import ContentSharingV2 from '../../ContentSharingV2';

export const withModernization = {
    args: {
        api: mockAPIWithoutSharedLink,
        enableModernizedComponents: true,
    },
};

export const withSharedLink = {
    args: {
        api: mockAPIWithSharedLink,
    },
};

export default {
    title: 'Elements/ContentSharingV2/tests/visual-regression-tests',
    component: ContentSharingV2,
    args: {
        children: <button>Open Unified Share Modal</button>,
        itemType: TYPE_FILE,
        itemID: global.FILE_ID,
    },
};
