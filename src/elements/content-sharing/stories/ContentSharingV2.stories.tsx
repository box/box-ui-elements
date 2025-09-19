import { DEFAULT_HOSTNAME_API, TYPE_FILE, TYPE_FOLDER } from '../../../constants';
import { ContentSharingV2 } from '../ContentSharingV2';

export const Basic = {};

export default {
    title: 'Elements/ContentSharingV2',
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
    argTypes: {
        itemType: {
            options: [TYPE_FILE, TYPE_FOLDER],
            control: { type: 'select' },
        },
    },
};
