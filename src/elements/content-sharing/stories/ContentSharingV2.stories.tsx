import { TYPE_FILE, TYPE_FOLDER } from '../../../constants';
import { ContentSharingV2Template, mockApiWithSharedLink } from '../utils/__mocks__/ContentSharingV2Mocks';

export const basic = {};

export const withSharedLink = {
    args: {
        api: mockApiWithSharedLink,
    },
};

export default {
    title: 'Elements/ContentSharingV2',
    component: ContentSharingV2Template,
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
