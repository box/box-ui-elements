// @flow
import isHidden from '../metadataUtil';

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
