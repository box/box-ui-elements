import React from 'react';

import MetadataInstanceEditor from '../MetadataInstanceEditor';
import Instances from '../Instances';

// Templates

const template1 = {
    id: 'template1',
    templateKey: 'template1',
    displayName: 'template1 title',
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

const template2 = {
    id: 'template2',
    templateKey: 'template2',
    displayName: 'template2 title',
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
    displayName: 'template3 title',
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
    displayName: 'template4 title',
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
    displayName: 'template5 title',
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
    templateKey: 'properties',
};

// Instances with templates metadata

const editor1 = {
    instance: {
        canEdit: true,
        id: 'editor1',
        data: {
            stringfield: 'some string',
            floatfield: 1,
            enumfield: 'yes',
            datefield: '2018-06-20T00:00:00.000Z',
        },
    },
    template: template1,
};

const editor2 = {
    instance: {
        canEdit: false,
        id: 'editor2',
        data: {
            stringfield: 'some string',
            floatfield: 1,
            enumfield: 'yes',
            datefield: '2018-06-20T00:00:00.000Z',
        },
    },
    template: template2,
    isDirty: true,
};

const editor3 = {
    instance: {
        canEdit: true,
        id: 'editor3',
        data: {},
    },
    template: template3,
};

// Instances with custom metadata

const editor4 = {
    instance: {
        canEdit: false,
        id: 'editor4',
        data: {
            string: 'string',
            number: '1',
            bool: 'true',
        },
    },
    template: properties,
    hasError: true,
    isDirty: true,
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

// State of templates from server
const templatesOnServer = [template1, template2, template3, template4, template5, properties];

// State of editors from server
const editorsOnServer = [editor1, editor2, editor3, editor4, editor5];

describe('features/metadata-editor-editor/MetadataInstanceEditor', () => {
    test('should correctly render editors', () => {
        const wrapper = shallow(<MetadataInstanceEditor editors={editorsOnServer} templates={templatesOnServer} />);
        expect(wrapper).toMatchSnapshot();
    });

    test('should render EmptyContent if no editors', () => {
        const wrapper = shallow(
            <MetadataInstanceEditor editors={[]} onModification={jest.fn()} onSave={jest.fn()} templates={[]} />,
        );

        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render editors with template filters', () => {
        const selectedTemplateKey = 'armadillos';
        const wrapper = shallow(
            <MetadataInstanceEditor
                editors={editorsOnServer}
                selectedTemplateKey={selectedTemplateKey}
                templates={templatesOnServer}
            />,
        );
        const instances = wrapper.find(Instances);
        expect(instances).toHaveLength(1);
        expect(instances.prop('selectedTemplateKey')).toBe(selectedTemplateKey);
    });
});
