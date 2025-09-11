import { userEvent, within } from 'storybook/test';
import { http, HttpResponse } from 'msw';

import { DEFAULT_HOSTNAME_API } from '../../../../constants';
import { mockEventRequest, mockFileRequest, mockUserRequest } from '../../../common/__mocks__/mockRequests';
import ContentPreview from '../../ContentPreview';

const apiV2Path = `${DEFAULT_HOSTNAME_API}/2.0`;
const fileIdWithMetadata = '415542803939';

// Mock file with metadata permissions
const mockFileWithMetadata = {
    url: `${apiV2Path}/files/${fileIdWithMetadata}`,
    response: {
        type: 'file',
        id: fileIdWithMetadata,
        etag: '3',
        extension: 'pdf',
        name: 'Test Document.pdf',
        permissions: {
            can_download: true,
            can_preview: true,
            can_upload: true,
            can_comment: true,
            can_rename: true,
            can_delete: true,
            can_share: true,
            can_set_share_access: true,
            can_invite_collaborator: true,
            can_annotate: true,
            can_view_annotations_all: true,
            can_view_annotations_self: true,
            can_create_annotations: true,
            can_view_annotations: true,
        },
    },
};

// Mock metadata template with very long dropdown options
const mockMetadataTemplateWithLongOptions = {
    url: `${apiV2Path}/metadata_templates/enterprise`,
    response: {
        limit: 1000,
        entries: [
            {
                id: 'long-dropdown-template-id',
                type: 'metadata_template',
                templateKey: 'longDropdownTemplate',
                scope: 'enterprise_173733877',
                displayName: 'Long Dropdown Test Template',
                hidden: false,
                copyInstanceOnItemCopy: false,
                fields: [
                    {
                        id: 'long-dropdown-field-id',
                        type: 'enum',
                        key: 'longDropdownField',
                        displayName: 'Department Selection',
                        hidden: false,
                        description: 'Select your department from the dropdown',
                        options: [
                            {
                                id: 'option-1',
                                key: 'Engineering - Software Development - Frontend React TypeScript Team Alpha Division',
                            },
                            {
                                id: 'option-2',
                                key: 'Marketing - Digital Campaigns - Social Media Content Strategy Team Beta Division',
                            },
                            {
                                id: 'option-3',
                                key: 'Human Resources - Talent Acquisition - Employee Experience Team Gamma Division',
                            },
                            {
                                id: 'option-4',
                                key: 'Finance - Accounting - Budget Planning - Financial Analysis Team Delta Division',
                            },
                            {
                                id: 'option-5',
                                key: 'Operations - Supply Chain - Logistics - Vendor Management Team Epsilon Division',
                            },
                            {
                                id: 'option-6',
                                key: 'Legal - Compliance - Regulatory Affairs - Contract Management Team Zeta Division',
                            },
                        ],
                    },
                ],
            },
        ],
    },
};

// Mock metadata instance for the file
const mockMetadataInstances = {
    url: `${apiV2Path}/files/${fileIdWithMetadata}/metadata`,
    response: {
        entries: [
            {
                $id: 'long-dropdown-instance-id',
                $version: 1,
                $type: 'longDropdownTemplate-template-type',
                $parent: `file_${fileIdWithMetadata}`,
                $typeVersion: 1,
                $template: 'longDropdownTemplate',
                $scope: 'enterprise_173733877',
                $templateKey: 'longDropdownTemplate',
                longDropdownField: 'Engineering - Software Development - Frontend React TypeScript Team Alpha Division',
                $canEdit: true,
            },
        ],
        limit: 100,
    },
};

const mockGlobalMetadataTemplates = {
    url: `${apiV2Path}/metadata_templates/global`,
    response: {
        entries: [],
    },
};

export const metadataDropdownPositioning = {
    parameters: {
        msw: {
            handlers: [
                http.get(mockFileWithMetadata.url, () => HttpResponse.json(mockFileWithMetadata.response)),
                http.get(mockMetadataTemplateWithLongOptions.url, () =>
                    HttpResponse.json(mockMetadataTemplateWithLongOptions.response),
                ),
                http.get(mockMetadataInstances.url, () => HttpResponse.json(mockMetadataInstances.response)),
                http.get(mockGlobalMetadataTemplates.url, () =>
                    HttpResponse.json(mockGlobalMetadataTemplates.response),
                ),
                http.get(mockFileRequest.url, () => HttpResponse.json(mockFileRequest.response)),
                +http.get(mockUserRequest.url, () => HttpResponse.json(mockUserRequest.response)),
                +http.get(mockEventRequest.url, () => HttpResponse.json(mockEventRequest.response)),
            ],
        },
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        const editButton = await canvas.findByRole('button', { name: 'Edit Long Dropdown Test Template' });
        await userEvent.click(editButton);

        const dropdownField = await canvas.findByRole('combobox', { name: 'Department Selection' });
        await userEvent.click(dropdownField);

        await canvas.findByRole('option', {
            name: 'Engineering - Software Development - Frontend React TypeScript Team Alpha Division',
        });
    },
};

export default {
    title: 'Elements/ContentPreview/tests/visual/Metadata',
    component: ContentPreview,
    args: {
        fileId: fileIdWithMetadata,
        hasHeader: true,
        contentSidebarProps: {
            hasMetadata: true,
            metadataSidebarProps: {
                isFeatureEnabled: true,
            },
            features: {
                'metadata.redesign.enabled': true,
            },
        },
    },
};
