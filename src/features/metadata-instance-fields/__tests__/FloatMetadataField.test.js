import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { createIntl } from 'react-intl';

import FloatMetadataField from '../FloatMetadataField';

describe('features/metadata-instance-editor/fields/FloatMetadataField', () => {
    test('should correctly render a float field', () => {
        const wrapper = shallow(<FloatMetadataField dataValue="value" />);
        expect(wrapper).toMatchSnapshot();
    });
});

const getFloatFieldBaseProps = (props = {}) => ({
    dataKey: 'testKeyFloat',
    displayName: 'Test Float Field',
    description: 'A description for the float field.',
    intl: createIntl({ locale: 'en' }),
    onChange: jest.fn(),
    onRemove: jest.fn(),
    type: 'float',
    dataValue: 123.45,
    canEdit: true,
    ...props,
});

describe('FloatMetadataField isDisabled prop', () => {
    test('should render as disabled when isDisabled is true', () => {
        render(<FloatMetadataField {...getFloatFieldBaseProps({ isDisabled: true })} />);
        expect(
            screen.getByRole('textbox', { name: 'Test Float Field A description for the float field.' }),
        ).toBeDisabled();
    });

    test('should render as enabled when isDisabled is false', () => {
        render(<FloatMetadataField {...getFloatFieldBaseProps({ isDisabled: false })} />);
        expect(
            screen.getByRole('textbox', { name: 'Test Float Field A description for the float field.' }),
        ).not.toBeDisabled();
    });

    test('should render as enabled when isDisabled is not provided', () => {
        const props = getFloatFieldBaseProps();
        delete props.isDisabled;
        render(<FloatMetadataField {...props} />);
        expect(
            screen.getByRole('textbox', { name: 'Test Float Field A description for the float field.' }),
        ).not.toBeDisabled();
    });
});
