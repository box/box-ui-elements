import { type StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import React, { type ComponentProps } from 'react';
import { AddMetadataTemplateDropdown, type MetadataTemplate, type MetadataTemplateField } from '@box/metadata-editor';
import MetadataSidebarRedesign from '../MetadataSidebarRedesign';
import ContentSidebar from '../ContentSidebar';
import SidebarContent from '../SidebarContent';
import { SIDEBAR_VIEW_METADATA } from '../../../constants';
import MetadataInstanceEditor from '../MetadataInstanceEditor';

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

const mockTemplateFields: MetadataTemplateField[] = [
    {
        description: 'My Value',
        displayName: 'My Attribute',
        hidden: false,
        id: '4fc86fb1-43cd-4aa2-a585-5e94ec445d90',
        key: 'myAttribute',
        type: 'string',
    },
];

const mockCustomMetadataTemplate: MetadataTemplate = {
    id: 'template-id',
    fields: [],
    scope: 'global',
    templateKey: 'properties',
    type: 'template-id',
    hidden: false,
};

const renderWithEditor = (template: MetadataTemplate) => (
    <div style={{ display: 'flex', height: '500px' }}>
        <SidebarContent
            actions={<AddMetadataTemplateDropdown availableTemplates={[]} selectedTemplates={[]} onSelect={fn()} />}
            className="bcs-MetadataSidebarRedesign"
            elementId="bcs_120"
            sidebarView={SIDEBAR_VIEW_METADATA}
            title="Metadata"
        >
            <div className="bcs-MetadataSidebarRedesign-content">
                <MetadataInstanceEditor
                    isBoxAiSuggestionsEnabled={true}
                    isUnsavedChangesModalOpen={false}
                    template={template}
                />
            </div>
        </SidebarContent>
    </div>
);

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
    },
};

export const EmptyStateWithBoxAiDisabled: StoryObj<typeof MetadataSidebarRedesign> = {
    args: {
        fileId: fileIdWithNoMetadata,
        metadataSidebarProps: {
            ...defaultMetadataSidebarProps,
            isBoxAiSuggestionsEnabled: false,
        },
    },
};

export const MetadataInstanceEditorWithDefinedTemplate: StoryObj<typeof MetadataSidebarRedesign> = {
    render: () => {
        const mockMetadataTemplate = {
            ...mockCustomMetadataTemplate,
            displayName: 'Template Name',
            fields: mockTemplateFields,
        };

        return renderWithEditor(mockMetadataTemplate);
    },
};

export const MetadataInstanceEditorWithCustomTemplate: StoryObj<typeof MetadataSidebarRedesign> = {
    render: () => {
        return renderWithEditor(mockCustomMetadataTemplate);
    },
};
