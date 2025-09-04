import React from 'react';
import get from 'lodash/get';
import { http, HttpResponse } from 'msw';
import type { Meta, StoryObj } from '@storybook/react';
import ContentExplorer from '../ContentExplorer';
import { DEFAULT_HOSTNAME_API } from '../../../constants';
import { mockMetadata, mockSchema } from '../../common/__mocks__/mockMetadata';
import { mockRootFolder } from '../../common/__mocks__/mockRootFolder';

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

    ancestor_folder_id: '0',
    fields: [
        `${metadataSourceFieldName}.industry`,
        `${metadataSourceFieldName}.last_contacted_at`,
        `${metadataSourceFieldName}.role`,
        `${metadataSourceFieldName}.number`,
    ],
};

const columns = mockSchema.fields.map(field => {
    if (field.type === 'date') {
        return {
            textValue: field.displayName,
            id: `${metadataSourceFieldName}.${field.key}`,
            key: `${metadataSourceFieldName}.${field.key}`,
            type: field.type,
            allowsSorting: true,
            minWidth: 200,
            maxWidth: 200,
            cellRenderer: (item, column) => {
                const dateValue = get(item, column.id);
                return dateValue ? new Date(dateValue).toLocaleDateString() : '';
            },
        };
    }

    return {
        textValue: field.displayName,
        id: `${metadataSourceFieldName}.${field.key}`,
        key: `${metadataSourceFieldName}.${field.key}`,
        type: field.type,
        allowsSorting: true,
        minWidth: 200,
        maxWidth: 200,
    };
});
const defaultView = 'metadata'; // Required prop to paint the metadata view. If not provided, you'll get regular folder view.

type Story = StoryObj<typeof ContentExplorer>;

export const metadataView: Story = {
    args: {
        metadataViewProps: {
            columns,
            isSelectionEnabled: true,
        },
        metadataQuery,
        defaultView,
        features: {
            contentExplorer: {
                metadataViewV2: true,
            },
        },
    },
    render: args => {
        return (
            <div style={{ padding: '50px', border: '1px solid #ccc', height: '500px' }}>
                <ContentExplorer {...args} />
            </div>
        );
    },
};

const meta: Meta<typeof ContentExplorer> = {
    title: 'Elements/ContentExplorer/MetadataView',
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
                http.get(`${DEFAULT_HOSTNAME_API}/2.0/folders/:id`, () => {
                    return HttpResponse.json(mockRootFolder);
                }),
            ],
        },
    },
};

export default meta;
