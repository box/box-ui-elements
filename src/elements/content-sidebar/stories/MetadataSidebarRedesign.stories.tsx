import { type StoryObj } from '@storybook/react';
import { fn, userEvent, within } from '@storybook/test';
import React, { type ComponentProps } from 'react';
import MetadataSidebarRedesign from '../MetadataSidebarRedesign';
import ContentSidebar from '../ContentSidebar';

const fileIdWithMetadata = global.FILE_ID;
const mockFeatures = {
    'metadata.redesign.enabled': true,
};
const mockLogger = {
    onReadyMetric: ({ endMarkName }) => {
        // eslint-disable-next-line no-console
        console.log(`Logger: onReadyMetric called with endMarkName: ${endMarkName}`);
    },
};

const defaultMetadataSidebarProps: ComponentProps<typeof MetadataSidebarRedesign> = {
    isBoxAiSuggestionsEnabled: true,
    isFeatureEnabled: true,
    onError: fn,
};

export default {
    title: 'Elements/ContentSidebar/MetadataSidebarRedesign',
    component: ContentSidebar,
    args: {
        fileId: fileIdWithMetadata,
        features: mockFeatures,
        logger: mockLogger,
        hasMetadata: true,
        token: global.TOKEN,
        metadataSidebarProps: defaultMetadataSidebarProps,
    },
    render: args => {
        return <ContentSidebar {...args} />;
    },
};

export const Basic: StoryObj<typeof MetadataSidebarRedesign> = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        const addTemplateButton = await canvas.findByRole('button', { name: 'Add template' }, { timeout: 5000 });
        await userEvent.click(addTemplateButton);
    },
};
