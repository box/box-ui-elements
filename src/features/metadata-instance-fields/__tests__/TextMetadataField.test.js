import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { createIntl } from 'react-intl';

import { TextMetadataFieldBase as TextMetadataField } from '../TextMetadataField';

describe('features/metadata-instance-editor/fields/TextMetadataField', () => {
    const intl = {
        formatMessage: jest.fn(),
    };

    test('should correctly render a text field', () => {
        const wrapper = shallow(<TextMetadataField dataValue="value" intl={intl} />);
        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render a number field', () => {
        const wrapper = shallow(<TextMetadataField dataValue="value" intl={intl} type="number" />);
        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render a zero in a number field', () => {
        const wrapper = shallow(<TextMetadataField dataValue={0} intl={intl} type="number" />);
        expect(wrapper).toMatchSnapshot();
    });
});

const getTextFieldBaseProps = (props = {}) => ({
    dataKey: 'testKey',
    displayName: 'Test Text Field',
    description: 'A description for the text field.',
    intl: createIntl({ locale: 'en' }),
    onChange: jest.fn(),
    onRemove: jest.fn(),
    type: 'text',
    dataValue: 'initial value',
    canEdit: true,
    ...props,
});

describe('TextMetadataField isDisabled prop', () => {
    test('should render as disabled when isDisabled is true', () => {
        render(<TextMetadataField {...getTextFieldBaseProps({ isDisabled: true })} />);
        expect(
            screen.getByRole('textbox', { name: 'Test Text Field A description for the text field.' }),
        ).toBeDisabled();
    });

    test('should render as enabled when isDisabled is false', () => {
        render(<TextMetadataField {...getTextFieldBaseProps({ isDisabled: false })} />);
        expect(
            screen.getByRole('textbox', { name: 'Test Text Field A description for the text field.' }),
        ).not.toBeDisabled();
    });

    test('should render as enabled when isDisabled is not provided', () => {
        const props = getTextFieldBaseProps();
        delete props.isDisabled;
        render(<TextMetadataField {...props} />);
        expect(
            screen.getByRole('textbox', { name: 'Test Text Field A description for the text field.' }),
        ).not.toBeDisabled();
    });
});
