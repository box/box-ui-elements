import { type StoryObj, Meta } from '@storybook/react';
import { fn, userEvent, within } from '@storybook/test';
import React, { type ComponentProps } from 'react';
import { http, HttpResponse } from 'msw';
import type { HttpHandler } from 'msw';
import MetadataSidebarRedesign from '../MetadataSidebarRedesign';
import ContentSidebar from '../ContentSidebar';
import {
    fileIdWithMetadata,
    mockEnterpriseMetadataTemplates,
    mockFileRequest,
    mockMetadataInstances,
    mockGlobalMetadataTemplates,
} from './__mocks__/MetadataSidebarRedesignedMocks';

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
    isBetaLanguageEnabled: false,
    isDeleteConfirmationModalCheckboxEnabled: false,
    isMetadataMultiLevelTaxonomyFieldEnabled: false,
    isFeatureEnabled: true,
    onError: fn(),
    onSuccess: fn(),
};

const meta: Meta<typeof ContentSidebar> & { parameters: { msw: { handlers: HttpHandler[] } } } = {
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
                http.get(mockGlobalMetadataTemplates.url, () => {
                    return HttpResponse.json(mockGlobalMetadataTemplates.response);
                }),
            ],
        },
    },
    render: args => {
        return <ContentSidebar {...args} />;
    },
};

export default meta;

export const Basic: StoryObj<typeof MetadataSidebarRedesign> = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        const addTemplateButton = await canvas.findByRole(
            'button',
            { name: 'Add template' },
            { container: await canvas.findByRole('tabpanel') },
        );
        await userEvent.click(addTemplateButton);
    },
};
