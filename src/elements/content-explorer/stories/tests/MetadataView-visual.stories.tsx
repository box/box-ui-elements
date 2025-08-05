import React from 'react';
import { http, HttpResponse } from 'msw';
import type { Meta, StoryObj } from '@storybook/react';
import ContentExplorer from '../../ContentExplorer';
import { DEFAULT_HOSTNAME_API } from '../../../../constants';
import mockAncestorFolder from '../../../common/__mocks__/mockAncestorFolder';
import { mockMetadata, mockSchema } from '../../../common/__mocks__/mockMetadata';

const EID = '0';
const templateName = 'templateName';
const metadataSource = `enterprise_${EID}.${templateName}`;
const metadataSourceFieldName = `metadata.${metadataSource}`;

const metadataQuery = {
    from: metadataSource,

    // // Filter items in the folder by existing metadata key
    // query: 'key = :arg1',
    //
    // // Display items with value
    // query_params: { arg1: 'value' },

    ancestor_folder_id: '313259567207',
    fields: [
        `${metadataSourceFieldName}.name`,
        `${metadataSourceFieldName}.industry`,
        `${metadataSourceFieldName}.last_contacted_at`,
        `${metadataSourceFieldName}.role`,
    ],
};

const fieldsToShow = [
    { key: `${metadataSourceFieldName}.name`, canEdit: false, displayName: 'Alias' },
    { key: `${metadataSourceFieldName}.industry`, canEdit: true },
    { key: `${metadataSourceFieldName}.last_contacted_at`, canEdit: true },
    { key: `${metadataSourceFieldName}.role`, canEdit: true },
];

const columns = mockSchema.fields.map(field => ({
    textValue: field.displayName,
    id: `${metadataSourceFieldName}.${field.key}`,
    type: field.type,
    allowSorting: true,
    minWidth: 150,
    maxWidth: 150,
}));
const defaultView = 'metadata'; // Required prop to paint the metadata view. If not provided, you'll get regular folder view.

type Story = StoryObj<typeof ContentExplorer>;

export const metadataView: Story = {
    args: {
        metadataQuery,
        fieldsToShow,
        defaultView,
    },
};

export const withNewMetadataView: Story = {
    args: {
        metadataViewProps: {
            columns,
        },
        metadataQuery,
        fieldsToShow,
        defaultView,
        features: {
            contentExplorer: {
                metadataViewV2: true,
            },
        },
    },
    render: args => {
        return (
            <div style={{ padding: '50px' }}>
                <ContentExplorer {...args} />
            </div>
        );
    },
};

const meta: Meta<typeof ContentExplorer> = {
    title: 'Elements/ContentExplorer/tests/MetadataView/visual',
    component: ContentExplorer,
    args: {
        features: global.FEATURE_FLAGS,
        rootFolderId: global.FOLDER_ID,
        token: global.TOKEN,
    },
    parameters: {
        msw: {
            handlers: [
                http.post(`${DEFAULT_HOSTNAME_API}/2.0/metadata_queries/execute_read`, () => {
                    return HttpResponse.json(mockMetadata);
                }),
                http.get(`${DEFAULT_HOSTNAME_API}/2.0/metadata_templates/enterprise/templateName/schema`, () => {
                    return HttpResponse.json(mockSchema);
                }),
                http.get(`${DEFAULT_HOSTNAME_API}/2.0/folders/313259567207`, () => {
                    return HttpResponse.json(mockAncestorFolder);
                }),
            ],
        },
    },
};

export default meta;
