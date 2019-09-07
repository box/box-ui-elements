import * as React from 'react';
import uniqueId from 'lodash/uniqueId';

import MetadataInstanceEditor from '../../src/features/metadata-instance-editor/MetadataInstanceEditor';
import LoadingIndicator from '../../src/components/loading-indicator';

// Templates
const template0 = {
    id: 'template0',
    templateKey: 'template0',
    displayName: 'template0 simple',
    scope: 'enterprise_123',
    fields: [
        {
            id: 'field0',
            type: 'string',
            key: 'somefieldkey',
            displayName: 'Description of the field',
        },
    ],
};

const template1 = {
    id: 'template1',
    templateKey: 'template1',
    displayName: 'template1 title',
    scope: 'enterprise_123',
    fields: [
        {
            id: 'field0',
            type: 'string',
            key: 'nodescfield',
            displayName: 'No Description Field',
        },
        {
            id: 'field1',
            type: 'string',
            key: 'stringfield',
            displayName: 'String Field',
            description: 'example of a string field',
        },
        {
            id: 'field2',
            type: 'string',
            key: 'emptystring',
            displayName: 'Empty String Field',
            description: 'example of an empty string field',
        },
        {
            id: 'field3',
            type: 'float',
            key: 'floatfield',
            displayName: 'Float Field',
            description: 'example of a float field',
        },
        {
            id: 'field4',
            type: 'float',
            key: 'emptyfloat',
            displayName: 'Empty Float Field',
            description: 'example of an empty float field',
        },
        {
            id: 'field5',
            type: 'enum',
            key: 'enumfield',
            displayName: 'Enum Field',
            description: 'example of a enum field',
            options: [{ key: 'yes' }, { key: 'no' }],
        },
        {
            id: 'field6',
            type: 'enum',
            key: 'emptyenumfield',
            displayName: 'Empty Enum Field',
            description: 'example of an empty enum field',
            options: [{ key: 'yes' }, { key: 'no' }],
        },
        {
            id: 'field7',
            type: 'date',
            key: 'datefield',
            displayName: 'Date Field',
            description: 'example of a date field',
        },
        {
            id: 'field8',
            type: 'date',
            key: 'emptydatefield',
            displayName: 'Empty Date Field',
            description: 'example of an empty date field',
        },
        {
            id: 'field9',
            type: 'multiSelect',
            key: 'multiselectfield',
            displayName: 'Multi-Select Field',
            description: 'example of a multi-select field',
            options: [
                { key: 'yes' },
                { key: 'no' },
                { key: 'maybe' },
                { key: 'idk?' },
                { key: 'oh well' },
                { key: 'whatever' },
            ],
        },
        {
            id: 'field10',
            type: 'multiSelect',
            key: 'emptymultiselectfield',
            displayName: 'Empty Multi-Select Field',
            description: 'example of an empty multi-select field',
            options: [
                { key: 'yes' },
                { key: 'no' },
                { key: 'maybe' },
                { key: 'idk?' },
                { key: 'oh well' },
                { key: 'whatever' },
            ],
        },
        {
            id: 'field11',
            type: 'integer',
            key: 'integerfield',
            displayName: 'Integer Field',
            description: 'example of an integer field',
        },
        {
            id: 'field12',
            type: 'integer',
            key: 'emptyintegerfield',
            displayName: 'Empty Integer Field',
            description: 'example of an empty integer field',
        },
        {
            id: 'field13',
            type: 'string',
            key:
                'longlonglonglonglonglonglonglonglonglonglongverylonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglongverylonglonglonglonglonglonglonglonglonglonglonglonglonglonglong',
            displayName:
                'longlonglonglonglonglonglonglonglonglonglongverylonglonglonglonglonglonglonglonglonglonglonglonglonglonglong',
            description:
                'longlonglonglonglonglonglonglonglonglonglongverylonglonglonglonglonglonglonglonglonglonglonglonglonglonglong',
        },
        {
            id: 'field14',
            type: 'string',
            key:
                'long long longlong long longlong long longlong long longlong long longlong long longlong long longlong long longlong long long',
            displayName:
                'long long longlong long longlong long longlong long longlong long longlong long longlong long longlong long longlong long long',
            description:
                'long long longlong long longlong long longlong long longlong long longlong long longlong long longlong long longlong long long',
        },
        {
            id: 'field15',
            type: 'enum',
            key:
                'enumlonglonglonglonglonglonglonglonglonglonglongverylonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglongverylonglonglonglonglonglonglonglonglonglonglonglonglonglonglong',
            displayName:
                'enumlonglonglonglonglonglonglonglonglonglonglongverylonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglongverylonglonglonglonglonglonglonglonglonglonglonglonglonglonglong',
            description:
                'enumlonglonglonglonglonglonglonglonglonglonglongverylonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglongverylonglonglonglonglonglonglonglonglonglonglonglonglonglonglong',
            options: [
                { key: 'yes' },
                { key: 'no' },
                { key: 'maybe' },
                { key: 'idk?' },
                { key: 'oh well' },
                { key: 'whatever' },
            ],
        },
        {
            id: 'field16',
            type: 'multiSelect',
            key:
                'multiselectlonglonglonglonglonglonglonglonglonglonglongverylonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglongverylonglonglonglonglonglonglonglonglonglonglonglonglonglonglong',
            displayName:
                'multiSelectlonglonglonglonglonglonglonglonglonglonglongverylonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglongverylonglonglonglonglonglonglonglonglonglonglonglonglonglonglong',
            description:
                'multiSelectlonglonglonglonglonglonglonglonglonglonglongverylonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglongverylonglonglonglonglonglonglonglonglonglonglonglonglonglonglong',
            options: [
                { key: 'yes' },
                { key: 'no' },
                { key: 'maybe' },
                { key: 'idk?' },
                { key: 'oh well' },
                { key: 'whatever' },
            ],
        },
        {
            id: 'field17',
            type: 'enum',
            key:
                'enumlong long longlong long longlong long longlong long longlong long longlong long longlong long longlong long longlong long long',
            displayName:
                'enumlong long longlong long longlong long longlong long longlong long longlong long longlong long longlong long longlong long long',
            description:
                'enumlong long longlong long longlong long longlong long longlong long longlong long longlong long longlong long longlong long long',
            options: [
                { key: 'yes' },
                { key: 'no' },
                { key: 'maybe' },
                { key: 'idk?' },
                { key: 'oh well' },
                { key: 'whatever' },
            ],
        },
        {
            id: 'field18',
            type: 'multiSelect',
            key:
                'multiSelectlong long longlong long longlong long longlong long longlong long longlong long longlong long longlong long longlong long long',
            displayName:
                'multiSelectlong long longlong long longlong long longlong long longlong long longlong long longlong long longlong long longlong long long',
            description:
                'multiSelectlong long longlong long longlong long longlong long longlong long longlong long longlong long longlong long longlong long long',
            options: [
                { key: 'yes' },
                { key: 'no' },
                { key: 'maybe' },
                { key: 'idk?' },
                { key: 'oh well' },
                { key: 'whatever' },
            ],
        },
        {
            id: 'field19',
            type: 'badfieldtype',
            key: 'badfieldtype',
            displayName: 'badfieldtype',
            description: 'bad field type',
        },
    ],
};

const template2 = {
    id: 'template2',
    templateKey: 'template2',
    displayName: 'another template2 title',
    scope: 'enterprise_123',
    fields: [
        {
            id: 'field0',
            type: 'string',
            key: 'nodescfield',
            displayName: 'No Description Field',
        },
        {
            id: 'field1',
            type: 'string',
            key: 'stringfield',
            displayName: 'String Field',
            description: 'example of a string field',
        },
        {
            id: 'field2',
            type: 'string',
            key: 'emptystring',
            displayName: 'Empty String Field',
            description: 'example of an empty string field',
        },
        {
            id: 'field3',
            type: 'float',
            key: 'floatfield',
            displayName: 'Float Field',
            description: 'example of a float field',
        },
        {
            id: 'field4',
            type: 'float',
            key: 'emptyfloat',
            displayName: 'Empty Float Field',
            description: 'example of an empty float field',
        },
        {
            id: 'field5',
            type: 'enum',
            key: 'enumfield',
            displayName: 'Enum Field',
            description: 'example of a enum field',
            options: [{ key: 'yes' }, { key: 'no' }],
        },
        {
            id: 'field6',
            type: 'enum',
            key: 'emptyenumfield',
            displayName: 'Empty Enum Field',
            description: 'example of an empty enum field',
            options: [{ key: 'yes' }, { key: 'no' }],
        },
        {
            id: 'field7',
            type: 'date',
            key: 'datefield',
            displayName: 'Date Field',
            description: 'example of a date field',
        },
        {
            id: 'field8',
            type: 'date',
            key: 'emptydatefield',
            displayName: 'Empty Date Field',
            description: 'example of an empty date field',
        },
    ],
};

const template3 = {
    id: 'template3',
    templateKey: 'template3',
    displayName: 'yet another template3 title',
    scope: 'enterprise_123',
    fields: [
        {
            id: 'field0',
            type: 'string',
            key: 'nodescfield',
            displayName: 'No Description Field',
        },
        {
            id: 'field1',
            type: 'string',
            key: 'stringfield',
            displayName: 'String Field',
            description: 'example of a string field',
        },
        {
            id: 'field2',
            type: 'string',
            key: 'emptystring',
            displayName: 'Empty String Field',
            description: 'example of an empty string field',
        },
        {
            id: 'field3',
            type: 'float',
            key: 'floatfield',
            displayName: 'Float Field',
            description: 'example of a float field',
        },
        {
            id: 'field4',
            type: 'float',
            key: 'emptyfloat',
            displayName: 'Empty Float Field',
            description: 'example of an empty float field',
        },
        {
            id: 'field5',
            type: 'enum',
            key: 'enumfield',
            displayName: 'Enum Field',
            description: 'example of a enum field',
            options: [{ key: 'yes' }, { key: 'no' }],
        },
        {
            id: 'field6',
            type: 'enum',
            key: 'emptyenumfield',
            displayName: 'Empty Enum Field',
            description: 'example of an empty enum field',
            options: [{ key: 'yes' }, { key: 'no' }],
        },
        {
            id: 'field7',
            type: 'date',
            key: 'datefield',
            displayName: 'Date Field',
            description: 'example of a date field',
        },
        {
            id: 'field8',
            type: 'date',
            key: 'emptydatefield',
            displayName: 'Empty Date Field',
            description: 'example of an empty date field',
        },
    ],
};

const template4 = {
    id: 'template4',
    templateKey: 'template4',
    displayName: 'best template4 title',
    scope: 'enterprise_123',
    fields: [
        {
            id: 'field0',
            type: 'string',
            key: 'nodescfield',
            displayName: 'No Description Field',
        },
        {
            id: 'field1',
            type: 'string',
            key: 'stringfield',
            displayName: 'String Field',
            description: 'example of a string field',
        },
        {
            id: 'field2',
            type: 'string',
            key: 'emptystring',
            displayName: 'Empty String Field',
            description: 'example of an empty string field',
        },
        {
            id: 'field3',
            type: 'float',
            key: 'floatfield',
            displayName: 'Float Field',
            description: 'example of a float field',
        },
        {
            id: 'field4',
            type: 'float',
            key: 'emptyfloat',
            displayName: 'Empty Float Field',
            description: 'example of an empty float field',
        },
        {
            id: 'field5',
            type: 'enum',
            key: 'enumfield',
            displayName: 'Enum Field',
            description: 'example of a enum field',
            options: [{ key: 'yes' }, { key: 'no' }],
        },
        {
            id: 'field6',
            type: 'enum',
            key: 'emptyenumfield',
            displayName: 'Empty Enum Field',
            description: 'example of an empty enum field',
            options: [{ key: 'yes' }, { key: 'no' }],
        },
        {
            id: 'field7',
            type: 'date',
            key: 'datefield',
            displayName: 'Date Field',
            description: 'example of a date field',
        },
        {
            id: 'field8',
            type: 'date',
            key: 'emptydatefield',
            displayName: 'Empty Date Field',
            description: 'example of an empty date field',
        },
    ],
};

const template5 = {
    id: 'template5',
    templateKey: 'template5',
    displayName: 'good template5 title',
    scope: 'enterprise_123',
    fields: [
        {
            id: 'field0',
            type: 'string',
            key: 'nodescfield',
            displayName: 'No Description Field',
        },
        {
            id: 'field1',
            type: 'string',
            key: 'stringfield',
            displayName: 'String Field',
            description: 'example of a string field',
        },
        {
            id: 'field2',
            type: 'string',
            key: 'emptystring',
            displayName: 'Empty String Field',
            description: 'example of an empty string field',
        },
        {
            id: 'field3',
            type: 'float',
            key: 'floatfield',
            displayName: 'Float Field',
            description: 'example of a float field',
        },
        {
            id: 'field4',
            type: 'float',
            key: 'emptyfloat',
            displayName: 'Empty Float Field',
            description: 'example of an empty float field',
        },
        {
            id: 'field5',
            type: 'enum',
            key: 'enumfield',
            displayName: 'Enum Field',
            description: 'example of a enum field',
            options: [{ key: 'yes' }, { key: 'no' }],
        },
        {
            id: 'field6',
            type: 'enum',
            key: 'emptyenumfield',
            displayName: 'Empty Enum Field',
            description: 'example of an empty enum field',
            options: [{ key: 'yes' }, { key: 'no' }],
        },
        {
            id: 'field7',
            type: 'date',
            key: 'datefield',
            displayName: 'Date Field',
            description: 'example of a date field',
        },
        {
            id: 'field8',
            type: 'date',
            key: 'emptydatefield',
            displayName: 'Empty Date Field',
            description: 'example of an empty date field',
        },
    ],
};

const properties = {
    id: 'properties',
    scope: 'global',
    templateKey: 'properties',
};

const template6 = {
    id: 'template6',
    templateKey: 'template6',
    displayName: 'template with some error',
    scope: 'enterprise_123',
    fields: [
        {
            id: 'field0',
            type: 'string',
            key: 'nodescfield',
            displayName: 'No Description Field',
        },
        {
            id: 'field1',
            type: 'string',
            key: 'stringfield',
            displayName: 'String Field',
            description: 'example of a string field',
        },
        {
            id: 'field2',
            type: 'string',
            key: 'emptystring',
            displayName: 'Empty String Field',
            description: 'example of an empty string field',
        },
        {
            id: 'field3',
            type: 'float',
            key: 'floatfield',
            displayName: 'Float Field',
            description: 'example of a float field',
        },
        {
            id: 'field4',
            type: 'float',
            key: 'emptyfloat',
            displayName: 'Empty Float Field',
            description: 'example of an empty float field',
        },
        {
            id: 'field5',
            type: 'enum',
            key: 'enumfield',
            displayName: 'Enum Field',
            description: 'example of a enum field',
            options: [{ key: 'yes' }, { key: 'no' }],
        },
        {
            id: 'field6',
            type: 'enum',
            key: 'emptyenumfield',
            displayName: 'Empty Enum Field',
            description: 'example of an empty enum field',
            options: [{ key: 'yes' }, { key: 'no' }],
        },
        {
            id: 'field7',
            type: 'date',
            key: 'datefield',
            displayName: 'Date Field',
            description: 'example of a date field',
        },
        {
            id: 'field8',
            type: 'date',
            key: 'emptydatefield',
            displayName: 'Empty Date Field',
            description: 'example of an empty date field',
        },
    ],
};

const template7 = {
    id: 'template7',
    templateKey: 'template7',
    displayName: 'non editable template',
    scope: 'enterprise_123',
    fields: [
        {
            id: 'field0',
            type: 'string',
            key: 'nodescfield',
            displayName: 'No Description Field',
        },
        {
            id: 'field1',
            type: 'string',
            key: 'stringfield',
            displayName: 'String Field',
            description: 'example of a string field',
        },
        {
            id: 'field2',
            type: 'string',
            key: 'emptystring',
            displayName: 'Empty String Field',
            description: 'example of an empty string field',
        },
        {
            id: 'field3',
            type: 'float',
            key: 'floatfield',
            displayName: 'Float Field',
            description: 'example of a float field',
        },
        {
            id: 'field4',
            type: 'float',
            key: 'emptyfloat',
            displayName: 'Empty Float Field',
            description: 'example of an empty float field',
        },
        {
            id: 'field5',
            type: 'enum',
            key: 'enumfield',
            displayName: 'Enum Field',
            description: 'example of a enum field',
            options: [{ key: 'yes' }, { key: 'no' }],
        },
        {
            id: 'field6',
            type: 'enum',
            key: 'emptyenumfield',
            displayName: 'Empty Enum Field',
            description: 'example of an empty enum field',
            options: [{ key: 'yes' }, { key: 'no' }],
        },
        {
            id: 'field7',
            type: 'date',
            key: 'datefield',
            displayName: 'Date Field',
            description: 'example of a date field',
        },
        {
            id: 'field8',
            type: 'date',
            key: 'emptydatefield',
            displayName: 'Empty Date Field',
            description: 'example of an empty date field',
        },
    ],
};

// Instances with templates metadata

const editor0 = {
    instance: {
        canEdit: true,
        id: 'editor0',
        data: {
            stringfield: 'some string',
            floatfield: 1,
            enumfield: 'yes',
            datefield: '2018-06-20T00:00:00.000Z',
        },
        cascadePolicy: {
            canEdit: true,
            isEnabled: false,
            id: 'some cascading policy id',
        },
    },
    template: template0,
};

const editor1 = {
    instance: {
        canEdit: true,
        id: 'editor1',
        data: {
            stringfield: 'some string',
            floatfield: 1,
            enumfield: 'yes',
            integerfield: 3,
            multiselectfield: ['no', 'maybe'],
            datefield: '2018-06-20T00:00:00.000Z',
        },
        cascadePolicy: {
            canEdit: true,
            isEnabled: false,
            id: 'some cascading policy id',
        },
    },
    template: template1,
};

const editor2 = {
    instance: {
        canEdit: true,
        id: 'editor2',
        data: {
            stringfield: 'some string',
            floatfield: 1,
            enumfield: 'yes',
            datefield: '2018-06-20T00:00:00.000Z',
        },
        cascadePolicy: {
            canEdit: true,
            isEnabled: true,
            id: 'some cascading policy id',
        },
    },
    template: template2,
};

const editor3 = {
    instance: {
        canEdit: true,
        id: 'editor3',
        data: {},
        cascadePolicy: {
            canEdit: true,
            isEnabled: true,
            id: 'some cascading policy id',
        },
    },
    template: template3,
};

const editor7 = {
    instance: {
        id: 'editor7',
        canEdit: false,
        data: {
            stringfield: 'some string',
            floatfield: 1,
            enumfield: 'yes',
            datefield: '2018-06-20T00:00:00.000Z',
        },
        cascadePolicy: {
            canEdit: true,
            isEnabled: true,
            id: 'some cascading policy id',
        },
    },
    template: template1,
};

const editor8 = {
    instance: {
        canEdit: false,
        id: 'editor8',
        data: {
            stringfield: 'some string',
            floatfield: 1,
            enumfield: 'yes',
            datefield: '2018-06-20T00:00:00.000Z',
        },
    },
    template: template7,
};

const editor9 = {
    instance: {
        id: 'editor9',
        canEdit: true,
        data: {
            stringfield: 'some string',
            floatfield: 1,
            enumfield: 'yes',
            datefield: '2018-06-20T00:00:00.000Z',
        },
    },
    template: template6,
    hasError: true,
};

const editor10 = {
    instance: {
        canEdit: true,
        id: 'editor10',
        data: {
            stringfield: 'some string',
            floatfield: 1,
            enumfield: 'yes',
            datefield: '2018-06-20T00:00:00.000Z',
        },
    },
    template: template2,
};

// Instances with custom metadata

const editor4 = {
    instance: {
        canEdit: true,
        id: 'editor4',
        data: {
            string: 'string',
            number: '1',
            bool: 'true',
        },
    },
    template: properties,
};

const editor5 = {
    instance: {
        canEdit: true,
        id: 'editor5',
        data: {},
    },
    template: properties,
    hasError: true,
};

const editor6 = {
    instance: {
        id: 'editor6',
        canEdit: false,
        data: {
            string: 'string',
            number: '1',
            bool: 'true',
        },
    },
    template: properties,
};

const getExtraTemplates = num =>
    new Array(num).fill(true).map((_, index) => ({
        id: `generatedtemplate-${index}`,
        templateKey: `generatedtemplate-${index}`,
        displayName: `generated template-${index}`,
        scope: 'enterprise_123',
        fields: [
            {
                id: 'field0',
                type: 'string',
                key: 'nodescfield',
                displayName: 'No Description Field',
            },
        ],
    }));

// State of templates from server
const templatesOnServer = [
    template0,
    template1,
    template2,
    template3,
    template4,
    template5,
    properties,
    template6,
    template7,
    ...getExtraTemplates(1),
];

// State of instances from server
const editorsOnServer = [
    editor0,
    editor1,
    editor2,
    editor3,
    editor4,
    editor5,
    editor6,
    editor7,
    editor8,
    editor9,
    editor10,
];

class MetadataExamples extends React.PureComponent {
    state = {};

    componentDidMount() {
        // Timeout to simulate network call
        setTimeout(() => {
            this.setState({
                editors: editorsOnServer.map(editor => ({
                    hasError: editor.hasError,
                    template: editor.template,
                    instance: {
                        id: editor.instance.id,
                        canEdit: editor.instance.canEdit,
                        data: { ...editor.instance.data },
                        cascadePolicy: { ...editor.instance.cascadePolicy },
                    },
                })),
            });
        }, 1000);

        // Timeout to simulate network call
        setTimeout(() => {
            this.setState({ templates: templatesOnServer.slice(0) });
        }, 1000);
    }

    onRemove = id => {
        // Timeout to simulate a network call
        setTimeout(() => {
            // Get rid of the editor whose instance id matches
            const editors = this.state.editors.filter(editor => editor.instance.id !== id);
            this.setState({ editors: editors.slice(0) }); // slice for react change detection
        }, 1000);
    };

    onAdd = template => {
        // Timeout to simulate network call
        setTimeout(() => {
            // The server applies the new instance (or dummy instance)
            const newEditor = {
                instance: {
                    canEdit: true,
                    id: uniqueId('i_'),
                    data: {},
                },
                template: this.state.templates.find(t => t.templateKey === template.templateKey),
            };
            editorsOnServer.push(newEditor);
            const editors = this.state.editors.slice(0);
            editors.push({ ...newEditor });
            this.setState({ editors });
        }, 1000);
    };

    onSave = (id, ops, cascadePolicy = {}) => {
        // What's being sent to the server to show in the examples page
        document.querySelector('.metadata-operations').textContent = JSON.stringify(ops, null, 2);
        document.querySelector('.metadata-cascading-policy').textContent = JSON.stringify(cascadePolicy, null, 2);

        // Timeout to simulate network call
        setTimeout(() => {
            // Find the editor that needs saving
            const editorOnServer = editorsOnServer.find(editor => editor.instance.id === id);

            // Iterate over all ops and apply them
            ops.forEach(op => {
                const key = op.path.substr(1);
                if (op.op === 'replace' || op.op === 'add') {
                    editorOnServer.instance.data[key] = op.value;
                } else if (op.op === 'remove') {
                    delete editorOnServer.instance.data[key];
                }
            });

            // Apply the cascading policy
            if (cascadePolicy) {
                if (cascadePolicy.isEnabled && !editorOnServer.instance.cascadePolicy) {
                    editorOnServer.instance.cascadePolicy = {
                        id: uniqueId('cascade_policy_id_'),
                    };
                } else if (!cascadePolicy.isEnabled && editorOnServer.instance.cascadePolicy) {
                    editorOnServer.instance.cascadePolicy = {
                        canEdit: true,
                    };
                }
            }

            // Server has saved the new data and will return an updated editor instance
            const editorOnClientIndex = this.state.editors.findIndex(editor => editor.instance.id === id);
            const editors = this.state.editors.slice(0); // clone for react changes
            editors.splice(editorOnClientIndex, 1, { ...editorOnServer });
            this.setState({ editors });
        }, 1000);
    };

    onModification = (id, isDirty) => {
        const editorOnClientIndex = this.state.editors.findIndex(editor => editor.instance.id === id);
        const editorOnClient = { ...this.state.editors[editorOnClientIndex] };
        editorOnClient.isDirty = isDirty;
        const editors = this.state.editors.slice(0); // clone for react changes
        editors.splice(editorOnClientIndex, 1, editorOnClient);
        this.setState({ editors });

        // To show on the examples page what all instances are dirty
        document.querySelector('.metadata-dirty').textContent = JSON.stringify(
            this.state.editors.filter(editor => editor.isDirty),
            null,
            2,
        );
    };

    render() {
        if (!this.state.templates || !this.state.editors) {
            return <LoadingIndicator />;
        }

        return (
            <div>
                <div>
                    <h3>Instances that are dirty</h3>
                    <pre className="metadata-dirty" />
                    <h3>Data saved</h3>
                    <pre className="metadata-operations" />
                    <h3>Cascading policy data saved</h3>
                    <pre className="metadata-cascading-policy" />
                </div>
                <br />
                <br />
                <br />
                <br />
                <h3>Editable Metadata with Cascade Policy applicable</h3>
                <div className="metadata-container">
                    <MetadataInstanceEditor
                        canAdd
                        editors={this.state.editors}
                        isCascadingPolicyApplicable
                        onAdd={this.onAdd}
                        onModification={this.onModification}
                        onRemove={this.onRemove}
                        onSave={this.onSave}
                        templates={this.state.templates}
                    />
                </div>
                <br />
                <br />
                <br />
                <br />
                <br />
                <h3>Editable Metadata with Cascade Policy not applicable</h3>
                <div className="metadata-container">
                    <MetadataInstanceEditor
                        canAdd
                        editors={this.state.editors}
                        onAdd={this.onAdd}
                        onModification={this.onModification}
                        onRemove={this.onRemove}
                        onSave={this.onSave}
                        templates={this.state.templates}
                        title={<h3>Metadata</h3>}
                    />
                </div>
                <br />
                <br />
                <h3>Empty State</h3>
                <div className="metadata-container">
                    <MetadataInstanceEditor
                        canAdd
                        onAdd={this.onAdd}
                        onModification={this.onModification}
                        onRemove={this.onRemove}
                        onSave={this.onSave}
                        templates={this.state.templates}
                    />
                </div>
                <br />
                <br />
                <br />
                <h3>Add Template Dropdown with No Templates on Server Message</h3>
                <div className="metadata-container">
                    <MetadataInstanceEditor
                        canAdd
                        editors={this.state.editors}
                        onAdd={this.onAdd}
                        onModification={this.onModification}
                        onRemove={this.onRemove}
                        onSave={this.onSave}
                        templates={[]}
                    />
                    {this.state.isBusy && (
                        <div className="metadata-is-busy">
                            <LoadingIndicator />
                        </div>
                    )}
                </div>
                <br />
                <br />
                <div>
                    <h3>Data to be saved</h3>
                    <pre className="metadata-operations" />
                </div>
            </div>
        );
    }
}

export default MetadataExamples;
