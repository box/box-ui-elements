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
        features: global.FEATURE_FLAGS,
        fileId: global.FILE_ID,
        hasActivityFeed: true,
        hasMetadata: true,
        hasSkills: true,
        hasVersions: true,
        token: global.TOKEN,
    },
    parameters: {
        chromatic: { ignoreSelectors: ['.bcs-scroll-content'] },
    },
};

export const ContentSidebarWithBoxAIDisabled: StoryObj<typeof BoxAISidebar> = {
    args: {
        features: {
            ...global.FEATURE_FLAGS,
            'boxai.sidebar.enabled': false,
            'metadata.redesign.enabled': true,
        },
    },
};

export const ContentSidebarWithBoxAIEnabled: StoryObj<typeof BoxAISidebar> = {
    args: {
        features: {
            ...global.FEATURE_FLAGS,
            'boxai.sidebar.enabled': true,
            'metadata.redesign.enabled': true,
        },
    },
};
