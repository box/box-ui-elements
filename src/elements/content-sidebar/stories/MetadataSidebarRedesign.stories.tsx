import { type StoryObj } from '@storybook/react';
import { fn, userEvent, within } from '@storybook/test';
import React, { type ComponentProps } from 'react';
import { http, HttpResponse } from 'msw';
import MetadataSidebarRedesign from '../MetadataSidebarRedesign';
import ContentSidebar from '../ContentSidebar';
import {
    mockEnterpriseMetadataTemplates,
    mockFileRequest,
    mockMetadataInstances,
} from './__mocks__/MetadataSidebarRedesignedMocks';

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
    parameters: {
        msw: {
            handlers: [
                http.get(mockFileRequest.url, () => {
                    return HttpResponse.json(mockFileRequest.response);
                }),
                http.get(mockMetadataInstances.url, () => {
                    return HttpResponse.json(mockMetadataInstances.response);
                }),
                http.get(mockEnterpriseMetadataTemplates.url, () => {
                    return HttpResponse.json(mockEnterpriseMetadataTemplates.response);
                }),
            ],
        },
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
