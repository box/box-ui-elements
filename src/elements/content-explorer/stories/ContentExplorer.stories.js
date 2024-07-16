// @flow

import ContentExplorer from '../ContentExplorer';

export const basic = {};

export const withSidebar = {
    args: {
        contentPreviewProps: {
            contentSidebarProps: {
                detailsSidebarProps: {
                    hasProperties: true,
                    hasNotices: true,
                    hasAccessStats: true,
                    hasClassification: true,
                    hasRetentionPolicy: true,
                    hasVersions: true,
                },
                features: global.FEATURE_FLAGS,
                hasActivityFeed: true,
                hasMetadata: true,
                hasSkills: true,
            },
        },
    },
};

export default {
    title: 'Elements/ContentExplorer',
    component: ContentExplorer,
    args: {
        features: global.FEATURE_FLAGS,
        rootFolderId: global.FOLDER_ID,
        token: global.TOKEN,
    },
};
