import type { StoryObj } from '@storybook/react';
import ContentSidebarComponent from '../../ContentSidebar';

export default {
    title: 'Elements/ContentSidebar/tests/visual-regression-tests',
    component: ContentSidebarComponent,
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

export const ContentSidebar: StoryObj<typeof ContentSidebarComponent> = {
    args: {
        features: {
            ...global.FEATURE_FLAGS,
            'metadata.redesign.enabled': true,
        },
    },
};

export const ContentSidebarDetailsTab: StoryObj<typeof ContentSidebarComponent> = {
    args: {
        hasActivityFeed: false,
        hasMetadata: false,
    },
};
