import { type StoryObj } from '@storybook/react';
import ContentSidebar from '../../ContentSidebar';
import BoxAISidebar from '../../BoxAISidebarContent';

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
        features: global.FEATURES,
        fileId: global.FILE_ID,
        hasActivityFeed: true,
        hasMetadata: true,
        hasSkills: true,
        hasVersions: true,
        token: global.TOKEN,
    },
};

export const ContentSidebarWithBoxAIDisabled: StoryObj<typeof BoxAISidebar> = {
    args: {
        features: {
            ...global.FEATURES,
            'boxai.sidebar.enabled': false,
            'metadata.redesign.enabled': true,
        },
    },
};

export const ContentSidebarWithBoxAIEnabled: StoryObj<typeof BoxAISidebar> = {
    args: {
        features: {
            ...global.FEATURES,
            'boxai.sidebar.enabled': true,
            'metadata.redesign.enabled': true,
        },
    },
};
