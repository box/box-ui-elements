import React from 'react';
import type { StoryObj } from '@storybook/react';
import ContentSidebarComponent from '../../ContentSidebar';
import type { CustomSidebarPanel } from '../../flowTypes';

// Mock custom panel component for stories
const MockCustomPanel = React.forwardRef<HTMLDivElement, { title: string }>(({ title }, ref) => (
    <div ref={ref} style={{ padding: '20px' }}>
        <h2>{title}</h2>
        <p>This is a custom sidebar panel content.</p>
    </div>
));
MockCustomPanel.displayName = 'MockCustomPanel';

// Mock custom Box AI panel component
const MockCustomBoxAIPanel = React.forwardRef<HTMLDivElement>((props, ref) => (
    <div ref={ref} style={{ padding: '20px' }} data-testid="custom-boxai-panel">
        <h2>Custom Box AI Panel</h2>
        <p>This is a custom Box AI implementation provided by the consumer.</p>
    </div>
));
MockCustomBoxAIPanel.displayName = 'MockCustomBoxAIPanel';

// Mock icon components
const MockIcon = () => <span>📋</span>;
const MockBoxAIIcon = () => <span>🤖</span>;

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

// Native Box AI sidebar stories
export const ContentSidebarWithBoxAIEnabled: StoryObj<typeof ContentSidebarComponent> = {
    args: {
        features: {
            ...global.FEATURE_FLAGS,
            'boxai.sidebar.enabled': true,
            'metadata.redesign.enabled': true,
        },
    },
};

export const ContentSidebarWithBoxAIDisabled: StoryObj<typeof ContentSidebarComponent> = {
    args: {
        features: {
            ...global.FEATURE_FLAGS,
            'boxai.sidebar.enabled': false,
            'metadata.redesign.enabled': true,
        },
    },
};

// Custom sidebar panel stories
const customPanelConfig: CustomSidebarPanel = {
    id: 'customPanel',
    path: 'customPanel',
    component: MockCustomPanel,
    title: 'Custom Panel',
    icon: MockIcon,
};

const customBoxAIPanelConfig: CustomSidebarPanel = {
    id: 'boxai',
    path: 'boxai',
    component: MockCustomBoxAIPanel,
    title: 'Custom Box AI',
    icon: MockBoxAIIcon,
};

export const ContentSidebarWithCustomPanel: StoryObj<typeof ContentSidebarComponent> = {
    args: {
        features: {
            ...global.FEATURE_FLAGS,
            'boxai.sidebar.enabled': false,
            'metadata.redesign.enabled': true,
        },
        customSidebarPanels: [customPanelConfig],
    },
};

export const ContentSidebarWithCustomBoxAIPanel: StoryObj<typeof ContentSidebarComponent> = {
    args: {
        features: {
            ...global.FEATURE_FLAGS,
            'boxai.sidebar.enabled': false,
            'metadata.redesign.enabled': true,
        },
        customSidebarPanels: [customBoxAIPanelConfig],
    },
};

export const ContentSidebarWithNativeBoxAIAndCustomPanels: StoryObj<typeof ContentSidebarComponent> = {
    args: {
        features: {
            ...global.FEATURE_FLAGS,
            'boxai.sidebar.enabled': true,
            'metadata.redesign.enabled': true,
        },
        customSidebarPanels: [customPanelConfig],
    },
};

export const ContentSidebarWithMultipleCustomPanels: StoryObj<typeof ContentSidebarComponent> = {
    args: {
        features: {
            ...global.FEATURE_FLAGS,
            'boxai.sidebar.enabled': false,
            'metadata.redesign.enabled': true,
        },
        customSidebarPanels: [
            customPanelConfig,
            {
                id: 'anotherCustomPanel',
                path: 'anotherCustomPanel',
                component: MockCustomPanel,
                title: 'Another Panel',
                icon: () => <span>📝</span>,
            },
        ],
    },
};
