import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { createIntl } from 'react-intl';

import { EnumMetadataFieldBase as EnumMetadataField } from '../EnumMetadataField';

describe('features/metadata-instance-editor/fields/EnumMetadataField', () => {
    const intl = {
        formatMessage: jest.fn(),
    };

    test('should correctly render an enum field', () => {
        const wrapper = shallow(
            <EnumMetadataField
                dataValue="value"
                intl={intl}
                options={[{ key: 'foo' }, { key: 'bar' }, { key: 'baz' }]}
            />,
        );
        expect(wrapper).toMatchSnapshot();
    });
    test('should correctly render an enum field with description', () => {
        const wrapper = shallow(
            <EnumMetadataField
                dataValue="value"
                description="description"
                intl={intl}
                options={[{ key: 'foo' }, { key: 'bar' }, { key: 'baz' }]}
            />,
        );
        expect(wrapper).toMatchSnapshot();
    });
});

const getEnumFieldBaseProps = (props = {}) => ({
    dataKey: 'testKeyEnum',
    displayName: 'Test Enum Field',
    intl: createIntl({ locale: 'en' }),
    onChange: jest.fn(),
    onRemove: jest.fn(),
    options: [
        { key: 'opt1', displayName: 'Option 1' },
        { key: 'opt2', displayName: 'Option 2' },
    ],
    dataValue: 'opt1',
    canEdit: true,
    ...props,
});

describe('EnumMetadataField isDisabled prop', () => {
    test('should render as disabled when isDisabled is true', () => {
        render(<EnumMetadataField {...getEnumFieldBaseProps({ isDisabled: true })} />);
        expect(screen.getByRole('listbox', { name: /Test Enum Field/i })).toBeDisabled();
    });

    test('should render as enabled when isDisabled is false', () => {
        render(<EnumMetadataField {...getEnumFieldBaseProps({ isDisabled: false })} />);
        expect(screen.getByRole('listbox', { name: /Test Enum Field/i })).not.toBeDisabled();
    });

    test('should render as enabled when isDisabled is not provided', () => {
        const props = getEnumFieldBaseProps();
        delete props.isDisabled;
        render(<EnumMetadataField {...props} />);
        expect(screen.getByRole('listbox', { name: /Test Enum Field/i })).not.toBeDisabled();
    });
});
