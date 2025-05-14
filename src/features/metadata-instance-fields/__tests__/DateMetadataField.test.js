import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { createIntl } from 'react-intl';

import { DateMetadataFieldBase as DateMetadataField } from '../DateMetadataField';

describe('features/metadata-instance-editor/fields/DateMetadataField', () => {
    const intl = {
        formatMessage: jest.fn(),
    };

    test('should correctly render a date field', () => {
        const wrapper = shallow(<DateMetadataField dataValue="2018-06-13T00:00:00.000Z" intl={intl} />);
        expect(wrapper).toMatchSnapshot();
    });
});

const getDateFieldBaseProps = (props = {}) => ({
    dataKey: 'testKeyDate',
    displayName: 'Test Date Field',
    intl: createIntl({ locale: 'en' }),
    onChange: jest.fn(),
    onRemove: jest.fn(),
    dataValue: '2023-01-01T00:00:00.000Z',
    canEdit: true,
    ...props,
});

describe('DateMetadataField isDisabled prop', () => {
    test('should render as disabled when isDisabled is true', () => {
        render(<DateMetadataField {...getDateFieldBaseProps({ isDisabled: true })} />);
        expect(screen.getByRole('textbox', { name: 'Test Date Field' })).toBeDisabled();
    });

    test('should render as enabled when isDisabled is false', () => {
        render(<DateMetadataField {...getDateFieldBaseProps({ isDisabled: false })} />);
        expect(screen.getByRole('textbox', { name: 'Test Date Field' })).not.toBeDisabled();
    });

    test('should render as enabled when isDisabled is not provided', () => {
        const props = getDateFieldBaseProps();
        delete props.isDisabled;
        render(<DateMetadataField {...props} />);
        expect(screen.getByRole('textbox', { name: 'Test Date Field' })).not.toBeDisabled();
    });
});
