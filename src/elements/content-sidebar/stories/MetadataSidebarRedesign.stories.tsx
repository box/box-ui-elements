import { type StoryObj } from '@storybook/react';
import { type ComponentProps } from 'react';
import React from 'react';
import MetadataSidebarRedesign from '../MetadataSidebarRedesign';
import ContentSidebar from '../ContentSidebar';

const fileIdWithMetadata = global.FILE_ID;
const token = global.TOKEN;
const mockFeatures = {
    'metadata.redesign.enabled': true,
};
const mockLogger = {
    onReadyMetric: ({ endMarkName }) => {
        console.log(`Logger: onReadyMetric called with endMarkName: ${endMarkName}`);
    },
};

const defaultMetadataSidebarProps: ComponentProps<typeof MetadataSidebarRedesign> = {
    isFeatureEnabled: true,
    onError: (error, code, context) => console.error('Error:', error, code, context),
};

export default {
    title: 'Elements/ContentSidebar/MetadataSidebarRedesign',
    component: ContentSidebar,
    args: {
        fileId: fileIdWithMetadata,
        features: mockFeatures,
        logger: mockLogger,
        hasMetadata: true,
        token,
        metadataSidebarProps: defaultMetadataSidebarProps,
    },
    render: args => {
        return <ContentSidebar {...args} />;
    },
};

export const AddTemplateDropdownMenu: StoryObj<typeof MetadataSidebarRedesign> = {};
