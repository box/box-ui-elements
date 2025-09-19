import { TYPE_FILE } from '../../../../constants';
import ContentSharingV2 from '../../ContentSharingV2';

export const withModernization = {
    args: {
        enableModernizedComponents: true,
    },
};

export default {
    title: 'Elements/ContentSharingV2/tests/visual-regression-tests',
    component: ContentSharingV2,
    args: {
        itemType: TYPE_FILE,
        itemID: global.FILE_ID,
    },
};
