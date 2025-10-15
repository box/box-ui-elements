import { type StoryObj } from '@storybook/react';
import ContentSidebarComponent from '../../ContentSidebar';
import BoxAISidebar from '../../BoxAISidebarContent';

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

export const withModernization = {
    args: {
        enableModernizedComponents: true,
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

export const ContentSidebarDetailsTab: StoryObj<typeof ContentSidebarComponent> = {
    args: {
        hasActivityFeed: false,
        hasMetadata: false,
    },
};
