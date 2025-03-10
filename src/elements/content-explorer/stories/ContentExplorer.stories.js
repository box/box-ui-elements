// @flow

import ContentExplorer from '../ContentExplorer';
import mockTheme from '../../common/__mocks__/mockTheme';

export const basic = {};

export const withPagination = {
    args: {
        initialPageSize: 5,
    },
};

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

export const withTheming = {
    args: {
        theme: mockTheme,
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
