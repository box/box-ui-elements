import { type StoryObj } from '@storybook/react';
import { type ComponentProps } from 'react';
import React from 'react';
import MetadataSidebarRedesign, { MetadataSidebarRedesignProps } from '../MetadataSidebarRedesign';
import ContentSidebar from '../ContentSidebar';

const fileIdWithMetadata = '415542803939'; // global.FILE_ID should be used here but throws error in tsx file
const token = 'P1n3ID8nYMxHRWvenDatQ9k6JKzWzYrz'; // global.TOKEN should be used here but throws error in tsx file
const mockFeatures = {
    'metadata.redesign.enabled': true,
};
const mockLogger = {
    onReadyMetric: ({ endMarkName }) => {
        console.log(`Logger: onReadyMetric called with endMarkName: ${endMarkName}`);
    },
};

const defaultArgs: ComponentProps<typeof MetadataSidebarRedesign> = {
    fileId: fileIdWithMetadata,
    isFeatureEnabled: true,
    onError: (error, code, context) => console.error('Error:', error, code, context),
};

export default {
    title: 'Elements/ContentSidebar/MetadataSidebarRedesign',
    component: MetadataSidebarRedesign,
    args: defaultArgs,
};

const Template = (args: MetadataSidebarRedesignProps) => {
    return (
        <ContentSidebar
            token={token}
            metadataSidebarProps={{
                ...args,
            }}
            hasMetadata={true}
            features={mockFeatures}
            fileId={fileIdWithMetadata}
            logger={mockLogger}
        />
    );
};

const Default: StoryObj<typeof MetadataSidebarRedesign> = {
    render: Template,
    args: { ...defaultArgs },
};

export const AddTemplateDropdownMenu: StoryObj<typeof MetadataSidebarRedesign> = {
    ...Default,
};
