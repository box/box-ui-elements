import ContentSidebar from '../ContentSidebar';

const mockFeatures = {
    'boxai.sidebar.enabled': true,
};

export default {
    title: 'Elements/ContentSidebar/BoxAISidebar',
    component: ContentSidebar,
    args: {
        features: mockFeatures,
        fileId: global.FILE_ID,
        token: global.TOKEN,
    },
};

export const basic = {};
