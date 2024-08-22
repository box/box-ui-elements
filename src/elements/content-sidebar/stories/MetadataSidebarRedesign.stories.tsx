import { type StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { type ComponentProps } from 'react';
import MetadataSidebarRedesign from '../MetadataSidebarRedesign';
import ContentSidebar from '../ContentSidebar';

const fileIdWithMetadata = global.FILE_ID;
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
};

export const AddTemplateDropdownMenu: StoryObj<typeof MetadataSidebarRedesign> = {};
