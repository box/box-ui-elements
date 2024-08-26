import { type StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import React, { type ComponentProps } from 'react';
import MetadataSidebarRedesign from '../MetadataSidebarRedesign';
import ContentSidebar from '../ContentSidebar';

const fileIdWithMetadata = global.FILE_ID;
const fileIdWithNoMetadata = '416047501580';
const mockFeatures = {
    'metadata.redesign.enabled': true,
};
const mockLogger = {
    onReadyMetric: ({ endMarkName }) => {
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

export const AddTemplateDropdownMenu: StoryObj<typeof MetadataSidebarRedesign> = {};

export const EmptyStateWithBoxAiEnabled: StoryObj<typeof MetadataSidebarRedesign> = {
    args: {
        fileId: fileIdWithNoMetadata,
        metadataSidebarProps: {
            ...defaultMetadataSidebarProps,
        },
    },};

export const EmptyStateWithBoxAiDisabled: StoryObj<typeof MetadataSidebarRedesign> = {
    args: {
        fileId: fileIdWithNoMetadata,
        metadataSidebarProps: {
            ...defaultMetadataSidebarProps,
            isBoxAiSuggestionsEnabled: false,
        },
    },
};
