import ContentSidebar from '../../ContentSidebar';

export default {
    title: 'Elements/ContentSidebar/tests/visual-regression-tests',
    component: ContentSidebar,
    args: {
        detailsSidebarProps: {
            hasProperties: true,
            hasNotices: true,
            hasAccessStats: true,
            hasClassification: true,
            hasRetentionPolicy: true,
        },
        features: global.FEATURE_FLAGS,
        fileId: global.FILE_ID,
        hasActivityFeed: true,
        hasMetadata: true,
        hasSkills: true,
        hasVersions: true,
        token: global.TOKEN,
    },
};

export const Modernization = {
    args: {
        enableModernizedComponents: true,
    },
};

export const ContentSidebarWithBoxAIDisabled = {
    args: {
        features: {
            ...global.FEATURE_FLAGS,
            'metadata.redesign.enabled': true,
        },
    },
};
