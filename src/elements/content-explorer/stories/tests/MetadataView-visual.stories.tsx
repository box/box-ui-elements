import type { Meta, StoryObj } from '@storybook/react';
import { http, HttpResponse } from 'msw';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { Download, SignMeOthers } from '@box/blueprint-web-assets/icons/Fill/index';
import { Sign } from '@box/blueprint-web-assets/icons/Line';
import noop from 'lodash/noop';

import ContentExplorer from '../../ContentExplorer';
import { DEFAULT_HOSTNAME_API } from '../../../../constants';
import { mockMetadata, mockSchema } from '../../../common/__mocks__/mockMetadata';
import { mockRootFolder } from '../../../common/__mocks__/mockRootFolder';

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

const metadataViewV2ElementProps = {
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
};

export const metadataViewV2: Story = {
    args: metadataViewV2ElementProps,
};

export const metadataViewV2WithCustomActions: Story = {
    args: {
        ...metadataViewV2ElementProps,
        metadataViewProps: {
            columns,
            tableProps: {
                isSelectAllEnabled: true,
            },
            itemActionMenuProps: {
                actions: [
                    {
                        label: 'Download',
                        onClick: noop,
                        icon: Download,
                    },
                ],
                subMenuTrigger: {
                    label: 'Sign',
                    icon: Sign,
                },
                subMenuActions: [
                    {
                        label: 'Request Signature',
                        onClick: noop,
                        icon: SignMeOthers,
                    },
                ],
            },
        },
    },
    play: async ({ canvas }) => {
        await waitFor(() => {
            expect(canvas.getByRole('row', { name: /Child 2/i })).toBeInTheDocument();
        });
        const firstRow = canvas.getByRole('row', { name: /Child 2/i });
        const ellipsesButton = within(firstRow).getByRole('button', { name: 'Action menu' });
        userEvent.click(ellipsesButton);
    },
};

const initialFilterActionBarProps = {
    initialFilterValues: {
        'industry-filter': { value: ['Legal'] },
        'mimetype-filter': { value: ['boxnoteType', 'documentType', 'threedType'] },
        'role-filter': { value: ['Developer', 'Business Owner', 'Marketing'] },
    },
};

export const metadataViewV2WithInitialFilterValues: Story = {
    args: {
        ...metadataViewV2ElementProps,
        metadataViewProps: {
            columns,
            actionBarProps: initialFilterActionBarProps,
        },
    },
    play: async ({ canvas }) => {
        // Wait for chips to update with initial values
        await waitFor(() => {
            expect(canvas.getByRole('button', { name: /Industry/i })).toHaveTextContent(/\(1\)/);
        });
        // Other chips should reflect initialized values
        const contactRoleChip = canvas.getByRole('button', { name: /Contact Role/i });
        expect(contactRoleChip).toHaveTextContent(/\(3\)/);

        const fileTypeChip = canvas.getByRole('button', { name: /Box Note/i });
        expect(fileTypeChip).toHaveTextContent(/\+2/);
    },
};

export const sidePanelOpenWithSingleItemSelected: Story = {
    args: {
        ...metadataViewV2ElementProps,
        metadataViewProps: {
            columns,
            tableProps: {
                isSelectAllEnabled: true,
            },
        },
    },

    play: async ({ canvas }) => {
        await waitFor(() => {
            expect(canvas.getByRole('row', { name: /Child 2/i })).toBeInTheDocument();
        });

        // Select the first row by clicking its checkbox
        const firstRow = canvas.getByRole('row', { name: /Child 2/i });
        const checkbox = within(firstRow).getByRole('checkbox');
        await userEvent.click(checkbox);

        const metadataButton = canvas.getByRole('button', { name: 'Metadata' });
        await userEvent.click(metadataButton);
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
                http.get(`${DEFAULT_HOSTNAME_API}/2.0/folders/:id`, () => {
                    return HttpResponse.json(mockRootFolder);
                }),
            ],
        },
    },
};

export default meta;
