import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { createIntl } from 'react-intl';

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

const testTemplateFields = [
    {
        id: 'field1',
        type: 'string',
        key: 'stringfield',
        displayName: 'Test String Field',
        description: 'A string field for testing.',
    },
    {
        id: 'field2',
        type: 'float',
        key: 'floatfield',
        displayName: 'Test Float Field',
        description: 'A float field for testing.',
    },
    {
        id: 'field3',
        type: 'enum',
        key: 'enumfield',
        displayName: 'Test Enum Field',
        description: 'An enum field for testing.',
        options: [
            { key: 'yes', displayName: 'Yes' },
            { key: 'no', displayName: 'No' },
        ],
    },
];

const testTemplateData = {
    stringfield: 'test string',
    floatfield: 12.34,
    enumfield: 'yes',
};

const getTemplatedInstanceBaseProps = (props = {}) => ({
    template: {
        id: 'template-id-1',
        displayName: 'Test Template Name',
        fields: testTemplateFields,
        templateKey: 'testTemplateKeyForTemplated',
    },
    data: testTemplateData,
    errors: {},
    onFieldChange: jest.fn(),
    onFieldRemove: jest.fn(),
    canEdit: true,
    intl: createIntl({ locale: 'en' }),
    isDisabled: false,
    ...props,
});

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

describe('TemplatedInstance isDisabled prop', () => {
    test('should render all fields as disabled when isDisabled is true', () => {
        render(<TemplatedInstance {...getTemplatedInstanceBaseProps({ isDisabled: true })} />);

        expect(screen.getByRole('textbox', { name: 'Test String Field A string field for testing.' })).toBeDisabled();
        expect(screen.getByRole('textbox', { name: 'Test Float Field A float field for testing.' })).toBeDisabled();
        expect(screen.getByRole('listbox', { name: 'Test Enum Field An enum field for testing.' })).toBeDisabled();
    });

    test('should render all fields as enabled when isDisabled is false', () => {
        render(<TemplatedInstance {...getTemplatedInstanceBaseProps({ isDisabled: false })} />);

        expect(
            screen.getByRole('textbox', { name: 'Test String Field A string field for testing.' }),
        ).not.toBeDisabled();
        expect(screen.getByRole('textbox', { name: 'Test Float Field A float field for testing.' })).not.toBeDisabled();
        expect(screen.getByRole('listbox', { name: 'Test Enum Field An enum field for testing.' })).not.toBeDisabled();
    });

    test('should render all fields as enabled when isDisabled is not provided (defaults to false)', () => {
        const props = getTemplatedInstanceBaseProps();
        delete props.isDisabled;
        render(<TemplatedInstance {...props} />);

        expect(
            screen.getByRole('textbox', { name: 'Test String Field A string field for testing.' }),
        ).not.toBeDisabled();
        expect(screen.getByRole('textbox', { name: 'Test Float Field A float field for testing.' })).not.toBeDisabled();
        expect(screen.getByRole('listbox', { name: 'Test Enum Field An enum field for testing.' })).not.toBeDisabled();
    });
});
