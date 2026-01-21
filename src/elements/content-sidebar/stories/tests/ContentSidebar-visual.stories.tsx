import React from 'react';
import type { StoryObj } from '@storybook/react';
import { expect, within, waitFor } from 'storybook/test';
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

// Custom panel configurations
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

// ============================================
// Basic Visual Regression Stories
// ============================================

export const ContentSidebar: StoryObj<typeof ContentSidebarComponent> = {
    args: {
        features: {
            ...global.FEATURE_FLAGS,
            metadata: { redesign: { enabled: true } },
        },
    },
};

export const withModernization: StoryObj<typeof ContentSidebarComponent> = {
    args: {
        enableModernizedComponents: true,
    },
};

export const ContentSidebarDetailsTab: StoryObj<typeof ContentSidebarComponent> = {
    args: {
        hasActivityFeed: false,
        hasMetadata: false,
    },
};

// ============================================
// Custom Panels Visual Stories
// ============================================

export const WithCustomPanel: StoryObj<typeof ContentSidebarComponent> = {
    args: {
        features: {
            ...global.FEATURE_FLAGS,
            metadata: { redesign: { enabled: true } },
        },
        customSidebarPanels: [customPanelConfig],
    },
};

export const WithMultipleCustomPanels: StoryObj<typeof ContentSidebarComponent> = {
    args: {
        features: {
            ...global.FEATURE_FLAGS,
            metadata: { redesign: { enabled: true } },
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

// ============================================
// Panel Route Order Stories (with play functions)
// Note: Feature flags use nested object structure for getFeatureConfig
// ============================================

export const NativeBoxAIAsDefault: StoryObj<typeof ContentSidebarComponent> = {
    args: {
        features: {
            ...global.FEATURE_FLAGS,
            boxai: { sidebar: { enabled: true, shouldBeDefaultPanel: true } },
            metadata: { redesign: { enabled: true } },
        },
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        await waitFor(
            () => {
                const boxAiButton = canvas.getByTestId('sidebarboxai');
                expect(boxAiButton).toHaveAttribute('aria-selected', 'true');
            },
            { timeout: 5000 },
        );
    },
};

export const NativeBoxAINotDefault: StoryObj<typeof ContentSidebarComponent> = {
    args: {
        features: {
            ...global.FEATURE_FLAGS,
            boxai: { sidebar: { enabled: true, shouldBeDefaultPanel: false } },
            metadata: { redesign: { enabled: true } },
        },
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        await waitFor(
            () => {
                const boxAiButton = canvas.getByTestId('sidebarboxai');
                expect(boxAiButton).toHaveAttribute('aria-selected', 'false');
            },
            { timeout: 5000 },
        );
    },
};

export const CustomBoxAIAsDefault: StoryObj<typeof ContentSidebarComponent> = {
    args: {
        features: {
            ...global.FEATURE_FLAGS,
            boxai: { sidebar: { enabled: false, shouldBeDefaultPanel: true } },
            metadata: { redesign: { enabled: true } },
        },
        customSidebarPanels: [customBoxAIPanelConfig],
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        await waitFor(
            () => {
                const boxAiButton = canvas.getByTestId('sidebarboxai');
                expect(boxAiButton).toHaveAttribute('aria-selected', 'true');
            },
            { timeout: 5000 },
        );
    },
};

export const CustomBoxAINotDefault: StoryObj<typeof ContentSidebarComponent> = {
    args: {
        features: {
            ...global.FEATURE_FLAGS,
            boxai: { sidebar: { enabled: false, shouldBeDefaultPanel: false } },
            metadata: { redesign: { enabled: true } },
        },
        customSidebarPanels: [customBoxAIPanelConfig],
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        await waitFor(
            () => {
                const boxAiButton = canvas.getByTestId('sidebarboxai');
                expect(boxAiButton).toHaveAttribute('aria-selected', 'false');
            },
            { timeout: 5000 },
        );
    },
};

export const NativeBoxAIWithCustomPanels: StoryObj<typeof ContentSidebarComponent> = {
    args: {
        features: {
            ...global.FEATURE_FLAGS,
            boxai: { sidebar: { enabled: true, shouldBeDefaultPanel: true } },
            metadata: { redesign: { enabled: true } },
        },
        customSidebarPanels: [customPanelConfig],
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        await waitFor(
            () => {
                // Native Box AI should be default
                const boxAiButton = canvas.getByTestId('sidebarboxai');
                expect(boxAiButton).toHaveAttribute('aria-selected', 'true');
                // Custom panel should exist but not selected
                const customPanelButton = canvas.getByTestId('sidebarcustomPanel');
                expect(customPanelButton).toHaveAttribute('aria-selected', 'false');
            },
            { timeout: 5000 },
        );
    },
};

export const CustomPanelAsDefault: StoryObj<typeof ContentSidebarComponent> = {
    args: {
        features: {
            ...global.FEATURE_FLAGS,
            boxai: { sidebar: { enabled: false } },
            metadata: { redesign: { enabled: true } },
        },
        hasActivityFeed: false,
        hasMetadata: false,
        hasSkills: false,
        customSidebarPanels: [customPanelConfig],
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        await waitFor(
            () => {
                // Without native panels, custom panel should be available
                const customPanelButton = canvas.getByTestId('sidebarcustomPanel');
                expect(customPanelButton).toBeInTheDocument();
            },
            { timeout: 5000 },
        );
    },
};
