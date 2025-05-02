// @flow

import ContentExplorer from '../../ContentExplorer';

export const basic = {};

export default {
    title: 'Elements/ContentExplorer/tests/e2e',
    component: ContentExplorer,
    args: {
        features: global.FEATURE_FLAGS,
        rootFolderId: global.FOLDER_ID,
        token: global.TOKEN,
    },
};
