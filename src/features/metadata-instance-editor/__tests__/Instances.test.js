import * as React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen } from '../../../test-utils/testing-library';

import Instances from '../Instances';
import { CASCADE_POLICY_TYPE_AI_EXTRACT } from '../constants';

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

// State of editors from server
const editorsOnServer = [editor1, editor2];

const testInstanceFields = [
    {
        id: 'field1',
        type: 'string',
        key: 'stringfield',
        displayName: 'String Field',
        description: 'example of a string field',
    },
];

const getInstancesBaseProps = (props = {}) => ({
    editors: [
        {
            instance: {
                id: 'test-instance-1',
                canEdit: true,
                data: { stringfield: 'value1' },
                isDirty: false,
                hasError: false,
                isCascadingPolicyApplicable: true,
                cascadePolicy: {
                    id: 'policy-1',
                    canEdit: true,
                    isEnabled: true,
                    scope: 'enterprise_123',
                    cascadePolicyType: 'regular',
                },
            },
            template: {
                id: 'template-1',
                displayName: 'Test Template Editor',
                fields: testInstanceFields,
                templateKey: 'editorTemplateKey',
            },
        },
    ],
    onSave: jest.fn(),
    onModification: jest.fn(),
    onRemove: jest.fn(),
    canUseAIFolderExtraction: true,
    isCascadingPolicyApplicable: true,
    ...props,
});

describe('features/metadata-editor-editor/Instances', () => {
    test('should correctly render editors', () => {
        const wrapper = shallow(<Instances editors={editorsOnServer} />);
        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render instances with editors and a selected template', () => {
        const wrapper = shallow(<Instances editors={editorsOnServer} selectedTemplateKey="template1" />);
        const selectedTemplate = wrapper.find('injectIntl(Instance)').at(0);
        expect(selectedTemplate.prop('isOpen')).toBe(true);
        expect(selectedTemplate.prop('id')).toBe('editor1');
    });

    test('should correctly render instances with a selected template and multiple editors', () => {
        const wrapper = shallow(<Instances editors={editorsOnServer} selectedTemplateKey="template2" />);
        const selectedTemplate = wrapper.find('injectIntl(Instance)').at(1);
        expect(selectedTemplate.prop('isOpen')).toBe(true);
        expect(selectedTemplate.prop('id')).toBe('editor2');
        const unselectedTemplate = wrapper.find('injectIntl(Instance)').at(0);
        expect(unselectedTemplate.prop('isOpen')).toBe(false);
        expect(unselectedTemplate.prop('id')).toBe('editor1');
    });
});

describe('Instances component - canUseAIFolderExtractionAgentSelector prop', () => {
    test('should pass canUseAIFolderExtractionAgentSelector to child Instance components, showing agent selector', async () => {
        const props = getInstancesBaseProps({
            canUseAIFolderExtractionAgentSelector: true,
        });
        props.editors[0].instance.cascadePolicy.cascadePolicyType = CASCADE_POLICY_TYPE_AI_EXTRACT;
        render(<Instances {...props} />);

        const editButton = screen.getByRole('button', { name: 'Edit Metadata' });
        await userEvent.click(editButton);

        const cascadeToggle = screen.getByRole('switch', { name: 'Enable Cascade Policy' });
        expect(cascadeToggle).toBeChecked();

        const aiToggle = screen.getByRole('switch', { name: 'Box AI Autofill' });
        expect(aiToggle).toBeChecked();

        expect(screen.getByRole('combobox', { name: 'Standard' })).toBeInTheDocument();
    });

    test('should not show agent selector in child Instance if canUseAIFolderExtractionAgentSelector is false', async () => {
        render(
            <Instances
                {...getInstancesBaseProps({
                    canUseAIFolderExtractionAgentSelector: false,
                })}
            />,
        );

        const editButton = screen.getByRole('button', { name: 'Edit Metadata' });
        await userEvent.click(editButton);

        expect(screen.queryByRole('combobox', { name: 'Standard' })).not.toBeInTheDocument();
    });

    test('should not show agent selector in child Instance if canUseAIFolderExtractionAgentSelector is undefined', async () => {
        const props = getInstancesBaseProps();
        delete props.canUseAIFolderExtractionAgentSelector;
        render(<Instances {...props} />);

        const editButton = screen.getByRole('button', { name: 'Edit Metadata' });
        await userEvent.click(editButton);

        expect(screen.queryByRole('combobox', { name: 'Standard' })).not.toBeInTheDocument();
    });
});
