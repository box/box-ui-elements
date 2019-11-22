// @flow
import { isHidden, normalizeTemplateFilters, normalizeTemplates } from '../metadataUtil';

describe('isHidden()', () => {
    [
        {
            object: {
                id: '1',
                scope: 'scope 1',
                templateKey: 'template',
                displayName: 'template 1',
                fields: [],
                hidden: true,
            },
            description: 'Hidden MetadataTemplate 1',
            expected: true,
        },
        {
            object: {
                id: '2',
                scope: 'scope 2',
                templateKey: 'template',
                displayName: 'template 2',
                fields: [],
                isHidden: true,
            },
            description: 'Hidden MetadataTemplate 2',
            expected: true,
        },
        {
            object: {
                id: '3',
                scope: 'scope 3',
                templateKey: 'template',
                displayName: 'template 3',
                fields: [],
                isHidden: false,
            },
            description: 'Visible MetadataTemplate 3',
            expected: false,
        },
        {
            object: {
                id: '4',
                scope: 'scope 4',
                templateKey: 'template',
                displayName: 'template 4',
                fields: [],
                hidden: false,
            },
            description: 'Visible MetadataTemplate 4',
            expected: false,
        },
        {
            object: {
                id: '5',
                type: 'date',
                key: 'field 5',
                displayName: 'field 5',
                isHidden: true,
            },
            description: 'Hidden Field 5',
            expected: true,
        },
        {
            object: {
                id: '6',
                type: 'date',
                key: 'field 6',
                displayName: 'field 6',
                hidden: true,
            },
            description: 'Hidden Field 6',
            expected: true,
        },
        {
            object: {
                id: '7',
                type: 'date',
                key: 'field 7',
                displayName: 'field 7',
                isHidden: false,
            },
            description: 'Visible Field 7',
            expected: false,
        },
        {
            object: {
                id: '8',
                type: 'date',
                key: 'field 8',
                displayName: 'field 8',
                isHidden: false,
            },
            description: 'Visible Field 8',
            expected: false,
        },
    ].forEach(({ description, object, expected }) => {
        test(description, () => {
            const actual = isHidden(object);
            expect(actual).toEqual(expected);
        });
    });
});

describe('normalizeTemplateFilters()', () => {
    test.each`
        description                                                         | filters                        | expected
        ${'should convert a single filter into a Set object with one item'} | ${'abcde'}                     | ${new Set(['abcde'])}
        ${'should convert multiple template filters into a Set object'}     | ${['ghijk', 'lmnop', 'uvxyz']} | ${new Set(['ghijk', 'lmnop', 'uvxyz'])}
    `('$description', ({ filters, expected }) => {
        expect(normalizeTemplateFilters(filters)).toEqual(expected);
    });
});

describe('normalizeTemplates()', () => {
    const sampleTemplates = [
        {
            displayName: 'Animals',
            fields: [
                {
                    displayName: 'Species',
                    id: 'species',
                    key: 'species',
                    options: [
                        { id: 'armadillo', key: 'armadillo' },
                        { id: 'narwhal', key: 'narwhal' },
                    ],
                    type: 'multiSelect',
                },
                {
                    displayName: 'Name',
                    id: 'name',
                    key: 'name',
                    type: 'string',
                },
                {
                    displayName: 'Date of birth',
                    id: 'dob',
                    key: 'dob',
                    type: 'date',
                },
                {
                    displayName: 'Weight',
                    id: 'weight',
                    key: 'weight',
                    type: 'float',
                },
                {
                    displayName: 'Color',
                    id: 'color',
                    key: 'color',
                    options: [
                        { id: 'brown', key: 'brown' },
                        { id: 'gray', key: 'gray' },
                        { id: 'pink', key: 'pink' },
                        { id: 'blue', key: 'blue' },
                        { id: 'mottled', key: 'mottled' },
                        { id: 'striped', key: 'striped' },
                    ],
                    type: 'multiSelect',
                },
            ],
            id: 'animals',
            templateKey: 'animals',
        },
        {
            displayName: 'Sofas',
            fields: [
                {
                    displayName: 'Style',
                    id: 'style',
                    key: 'style',
                    options: [
                        { id: 'midCenturyModern', key: 'Mid-century modern' },
                        { id: 'farmhouse', key: 'Farmhouse' },
                        { id: 'glam', key: 'Glam' },
                        { id: 'bohemian', key: 'Bohemian' },
                        { id: 'frenchCountry', key: 'French country' },
                        { id: 'coastal', key: 'Coastal' },
                    ],
                    type: 'multiSelect',
                },
                {
                    displayName: 'Cost',
                    id: 'cost',
                    key: 'cost',
                    type: 'float',
                },
                {
                    displayName: 'Handmade',
                    id: 'handmade',
                    key: 'handmade',
                    options: [
                        { id: 'yes', key: 'yes' },
                        { id: 'no', key: 'no' },
                    ],
                    type: 'multiSelect',
                },
            ],
            id: 'sofas',
            templateKey: 'sofas',
        },
        {
            displayName: 'Books',
            fields: [
                {
                    displayName: 'Genre',
                    id: 'genre',
                    key: 'genre',
                    options: [
                        { id: 'scienceFiction', key: 'Science Fiction' },
                        { id: 'fantasy', key: 'Fantasy' },
                        { id: 'mystery', key: 'Mystery' },
                        { id: 'thriller', key: 'Thriller' },
                        { id: 'postmodern', key: 'Postmodern' },
                        { id: 'drama', key: 'Drama' },
                    ],
                    type: 'multiSelect',
                },
                {
                    displayName: 'Cost',
                    id: 'cost',
                    key: 'cost',
                    type: 'float',
                },
                {
                    displayName: 'Status',
                    id: 'status',
                    key: 'status',
                    options: [
                        { id: 'read', key: 'Read' },
                        { id: 'wantToRead', key: 'Want to read' },
                    ],
                    type: 'multiSelect',
                },
            ],
            id: 'books',
            templateKey: 'books',
        },
    ];
    const templateWithFilteredFields = [
        {
            displayName: 'Books',
            fields: [
                {
                    displayName: 'Genre',
                    id: 'genre',
                    key: 'genre',
                    options: [
                        { id: 'scienceFiction', key: 'Science Fiction' },
                        { id: 'fantasy', key: 'Fantasy' },
                        { id: 'mystery', key: 'Mystery' },
                        { id: 'thriller', key: 'Thriller' },
                        { id: 'postmodern', key: 'Postmodern' },
                        { id: 'drama', key: 'Drama' },
                    ],
                    type: 'multiSelect',
                },
                {
                    displayName: 'Status',
                    id: 'status',
                    key: 'status',
                    options: [
                        { id: 'read', key: 'Read' },
                        { id: 'wantToRead', key: 'Want to read' },
                    ],
                    type: 'multiSelect',
                },
            ],
            id: 'books',
            templateKey: 'books',
        },
    ];
    test.each`
        description                                                                                     | templates          | selectedTemplateKey               | templateFilters              | expected
        ${'should return an empty array if the provided template key is not found'}                     | ${sampleTemplates} | ${'cars'}                         | ${['make', 'model', 'year']} | ${[]}
        ${'should return an array of templates if no selected template is provided'}                    | ${sampleTemplates} | ${undefined}                      | ${['genre', 'status']}       | ${sampleTemplates}
        ${'should return an array of one template with all fields if no template filters are provided'} | ${sampleTemplates} | ${sampleTemplates[0].templateKey} | ${undefined}                 | ${[sampleTemplates[0]]}
        ${'should return an array of one template with filtered fields'}                                | ${sampleTemplates} | ${sampleTemplates[2].templateKey} | ${['genre', 'status']}       | ${templateWithFilteredFields}
    `('$description', ({ templates, selectedTemplateKey, templateFilters, expected }) => {
        expect(normalizeTemplates(templates, selectedTemplateKey, templateFilters)).toEqual(expected);
    });
});
