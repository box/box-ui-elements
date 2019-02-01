import React from 'react';

import TemplatedInstance from '../TemplatedInstance';

const data = {
    stringfield: 'some string',
    floatfield: 1,
    enumfield: 'yes',
    datefield: '2018-06-20T00:00:00.000Z',
};

const fields = [
    {
        id: 'field0',
        isHidden: true,
        type: 'string',
        key: 'hiddenfield',
        displayName: 'String Field that is hidden',
    },
    {
        id: 'field1',
        hidden: false,
        type: 'string',
        key: 'nodescfield',
        displayName: 'No Description Field',
    },
    {
        id: 'field2',
        hidden: false,
        type: 'string',
        key: 'stringfield',
        displayName: 'String Field',
        description: 'example of a string field',
    },
    {
        id: 'field3',
        hidden: false,
        type: 'string',
        key: 'emptystring',
        displayName: 'Empty String Field',
        description: 'example of an empty string field',
    },
    {
        id: 'field4',
        isHidden: false,
        type: 'float',
        key: 'floatfield',
        displayName: 'Float Field',
        description: 'example of a float field',
    },
    {
        id: 'field5',
        isHidden: false,
        type: 'float',
        key: 'emptyfloat',
        displayName: 'Empty Float Field',
        description: 'example of an empty float field',
    },
    {
        id: 'field6',
        isHidden: false,
        type: 'enum',
        key: 'enumfield',
        displayName: 'Enum Field',
        description: 'example of a enum field',
        options: [{ key: 'yes' }, { key: 'no' }],
    },
    {
        id: 'field7',
        isHidden: false,
        type: 'enum',
        key: 'emptyenumfield',
        displayName: 'Empty Enum Field',
        description: 'example of an empty enum field',
        options: [{ key: 'yes' }, { key: 'no' }],
    },
    {
        id: 'field8',
        hidden: false,
        type: 'date',
        key: 'datefield',
        displayName: 'Date Field',
        description: 'example of a date field',
    },
    {
        id: 'field9',
        hidden: false,
        type: 'date',
        key: 'emptydatefield',
        displayName: 'Empty Date Field',
        description: 'example of an empty date field',
    },
    {
        id: 'field10',
        isHidden: true,
        type: 'string',
        key: 'hiddenfield',
        displayName: 'Another string Field that is hidden',
    },
];

const allFieldsHidden = [
    {
        id: 'field0',
        isHidden: true,
        type: 'string',
        key: 'hiddenfield',
        displayName: 'String Field that is hidden',
    },
    {
        id: 'field1',
        hidden: true,
        type: 'string',
        key: 'nodescfield',
        displayName: 'No Description Field that is hidden',
    },
];

const noFieldsForTemplate = [];

describe('features/metadata-instance-editor/fields/TemplatedInstance', () => {
    test('should correctly render fields that are visible', () => {
        const wrapper = shallow(
            <TemplatedInstance
                data={data}
                dataValue="value"
                errors={{}}
                template={{
                    fields,
                }}
            />,
        );
        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render attributes hidden message', () => {
        const wrapper = shallow(
            <TemplatedInstance
                data={data}
                dataValue="value"
                errors={{}}
                template={{
                    fields: allFieldsHidden,
                }}
            />,
        );
        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render no attributes message', () => {
        const wrapper = shallow(
            <TemplatedInstance
                data={data}
                dataValue="value"
                errors={{}}
                template={{
                    fields: noFieldsForTemplate,
                }}
            />,
        );
        expect(wrapper).toMatchSnapshot();
    });
});
