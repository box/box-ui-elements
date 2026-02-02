import React from 'react';
import type { StoryObj } from '@storybook/react';
import { expect, within, waitFor } from 'storybook/test';
import ContentSidebarComponent from '../../ContentSidebar';
import type { CustomSidebarPanel } from '../../flowTypes';

const MockCustomPanel = React.forwardRef<HTMLDivElement, { title: string }>(({ title }, ref) => (
    <div ref={ref} style={{ padding: '20px' }}>
        <h2>{title}</h2>
        <p>This is a custom sidebar panel content.</p>
    </div>
));
MockCustomPanel.displayName = 'MockCustomPanel';

const MockIcon = () => <span>📋</span>;

const DISABLED_TOOLTIP = 'Box AI is not available for this file type';

const customPanelConfig: CustomSidebarPanel = {
    id: 'customPanel',
    path: 'customPanel',
    component: MockCustomPanel,
    title: 'Custom Panel',
    icon: MockIcon,
};

const defaultFeatures = {
    ...global.FEATURE_FLAGS,
    metadata: { redesign: { enabled: true } },
    boxai: { sidebar: { enabled: true } },
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

// Basic
export const ContentSidebar: StoryObj<typeof ContentSidebarComponent> = {
    args: { features: defaultFeatures },
};

export const withModernization: StoryObj<typeof ContentSidebarComponent> = {
    args: { enableModernizedComponents: true },
};

export const ContentSidebarDetailsTab: StoryObj<typeof ContentSidebarComponent> = {
    args: { hasActivityFeed: false, hasMetadata: false },
};

// Custom Panels
export const WithMultipleCustomPanels: StoryObj<typeof ContentSidebarComponent> = {
    args: {
        features: defaultFeatures,
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

// Native Box AI
export const NativeBoxAIDisabled: StoryObj<typeof ContentSidebarComponent> = {
    args: {
        features: {
            ...defaultFeatures,
            boxai: { sidebar: { enabled: true, showOnlyNavButton: true, disabledTooltip: DISABLED_TOOLTIP } },
        },
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        await waitFor(
            () => {
                const boxAiButton = canvas.getByTestId('sidebarboxai');
                expect(boxAiButton).toHaveAttribute('aria-disabled', 'true');
                expect(boxAiButton).toHaveClass('bdl-is-disabled');
                expect(boxAiButton).toHaveAttribute('aria-selected', 'false');
            },
            { timeout: 5000 },
        );
    },
};
