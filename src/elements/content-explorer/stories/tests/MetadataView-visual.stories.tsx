import React from 'react';
import { http, HttpResponse } from 'msw';
import type { Meta, StoryObj } from '@storybook/react';
import ContentExplorer from '../../ContentExplorer';
import { DEFAULT_HOSTNAME_API } from '../../../../constants';
import { mockMetadata, mockSchema } from '../../../common/__mocks__/mockMetadata';

// The intent behind relying on mockMetadata is to allow a developer to paste in their own metadata template schema for use with live API calls.
const { scope: templateScope, templateKey } = mockSchema;

const metadataScopeAndKey = `${templateScope}.${templateKey}`;
const metadataFieldNamePrefix = `metadata.${metadataScopeAndKey}`;

// This is the body of the metadata query API call.
// https://developer.box.com/guides/metadata/queries/syntax/
const metadataQuery = {
    from: metadataScopeAndKey,
    ancestor_folder_id: '0',
    sort_by: [
        {
            field_key: `${metadataFieldNamePrefix}.${mockSchema.fields[0].key}`, // Default to sorting by the first field in the schema
            direction: 'asc',
        },
    ],
    fields: [
        // Default to returning all fields in the metadata template schema, and name as a standalone (non-metadata) field
        ...mockSchema.fields.map(field => `${metadataFieldNamePrefix}.${field.key}`),
        'name',
    ],
};

// Used for metadata view v1
const fieldsToShow = [
    { key: `${metadataFieldNamePrefix}.name`, canEdit: false, displayName: 'Alias' },
    { key: `${metadataFieldNamePrefix}.industry`, canEdit: true },
    { key: `${metadataFieldNamePrefix}.last_contacted_at`, canEdit: true },
    { key: `${metadataFieldNamePrefix}.role`, canEdit: true },
];

// Used for metadata view v2
const columns = [
    {
        // Always include the name column
        textValue: 'Name',
        id: 'name',
        type: 'string',
        allowSorting: true,
        minWidth: 150,
        maxWidth: 150,
    },
    ...mockSchema.fields.map(field => ({
        textValue: field.displayName,
        id: `${metadataFieldNamePrefix}.${field.key}`,
        type: field.type,
        allowSorting: true,
        minWidth: 150,
        maxWidth: 150,
    })),
];

// Switches ContentExplorer to use Metadata View over standard, folder-based view.
const defaultView = 'metadata';

type Story = StoryObj<typeof ContentExplorer>;

export const metadataView: Story = {
    args: {
        metadataQuery,
        fieldsToShow,
        defaultView,
    },
};

export const metadataViewV2: Story = {
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
            ],
        },
    },
};

export default meta;
