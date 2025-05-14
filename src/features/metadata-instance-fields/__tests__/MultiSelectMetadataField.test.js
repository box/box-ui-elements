import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { createIntl } from 'react-intl';

import MultiSelectMetadataField from '../MultiSelectMetadataField';

describe('features/metadata-instance-editor/fields/MultiSelectMetadataField', () => {
    test('should correctly render', () => {
        const wrapper = shallow(<MultiSelectMetadataField dataValue={['value']} />);
        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render with description', () => {
        const wrapper = shallow(<MultiSelectMetadataField dataValue={['value']} description="description" />);
        expect(wrapper).toMatchSnapshot();
    });
});

const getMultiSelectFieldBaseProps = (props = {}) => ({
    dataKey: 'testKeyMultiSelect',
    displayName: 'Test MultiSelect Field',
    description: 'A description for the multi-select field.',
    intl: createIntl({ locale: 'en' }),
    onChange: jest.fn(),
    onRemove: jest.fn(),
    options: [
        { key: 'opt1', displayName: 'Option 1' },
        { key: 'opt2', displayName: 'Option 2' },
        { key: 'opt3', displayName: 'Option 3' },
    ],
    dataValue: ['opt1', 'opt2'],
    canEdit: true,
    ...props,
});

describe('MultiSelectMetadataField isDisabled prop', () => {
    test('should render as disabled when isDisabled is true', () => {
        render(<MultiSelectMetadataField {...getMultiSelectFieldBaseProps({ isDisabled: true })} />);
        expect(
            screen.getByRole('listbox', { name: 'Test MultiSelect Field A description for the multi-select field.' }),
        ).toBeDisabled();
    });

    test('should render as enabled when isDisabled is false', () => {
        render(<MultiSelectMetadataField {...getMultiSelectFieldBaseProps({ isDisabled: false })} />);
        expect(
            screen.getByRole('listbox', { name: 'Test MultiSelect Field A description for the multi-select field.' }),
        ).not.toBeDisabled();
    });

    test('should render as enabled when isDisabled is not provided', () => {
        const props = getMultiSelectFieldBaseProps();
        delete props.isDisabled;
        render(<MultiSelectMetadataField {...props} />);
        expect(
            screen.getByRole('listbox', { name: 'Test MultiSelect Field A description for the multi-select field.' }),
        ).not.toBeDisabled();
    });
});
