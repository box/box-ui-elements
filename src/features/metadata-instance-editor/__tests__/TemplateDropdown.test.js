import React from 'react';
import { FormattedMessage } from 'react-intl';

import Button from '../../../components/button/Button';
import PlainButton from '../../../components/plain-button';
import MenuToggle from '../../../components/dropdown-menu/MenuToggle';
import { TemplateDropdownBase as TemplateDropdown } from '../TemplateDropdown';

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

const usedTemplate1 = {
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

describe('features/metadata-instance-editor/fields/', () => {
    const getWrapper = props =>
        shallow(
            <TemplateDropdown
                intl={{ formatMessage: () => {} }}
                templates={[template1]}
                usedTemplates={[]}
                {...props}
            />,
        );

    test('should correctly render dropdown when isDropdownOpen is false', () => {
        const wrapper = getWrapper();

        wrapper.setState({ isDropdownOpen: false });

        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render dropdown when isDropdownOpen is true', () => {
        const wrapper = getWrapper();

        wrapper.setState({ isDropdownOpen: true });

        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render loading indicator when isDropdownOpen and isDropdownBusy is true', () => {
        const isDropdownBusy = true;
        const wrapper = getWrapper({ isDropdownBusy });

        wrapper.setState({ isDropdownOpen: true });

        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render empty error message when no templates', () => {
        const wrapper = getWrapper({ templates: [] });

        wrapper.setState({ isDropdownOpen: true });

        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render error message when no unused templates available', () => {
        const usedTemplates = [usedTemplate1];
        const wrapper = getWrapper({ usedTemplates });

        wrapper.setState({ isDropdownOpen: true });

        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render plain button when no entry button is passed in', () => {
        const wrapper = getWrapper({});
        const plainButton = (
            <PlainButton className="lnk" data-resin-target="metadata-templateaddmenu" type="button">
                <MenuToggle>
                    <FormattedMessage
                        defaultMessage="Add"
                        description="Label to add a template"
                        id="boxui.metadataInstanceEditor.templateAdd"
                    />
                </MenuToggle>
            </PlainButton>
        );

        expect(wrapper).toMatchSnapshot();
        expect(wrapper.containsMatchingElement(plainButton)).toEqual(true);
    });

    test('should correctly render button that is passed in', () => {
        const wrapper = getWrapper({ entryButton: <Button /> });

        expect(wrapper).toMatchSnapshot();
        expect(wrapper.containsMatchingElement(<Button />)).toEqual(true);
    });

    test('onOpen()', () => {
        const onDropdownToggle = jest.fn();
        const wrapper = getWrapper({ onDropdownToggle, templates: [], usedTemplates: [] });

        wrapper.instance().onOpen();

        expect(onDropdownToggle).toHaveBeenCalledWith(true);
        expect(wrapper.state('isDropdownOpen')).toBe(true);
        expect(wrapper.state('filterText')).toBe('');
        expect(wrapper.state('templates')).toEqual([]);
    });

    test('onClose()', () => {
        const onDropdownToggle = jest.fn();
        const wrapper = getWrapper({ onDropdownToggle, templates: [], usedTemplates: [] });

        wrapper.instance().onClose();

        expect(onDropdownToggle).toHaveBeenCalledWith(false);
        expect(wrapper.state('isDropdownOpen')).toBe(false);
    });

    test('componentDidUpdate()', () => {
        const wrapper = getWrapper({ templates: [], usedTemplates: [] });
        const template = {
            id: 'test-template1',
            templateKey: 'test-template1',
            displayName: 'test-template1 title',
        };
        const mockTemplates = { templates: [template] };

        wrapper.setProps(mockTemplates);
        expect(wrapper.state('templates')).toEqual([template]);
    });
});
