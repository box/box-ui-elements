// @flow
import ContentSidebar from '../ContentSidebar';

export const basic = {};

export default {
    title: 'Elements/ContentSidebar/BoxAISidebar',
    component: ContentSidebar,
    args: {
        features: global.FEATURES,
        fileId: global.FILE_ID,
        hasBoxAI: true,
        token: global.TOKEN,
    },
};
