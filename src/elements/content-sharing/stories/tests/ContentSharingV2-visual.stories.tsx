import { DEFAULT_HOSTNAME_API, TYPE_FILE } from '../../../../constants';
import { ContentSharingV2 } from '../../ContentSharingV2';

export default {
    title: 'Elements/ContentSharingV2/tests/visual-regression-tests',
    component: ContentSharingV2,
    args: {
        apiHost: DEFAULT_HOSTNAME_API,
        features: global.FEATURE_FLAGS,
        hasProviders: true,
        language: 'en',
        itemType: TYPE_FILE,
        itemID: global.FILE_ID,
        messages: {
            en: {
                contentSharingV2: 'Content Sharing V2',
            },
        },
        token: global.TOKEN,
        theme: 'light',
    },
};

export const Modernization = {
    args: {
        enableModernizedComponents: true,
    },
};
