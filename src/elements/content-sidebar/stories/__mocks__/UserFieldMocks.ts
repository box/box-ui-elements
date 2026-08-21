import { http, HttpResponse } from 'msw';
import type { HttpHandler } from 'msw';

import { DEFAULT_HOSTNAME_API } from '../../../../constants';
import { fileIdWithMetadata, mockFileRequest, mockGlobalMetadataTemplates } from './MetadataSidebarRedesignedMocks';
import { mockUserRequest } from '../../../common/__mocks__/mockRequests';

const apiV2Path = `${DEFAULT_HOSTNAME_API}/2.0`;

export const mockEnterpriseUsers = {
    url: `${apiV2Path}/users`,
    entries: [
        {
            type: 'user',
            id: '1',
            name: 'Alice Wong',
            email: 'awong@example.com',
            login: 'awong@example.com',
        },
        {
            type: 'user',
            id: '2',
            name: 'Bob Smith',
            email: 'bsmith@example.com',
            login: 'bsmith@example.com',
        },
        {
            type: 'user',
            id: '3',
            name: 'Charlie Nguyen',
            email: 'cnguyen@example.com',
            login: 'cnguyen@example.com',
        },
    ],
};

export const mockEnterpriseGroups = {
    url: `${apiV2Path}/groups`,
    entries: [
        {
            type: 'group',
            id: '100',
            name: 'Design Team',
        },
        {
            type: 'group',
            id: '101',
            name: 'Engineering Team',
        },
    ],
};

export const mockMetadataTemplatesWithUserField = {
    url: `${apiV2Path}/metadata_templates/enterprise`,
    response: {
        limit: 1000,
        entries: [
            {
                id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
                type: 'metadata_template',
                templateKey: 'userTemplate',
                scope: 'enterprise_173733877',
                displayName: 'User Template',
                hidden: false,
                copyInstanceOnItemCopy: false,
                fields: [
                    {
                        id: 'owner-field-id',
                        type: 'user',
                        key: 'owner',
                        displayName: 'Owner',
                        hidden: false,
                        description: 'Assign an owner to this file',
                    },
                ],
            },
        ],
        next_marker: null,
        prev_marker: null,
    },
};

export const mockMetadataInstancesWithUserField = {
    url: `${apiV2Path}/files/${fileIdWithMetadata}/metadata`,
    response: {
        entries: [
            {
                $id: 'user-field-instance-id',
                $version: 1,
                $type: 'userTemplate-453ffc2f-bf5a-464c-a004-476a4eac20fd',
                $parent: `file_${fileIdWithMetadata}`,
                $typeVersion: 1,
                $template: 'userTemplate',
                $scope: 'enterprise_173733877',
                $templateKey: 'userTemplate',
                // Contact shape the picker/list already understand. Real instance
                // values will be ids once the metadata API contract lands.
                owner: [
                    {
                        email: 'awong@example.com',
                        id: 1,
                        name: 'Alice Wong',
                        type: 'user' as const,
                        value: '1',
                    },
                ],
                $canEdit: true,
            },
        ],
        limit: 100,
    },
};

const filterEntries = <T extends { name: string; email?: string; login?: string }>(
    entries: T[],
    filterTerm: string,
): T[] => {
    if (!filterTerm) {
        return entries;
    }

    const normalizedFilterTerm = filterTerm.toLowerCase();

    return entries.filter(entry => {
        const nameMatch = entry.name.toLowerCase().includes(normalizedFilterTerm);
        const emailMatch = (entry.email ?? entry.login ?? '').toLowerCase().includes(normalizedFilterTerm);

        return nameMatch || emailMatch;
    });
};

export const userFieldMockHandlers: HttpHandler[] = [
    http.get(mockUserRequest.url, () => {
        return HttpResponse.json(mockUserRequest.response);
    }),
    http.get(mockFileRequest.url, () => {
        return HttpResponse.json(mockFileRequest.response);
    }),
    http.get(mockGlobalMetadataTemplates.url, () => {
        return HttpResponse.json(mockGlobalMetadataTemplates.response);
    }),
    http.get(mockMetadataInstancesWithUserField.url, () => {
        return HttpResponse.json(mockMetadataInstancesWithUserField.response);
    }),
    http.get(mockEnterpriseUsers.url, ({ request }) => {
        const url = new URL(request.url);
        // `/users` must not swallow `/users/me` (current-user fetch).
        if (url.pathname.endsWith('/users/me')) {
            return HttpResponse.json(mockUserRequest.response);
        }

        const filterTerm = url.searchParams.get('filter_term') ?? '';

        return HttpResponse.json({
            entries: filterEntries(mockEnterpriseUsers.entries, filterTerm),
            limit: 100,
            next_marker: null,
        });
    }),
    http.get(mockEnterpriseGroups.url, ({ request }) => {
        const url = new URL(request.url);
        const filterTerm = url.searchParams.get('filter_term') ?? '';

        return HttpResponse.json({
            entries: filterEntries(mockEnterpriseGroups.entries, filterTerm),
            limit: 100,
            next_marker: null,
        });
    }),
];
