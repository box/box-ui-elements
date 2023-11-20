// @flow
import ContentSidebar from '../ContentSidebar';

export const basic = {};

export default {
    title: 'Elements/ContentSidebar',
    component: ContentSidebar,
    args: {
        detailsSidebarProps: {
            hasProperties: true,
            hasNotices: true,
            hasAccessStats: true,
            hasClassification: true,
            hasRetentionPolicy: true,
        },
        features: global.FEATURES,
        fileId: global.FILE_ID,
        hasActivityFeed: true,
        hasMetadata: true,
        hasSkills: true,
        hasVersions: true,
        token: global.TOKEN,
    },
};
