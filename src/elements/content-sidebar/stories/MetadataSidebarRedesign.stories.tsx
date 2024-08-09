// @flow
import { type StoryObj } from '@storybook/react';
import { type ComponentProps } from 'react';
import React from 'react';
import MetadataSidebarRedesign, { MetadataSidebarRedesignComponent } from '../MetadataSidebarRedesign';
import { type MetadataSidebarRedesignProps } from '../MetadataSidebarRedesignTypes';

const containerStyle = { width: 300, height: 700, display: 'flex' };

const mockApi = {
    getFileAPI: () => ({
        getFile: (fileId, successCallback) => {
            successCallback({ id: fileId, name: 'Sample File' });
        },
    }),
    getMetadataAPI: () => ({
        getMetadata: (file, successCallback) => {
            successCallback({
                editors: [],
                templates: [],
            });
        },
    }),
};

const defaultArgs: ComponentProps<typeof MetadataSidebarRedesign> = {
    api: mockApi,
    fileId: 'abcd',
    isBoxAiSuggestionsFeatureEnabled: true,
    isFeatureEnabled: true,
    onError: (error, code, context) => console.error('Error:', error, code, context),
    selectedTemplateKey: '',
    templateFilters: [],
};

export default {
    title: 'Elements/MetadataSidebarRedesign',
    component: MetadataSidebarRedesign,
    args: defaultArgs,
};

const Template = (args: MetadataSidebarRedesignProps) => {
    return (
        <div style={containerStyle}>
            <MetadataSidebarRedesignComponent {...args} />
        </div>
    );
};

const Default: StoryObj<typeof MetadataSidebarRedesign> = {
    render: Template,
    args: { ...defaultArgs },
};

export const EmptyStateWithBoxAiEnabled: StoryObj<typeof MetadataSidebarRedesign> = {
    ...Default,
    args: {
        ...Default.args,
    },
};

export const EmptyStateWithBoxAiDisabled: StoryObj<typeof MetadataSidebarRedesign> = {
    ...Default,
    args: {
        ...Default.args,
        isBoxAiSuggestionsFeatureEnabled: false,
    },
};
