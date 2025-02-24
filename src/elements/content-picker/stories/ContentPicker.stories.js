// @flow
import ContentPicker from '../ContentPicker';

export const basic = {};

export default {
    title: 'Elements/ContentPicker',
    component: ContentPicker,
    args: {
        features: global.FEATURE_FLAGS,
        rootFolderId: global.FOLDER_ID,
        token: global.TOKEN,
        type: 'file,folder',
    },
};
