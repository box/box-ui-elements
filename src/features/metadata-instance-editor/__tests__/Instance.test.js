import React from 'react';

import TEMPLATE_CUSTOM_PROPERTIES from '../constants';
import { InstanceBase as Instance } from '../Instance';
import { isValidValue } from '../../metadata-instance-fields/validateMetadataField';

jest.mock('../../metadata-instance-fields/validateMetadataField');

const data = {
    stringfield: 'some string',
    floatfield: 1,
    enumfield: 'yes',
    datefield: '2018-06-20T00:00:00.000Z',
    multiselectfield: ['yes', 'no'],
};

const fields = [
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
        displayName: 'Multi Select Field',
        description: 'example of a multi select field field',
        options: [
            { key: 'yes' },
            { key: 'no' },
            { key: 'maybe' },
            { key: 'idk?' },
            { key: 'oh well' },
            { key: 'whatever' },
        ],
    },
];

const allFieldsHidden = [
    {
        id: 'field0',
        type: 'string',
        key: 'nodescfield',
        displayName: 'No Description Field that is hidden',
        hidden: true,
    },
    {
        id: 'field1',
        type: 'string',
        key: 'nodescfield',
        displayName: 'No Description Field that is also hidden',
        isHidden: true,
    },
];

const noFieldsInTemplate = [];

const singleTemplateField = [
    {
        id: 'field0',
        type: 'enum',
        key: 'emptyenumfield',
        displayName: 'Empty Enum Field',
        description: 'example of an empty enum field',
    },
];

const customTemplateField = [
    {
        id: 'field0',
        type: 'enum',
        key: 'emptyenumfield',
        displayName: 'Empty Enum Field',
        description: 'example of an empty enum field',
        templateKey: TEMPLATE_CUSTOM_PROPERTIES,
    },
];

const userDefinedTemplateField = [
    {
        id: 'field0',
        type: 'enum',
        key: 'emptyenumfield',
        displayName: 'Empty Enum Field',
        description: 'example of an empty enum field',
        templateKey: 'not properties',
    },
];

const intl = { formatMessage: () => {} };

describe('features/metadata-instance-editor/fields/Instance', () => {
    test('should correctly render templated metadata instance', () => {
        const wrapper = shallow(
            <Instance
                data={data}
                dataValue="value"
                intl={intl}
                template={{
                    fields,
                }}
            />,
        );
        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render templated metadata instance with CascadePolicy', () => {
        const wrapper = shallow(
            <Instance
                cascadePolicy={{
                    canEdit: true,
                    id: 'hello',
                }}
                data={data}
                dataValue="value"
                intl={intl}
                isCascadingPolicyApplicable
                shouldShowCascadingOptions
                template={{
                    fields,
                }}
            />,
        );
        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render custom metadata instance', () => {
        const wrapper = shallow(
            <Instance
                data={data}
                dataValue="value"
                intl={intl}
                template={{
                    fields,
                    templateKey: 'properties',
                }}
            />,
        );
        expect(wrapper).toMatchSnapshot();
    });

    test('should not render footer when not editing', () => {
        const wrapper = shallow(
            <Instance
                canEdit
                data={data}
                dataValue="value"
                intl={intl}
                onRemove={jest.fn()}
                template={{
                    fields,
                }}
            />,
        );

        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render the footer', () => {
        const wrapper = shallow(
            <Instance
                canEdit
                data={data}
                dataValue="value"
                intl={intl}
                onModification={jest.fn()}
                onRemove={jest.fn()}
                onSave={jest.fn()}
                template={{
                    fields,
                }}
            />,
        );

        wrapper.setState({ isEditing: true });
        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render the footer even when all fields are hidden', () => {
        const wrapper = shallow(
            <Instance
                canEdit
                data={data}
                dataValue="value"
                intl={intl}
                onModification={jest.fn()}
                onRemove={jest.fn()}
                onSave={jest.fn()}
                template={{
                    fields: allFieldsHidden,
                }}
            />,
        );

        wrapper.setState({ isEditing: true });
        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render the footer even when there are no fields in a template', () => {
        const wrapper = shallow(
            <Instance
                canEdit
                data={data}
                dataValue="value"
                intl={intl}
                onModification={jest.fn()}
                onRemove={jest.fn()}
                onSave={jest.fn()}
                template={{
                    fields: noFieldsInTemplate,
                }}
            />,
        );

        wrapper.setState({ isEditing: true });
        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render the footer with save button when dirty', () => {
        const wrapper = shallow(
            <Instance
                canEdit
                data={data}
                dataValue="value"
                intl={intl}
                isDirty
                onModification={jest.fn()}
                onRemove={jest.fn()}
                onSave={jest.fn()}
                template={{
                    fields,
                }}
            />,
        );

        wrapper.setState({ isEditing: true });
        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render the busy indicator', () => {
        const wrapper = shallow(
            <Instance
                canEdit
                data={data}
                dataValue="value"
                intl={intl}
                onModification={jest.fn()}
                onRemove={jest.fn()}
                onSave={jest.fn()}
                template={{
                    fields,
                }}
            />,
        );

        wrapper.setState({ isBusy: true });
        expect(wrapper).toMatchSnapshot();
    });

    test('isOpen should be true if the prop is not undefined', () => {
        const wrapper = shallow(
            <Instance
                canEdit
                data={data}
                dataValue="value"
                intl={intl}
                isOpen={singleTemplateField.length === 1}
                onModification={jest.fn()}
                onRemove={jest.fn()}
                onSave={jest.fn()}
                template={{
                    singleTemplateField,
                }}
            />,
        );
        expect(wrapper.instance().props.isOpen).toBe(true);
    });

    test('collapsible isOpen prop should be true', () => {
        const wrapper = shallow(
            <Instance
                canEdit
                data={data}
                dataValue="value"
                intl={intl}
                isOpen={singleTemplateField.length === 1}
                onModification={jest.fn()}
                onRemove={jest.fn()}
                onSave={jest.fn()}
                template={{
                    singleTemplateField,
                }}
            />,
        );
        expect(wrapper).toMatchSnapshot();
    });

    test('message id should be fileMetadataRemoveCustomTemplateConfirm', () => {
        const wrapper = shallow(
            <Instance
                canEdit
                data={data}
                dataValue="value"
                intl={intl}
                isOpen={customTemplateField.length === 1}
                onModification={jest.fn()}
                onRemove={jest.fn()}
                onSave={jest.fn()}
                template={{
                    customTemplateField,
                }}
            />,
        );

        const expectedMessage = 'boxui.metadataInstanceEditor.fileMetadataRemoveCustomTemplateConfirm';
        const formattedMessage = wrapper.instance().renderDeleteMessage(true, customTemplateField[0]);
        expect(formattedMessage.props.id).toEqual(expectedMessage);
        expect(formattedMessage).toMatchSnapshot();
    });

    test('message id should be folderMetadataRemoveCustomTemplateConfirm', () => {
        const wrapper = shallow(
            <Instance
                canEdit
                data={data}
                dataValue="value"
                intl={intl}
                isOpen={customTemplateField.length === 1}
                onModification={jest.fn()}
                onRemove={jest.fn()}
                onSave={jest.fn()}
                template={{
                    customTemplateField,
                }}
            />,
        );

        const expectedMessage = 'boxui.metadataInstanceEditor.folderMetadataRemoveCustomTemplateConfirm';
        const formattedMessage = wrapper.instance().renderDeleteMessage(false, customTemplateField[0]);
        expect(formattedMessage.props.id).toEqual(expectedMessage);
        expect(formattedMessage).toMatchSnapshot();
    });

    test('message id should be fileMetadataRemoveTemplateConfirm', () => {
        const wrapper = shallow(
            <Instance
                canEdit
                data={data}
                dataValue="value"
                intl={intl}
                isOpen={userDefinedTemplateField.length === 1}
                onModification={jest.fn()}
                onRemove={jest.fn()}
                onSave={jest.fn()}
                template={{
                    userDefinedTemplateField,
                }}
            />,
        );

        const expectedMessage = 'boxui.metadataInstanceEditor.fileMetadataRemoveTemplateConfirm';
        const formattedMessage = wrapper.instance().renderDeleteMessage(true, userDefinedTemplateField[0]);
        expect(formattedMessage.props.id).toEqual(expectedMessage);
        expect(formattedMessage).toMatchSnapshot();
    });

    test('message id should be folderMetadataRemoveTemplateConfirm', () => {
        const wrapper = shallow(
            <Instance
                canEdit
                data={data}
                dataValue="value"
                intl={intl}
                isOpen={userDefinedTemplateField.length === 1}
                onModification={jest.fn()}
                onRemove={jest.fn()}
                onSave={jest.fn()}
                template={{
                    userDefinedTemplateField,
                }}
            />,
        );

        const expectedMessage = 'boxui.metadataInstanceEditor.folderMetadataRemoveTemplateConfirm';
        const formattedMessage = wrapper.instance().renderDeleteMessage(false, userDefinedTemplateField[0]);
        expect(formattedMessage.props.id).toEqual(expectedMessage);
        expect(formattedMessage).toMatchSnapshot();
    });

    describe('createJSONPatch()', () => {
        test('should correctly create a JSON patch', () => {
            const wrapper = shallow(
                <Instance
                    canEdit
                    data={data}
                    dataValue="value"
                    intl={intl}
                    onModification={jest.fn()}
                    onRemove={jest.fn()}
                    onSave={jest.fn()}
                    template={{
                        fields,
                    }}
                />,
            );

            const instance = wrapper.instance();
            const currentData = {
                stringfield: 'some new string',
                floatfield: 1,
                newfield: 'new field',
                multiselectfield: ['yes', 'no'],
            };

            expect(instance.createJSONPatch(currentData, data)).toEqual([
                { op: 'test', path: '/stringfield', value: 'some string' },
                {
                    op: 'replace',
                    path: '/stringfield',
                    value: 'some new string',
                },
                { op: 'test', path: '/enumfield', value: 'yes' },
                { op: 'remove', path: '/enumfield' },
                {
                    op: 'test',
                    path: '/datefield',
                    value: '2018-06-20T00:00:00.000Z',
                },
                { op: 'remove', path: '/datefield' },
                { op: 'add', path: '/newfield', value: 'new field' },
            ]);
        });

        test('should correctly create a JSON patch with multi select diffs', () => {
            const wrapper = shallow(
                <Instance
                    canEdit
                    data={data}
                    dataValue="value"
                    intl={intl}
                    onModification={jest.fn()}
                    onRemove={jest.fn()}
                    onSave={jest.fn()}
                    template={{
                        fields,
                    }}
                />,
            );

            const instance = wrapper.instance();
            const currentData = {
                stringfield: 'some new string',
                floatfield: 1,
                newfield: 'new field',
                multiselectfield: ['no', 'yes'],
            };

            expect(instance.createJSONPatch(currentData, data)).toEqual([
                { op: 'test', path: '/stringfield', value: 'some string' },
                {
                    op: 'replace',
                    path: '/stringfield',
                    value: 'some new string',
                },
                { op: 'test', path: '/enumfield', value: 'yes' },
                { op: 'remove', path: '/enumfield' },
                {
                    op: 'test',
                    path: '/datefield',
                    value: '2018-06-20T00:00:00.000Z',
                },
                { op: 'remove', path: '/datefield' },
                { op: 'test', path: '/multiselectfield', value: ['yes', 'no'] },
                {
                    op: 'replace',
                    path: '/multiselectfield',
                    value: ['no', 'yes'],
                },
                { op: 'add', path: '/newfield', value: 'new field' },
            ]);
        });
    });

    describe('onFieldChange()', () => {
        test('should not do anything when not editing', () => {
            const wrapper = shallow(
                <Instance
                    canEdit
                    data={data}
                    dataValue="value"
                    intl={intl}
                    onModification={jest.fn()}
                    onRemove={jest.fn()}
                    onSave={jest.fn()}
                    template={{
                        fields,
                    }}
                />,
            );

            const instance = wrapper.instance();
            instance.setState = jest.fn();
            instance.isEditing = jest.fn().mockReturnValueOnce(false);
            instance.onFieldChange('multiselectfield', ['yes'], 'multiSelect');
            wrapper.update();
            expect(isValidValue).not.toBeCalled();
            expect(instance.setState).not.toBeCalled();
        });

        test('should not do anything when current and prior value is the same', () => {
            const wrapper = shallow(
                <Instance
                    canEdit
                    data={data}
                    dataValue="value"
                    intl={intl}
                    onModification={jest.fn()}
                    onRemove={jest.fn()}
                    onSave={jest.fn()}
                    template={{
                        fields,
                    }}
                />,
            );

            const instance = wrapper.instance();
            instance.setState = jest.fn();
            instance.isEditing = jest.fn().mockReturnValueOnce(true);
            instance.onFieldChange('multiselectfield', ['yes', 'no'], 'multiSelect');
            wrapper.update();
            expect(isValidValue).not.toBeCalled();
            expect(instance.setState).not.toBeCalled();
        });

        test('should validate and set state when editing and prior value isnt the same', () => {
            const wrapper = shallow(
                <Instance
                    canEdit
                    data={data}
                    dataValue="value"
                    intl={intl}
                    onModification={jest.fn()}
                    onRemove={jest.fn()}
                    onSave={jest.fn()}
                    template={{
                        fields,
                    }}
                />,
            );

            const instance = wrapper.instance();
            instance.setState = jest.fn();
            instance.isEditing = jest.fn().mockReturnValueOnce(true);
            instance.onFieldChange('multiselectfield', ['no', 'yes'], 'multiSelect');
            wrapper.update();
            expect(isValidValue).toBeCalled();
            expect(instance.setState).toBeCalled();
        });

        test('should add an error to the state if field was invalid', () => {
            const wrapper = shallow(
                <Instance
                    canEdit
                    data={data}
                    dataValue="value"
                    intl={intl}
                    onModification={jest.fn()}
                    onRemove={jest.fn()}
                    onSave={jest.fn()}
                    template={{
                        fields,
                    }}
                />,
            );

            const instance = wrapper.instance();
            instance.setState = jest.fn();
            instance.isEditing = jest.fn().mockReturnValueOnce(true);
            isValidValue.mockReturnValueOnce(false);
            instance.onFieldChange('multiselectfield', ['no', 'yes'], 'multiSelect');
            wrapper.update();
            expect(isValidValue).toBeCalledWith('multiSelect', ['no', 'yes']);
            expect(instance.setState).toBeCalledWith(
                {
                    data: { ...data, multiselectfield: ['no', 'yes'] },
                    errors: {
                        multiselectfield: expect.any(Object),
                    },
                },
                expect.any(Function),
            );
        });

        test('should remove prior errors related to the changed field', () => {
            const wrapper = shallow(
                <Instance
                    canEdit
                    data={data}
                    dataValue="value"
                    intl={intl}
                    onModification={jest.fn()}
                    onRemove={jest.fn()}
                    onSave={jest.fn()}
                    template={{
                        fields,
                    }}
                />,
            );

            wrapper.setState({
                errors: {
                    multiselectfield: 'error',
                },
            });
            wrapper.update();
            const instance = wrapper.instance();
            instance.setState = jest.fn();
            instance.isEditing = jest.fn().mockReturnValueOnce(true);
            isValidValue.mockReturnValueOnce(true);
            instance.onFieldChange('multiselectfield', ['no', 'yes'], 'multiSelect');
            wrapper.update();
            expect(isValidValue).toBeCalledWith('multiSelect', ['no', 'yes']);
            expect(instance.setState).toBeCalledWith(
                {
                    data: { ...data, multiselectfield: ['no', 'yes'] },
                    errors: {},
                },
                expect.any(Function),
            );
        });
    });

    describe('Lifecycle methods', () => {
        describe('componentDidUpdate()', () => {
            test('should mark is editing and remove loader if errored', () => {
                const wrapper = shallow(<Instance template={{ fields }} canEdit />);
                wrapper.setProps({ hasError: true });
                expect(wrapper.state('isBusy')).toEqual(false);
                expect(wrapper.state('isEditing')).toEqual(true);
            });

            test('form has switched from dirty to a clean state', () => {
                const wrapper = shallow(<Instance isDirty template={{ fields }} canEdit />);
                wrapper.setState({ isEditing: true });
                wrapper.setProps({ isDirty: false });

                expect(wrapper.state('isBusy')).toEqual(false);
            });

            test('form has switched from dirty to a clean state', () => {
                const wrapper = shallow(<Instance isDirty template={{ fields }} canEdit />);
                wrapper.setState({ isEditing: false });
                wrapper.setProps({ isDirty: false });

                expect(wrapper.state('isBusy')).toEqual(false);
                expect(wrapper.state('isCascadingOverwritten')).toEqual(false);
            });
        });
    });
});
