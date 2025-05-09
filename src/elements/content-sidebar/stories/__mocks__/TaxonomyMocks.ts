import { http, HttpResponse } from 'msw';
import type { HttpHandler } from 'msw';

import { DEFAULT_HOSTNAME_API } from '../../../../constants';
import { fileIdWithMetadata, mockFileRequest } from './MetadataSidebarRedesignedMocks';

const apiV2Path = `${DEFAULT_HOSTNAME_API}/2.0`;

export const multilevelTaxonomyLevels = [
    {
        display_name: 'Country',
        description: 'Country',
        level: 1,
    },
    {
        display_name: 'Region',
        description: 'Region',
        level: 2,
    },
    {
        displayName: 'City',
        display_name: 'City',
        level: 3,
    },
];

export const singlelevelTaxonomyLevels = [
    {
        display_name: 'Colour',
        description: 'Colour',
        level: 1,
    },
];

export const mockMetadataTemplatesWithMultilevelTaxonomy = {
    url: `${apiV2Path}/metadata_templates/enterprise`,
    response: {
        limit: 1000,
        entries: [
            {
                id: 'multilevel-taxonomy-template',
                type: 'metadata_template',
                templateKey: 'myTaxonomy',
                scope: 'enterprise_173733877',
                displayName: 'My Taxonomy',
                hidden: false,
                copyInstanceOnItemCopy: false,
                fields: [
                    {
                        id: 'another-field-id',
                        type: 'string',
                        key: 'anotherAttribute',
                        displayName: 'Another Attribute',
                        hidden: false,
                    },
                    {
                        id: 'multilevel-taxonomy-field-id',
                        type: 'taxonomy',
                        key: 'multiLevel',
                        displayName: 'Multi level taxonomy',
                        hidden: false,
                        namespace: 'testNamespace',
                        taxonomyKey: 'multilevel-taxonomy',
                        levels: multilevelTaxonomyLevels,
                        optionsRules: { multiSelect: true, selectableLevels: [3] },
                    },
                ],
            },
        ],
        next_marker: null,
        prev_marker: null,
    },
};

export const mockMetadataTemplatesWithSinglelevelTaxonomy = {
    url: `${apiV2Path}/metadata_templates/enterprise`,
    response: {
        limit: 1000,
        entries: [
            {
                id: 'singlelevel-taxonomy-template',
                type: 'metadata_template',
                templateKey: 'myTaxonomy',
                scope: 'enterprise_173733877',
                displayName: 'My Taxonomy',
                hidden: false,
                copyInstanceOnItemCopy: false,
                fields: [
                    {
                        id: 'singlelevel-taxonomy-id',
                        type: 'taxonomy',
                        key: 'singleLevel',
                        displayName: 'Single level taxonomy',
                        hidden: false,
                        namespace: 'testNamespace',
                        taxonomyKey: 'singlelevel-taxonomy',
                        optionsRules: { multiSelect: true, selectableLevels: [1] },
                    },
                    {
                        id: 'another-field-id',
                        type: 'string',
                        key: 'anotherAttribute',
                        displayName: 'Another Attribute',
                        hidden: false,
                    },
                ],
            },
        ],
        next_marker: null,
        prev_marker: null,
    },
};

export const mockMetadataInstancesWithTaxonomy = {
    url: `${apiV2Path}/files/${fileIdWithMetadata}/metadata`,
    response: {
        entries: [
            {
                $id: 'metadata-id',
                $version: 0,
                $type: 'myTaxonomy-123',
                $parent: 'file_415542803939',
                $typeVersion: 2,
                $template: 'myTaxonomy',
                $scope: 'enterprise_173733877',
                $canEdit: true,
                anotherAttribute: 'test value',
                singleLevel: [
                    {
                        displayName: 'Blue',
                        id: 'blue-id',
                        level: '1',
                        nodePath: null,
                        parentId: null,
                    },
                ],
                multiLevel: [
                    {
                        displayName: 'London',
                        id: 'london-l3-id',
                        level: '3',
                        nodePath: ['england-l2-id', 'uk-l1-id'],
                        parentId: 'england-l2-id',
                    },
                ],
            },
        ],
        limit: 100,
    },
};

export const mockMultilevelTaxonomyOptions = {
    url: `${apiV2Path}/metadata_templates/enterprise_173733877/myTaxonomy/fields/multiLevel/options`,
    response: {
        firstLevel: {
            entries: [
                {
                    id: 'uk-l1-id',
                    display_name: 'United Kingdom',
                    level: 1,
                    ancestors: [],
                    selectable: false,
                },
                {
                    id: 'japan-l1-id',
                    display_name: 'Japan',
                    level: 1,
                    ancestors: [],
                    selectable: false,
                },
            ],
            taxonomy_id: 'multilevel-taxonomy-id',
        },
        'uk-l1-id': {
            entries: [
                {
                    id: 'england-l2-id',
                    display_name: 'England',
                    level: 2,
                    ancestors: ['uk-l1-id'],
                    selectable: false,
                },
                {
                    id: 'scotland-l2-id',
                    ancestors: [
                        {
                            id: 'uk-l1-id',
                            display_name: 'United Kingdom',
                            level: 1,
                        },
                    ],
                    display_name: 'Scotland',
                    level: 2,
                    selectable: true,
                },
                {
                    id: 'wales-l2-id',
                    ancestors: [
                        {
                            id: 'uk-l1-id',
                            display_name: 'United Kingdom',
                            level: 1,
                        },
                    ],
                    display_name: 'Wales',
                    level: 2,
                    selectable: true,
                },
            ],
            taxonomy_id: 'multilevel-taxonomy-id',
        },
        'england-l2-id': {
            entries: [
                {
                    id: 'london-l3-id',
                    ancestors: [
                        {
                            id: 'uk-l1-id',
                            display_name: 'United Kingdom',
                            level: 1,
                        },
                        {
                            id: 'england-l2-id',
                            display_name: 'England',
                            level: 2,
                        },
                    ],
                    display_name: 'London',
                    level: 3,
                    selectable: true,
                },
            ],
            taxonomy_id: 'multilevel-taxonomy-id',
        },
        'japan-l1-id': {
            entries: [
                {
                    id: 'tokyo-l2-id',
                    ancestors: [
                        {
                            id: 'japan-l1-id',
                            display_name: 'Japan',
                            level: 1,
                        },
                    ],
                    display_name: 'Tokyo',
                    level: 2,
                    selectable: true,
                },
                {
                    id: 'hokkaido-l2-id',
                    ancestors: [
                        {
                            id: 'japan-l1-id',
                            display_name: 'Japan',
                            level: 1,
                        },
                    ],
                    display_name: 'Hokkaido',
                    level: 2,
                    selectable: true,
                },
                {
                    id: 'iwate-l2-id',
                    ancestors: [
                        {
                            id: 'japan-l1-id',
                            display_name: 'Japan',
                            level: 1,
                        },
                    ],
                    display_name: 'Iwate',
                    level: 2,
                    selectable: true,
                },
                {
                    id: 'nagano-l2-id',
                    ancestors: [
                        {
                            id: 'japan-l1-id',
                            display_name: 'Japan',
                            level: 1,
                        },
                    ],
                    display_name: 'Nagano',
                    level: 2,
                    selectable: true,
                },
            ],
            taxonomy_id: 'multilevel-taxonomy-id',
        },
        'hokkaido-l2-id': {
            entries: [
                {
                    id: 'sapporo-l3-id',
                    ancestors: [
                        {
                            id: 'japan-l1-id',
                            display_name: 'Japan',
                            level: 1,
                        },
                        {
                            id: 'hokkaido-l2-id',
                            display_name: 'Hokkaido',
                            level: 2,
                        },
                    ],
                    display_name: 'Sapporo',
                    level: 3,
                    selectable: true,
                },
            ],
            taxonomy_id: 'multilevel-taxonomy-id',
        },
    },
};

export const mockSinglelevelTaxonomyOptions = {
    url: `${apiV2Path}/metadata_templates/enterprise_173733877/myTaxonomy/fields/singleLevel/options`,
    response: {
        entries: [
            {
                id: 'blue-id',
                display_name: 'Blue',
                level: 1,
                ancestors: [],
                selectable: true,
            },
            {
                id: 'red-id',
                display_name: 'Red',
                level: 1,
                ancestors: [],
                selectable: true,
            },
            {
                id: 'green-id',
                display_name: 'Green',
                level: 1,
                ancestors: [],
                selectable: true,
            },
        ],
        taxonomy_id: 'singlelevel-taxonomy-id',
    },
};

export const mockMultilevelTaxonomy = {
    url: `${apiV2Path}/metadata_taxonomies/testNamespace/multilevel-taxonomy`,
    response: {
        display_name: 'Multilevel Taxonomy',
        id: 'multilevel-taxonomy-id',
        key: 'multilevel-taxonomy',
        levels: multilevelTaxonomyLevels,
        namespace: 'testNamespace',
    },
};

export const mockSinglelevelTaxonomy = {
    url: `${apiV2Path}/metadata_taxonomies/testNamespace/singlelevel-taxonomy`,
    response: {
        display_name: 'Singlelevel Taxonomy',
        id: 'singlelevel-taxonomy-id',
        key: 'singlelevel-taxonomy',
        levels: singlelevelTaxonomyLevels,
        namespace: 'testNamespace',
    },
};

export const mockMultilevelTaxonomyNodes = {
    url: `${apiV2Path}/metadata_taxonomies/testNamespace/multilevel-taxonomy/nodes/london-l3-id?include-ancestors=true`,
    response: {
        id: 'london-l3-id',
        ancestors: [
            { level: 2, id: 'england-l2-id', display_name: 'England' },
            { level: 1, id: 'uk-l1-id', display_name: 'United Kingdom' },
        ],
        display_name: 'London',
        level: 3,
        selectable: true,
        parent_id: 'england-l2-id',
        node_path: ['uk-l1-id', 'england-l2-id'],
    },
};

export const mockSinglelevelTaxonomyNodes = {
    url: `${apiV2Path}/metadata_taxonomies/testNamespace/singlelevel-taxonomy/nodes/blue-id?include-ancestors=true`,
    response: {
        id: 'blue-id',
        ancestors: [],
        display_name: 'Blue',
        level: 1,
        selectable: true,
        parent_id: null,
        node_path: [],
    },
};

export const taxonomyMockHandlers: HttpHandler[] = [
    http.get(mockFileRequest.url, () => {
        return HttpResponse.json(mockFileRequest.response);
    }),
    http.get(mockMetadataInstancesWithTaxonomy.url, () => {
        return HttpResponse.json(mockMetadataInstancesWithTaxonomy.response);
    }),
    http.get(mockMultilevelTaxonomy.url, () => {
        return HttpResponse.json(mockMultilevelTaxonomy.response);
    }),
    http.get(mockSinglelevelTaxonomy.url, () => {
        return HttpResponse.json(mockSinglelevelTaxonomy.response);
    }),
    http.get(mockMultilevelTaxonomyNodes.url, () => {
        return HttpResponse.json(mockMultilevelTaxonomyNodes.response);
    }),
    http.get(mockSinglelevelTaxonomyNodes.url, () => {
        return HttpResponse.json(mockSinglelevelTaxonomyNodes.response);
    }),
    http.get(mockMultilevelTaxonomyOptions.url, ({ request }) => {
        const url = new URL(request.url);
        const ancestorId = url.searchParams.get('ancestor_id');

        if (!ancestorId) {
            return HttpResponse.json(mockMultilevelTaxonomyOptions.response.firstLevel);
        }
        return HttpResponse.json(mockMultilevelTaxonomyOptions.response[ancestorId]);
    }),
    http.get(mockSinglelevelTaxonomyOptions.url, () => {
        return HttpResponse.json(mockSinglelevelTaxonomyOptions.response);
    }),
];
