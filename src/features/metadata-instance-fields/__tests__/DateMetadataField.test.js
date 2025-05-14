import * as React from 'react';
import { render, screen } from '../../../test-utils/testing-library';

import DateMetadataField from '../DateMetadataField';

describe('DateMetadataField', () => {
    const getDateFieldBaseProps = (props = {}) => ({
        dataKey: 'testKeyDate',
        displayName: 'Test Date Field',
        onChange: jest.fn(),
        onRemove: jest.fn(),
        dataValue: '2023-01-15T00:00:00.000Z',
        canEdit: true,
        ...props,
    });

    test('should correctly render a date field with its value', () => {
        const testDate = '2024-07-26T00:00:00.000Z';
        render(
            <DateMetadataField
                {...getDateFieldBaseProps({
                    dataValue: testDate,
                    displayName: 'My Test Date',
                })}
            />,
        );

        const dateInput = screen.getByRole('textbox', { name: 'My Test Date' });
        expect(dateInput).toBeInTheDocument();
        expect(dateInput).toHaveValue('July 26, 2024');
    });

    test('should display description when provided', () => {
        const descriptionText = 'This is a date field description.';
        render(
            <DateMetadataField
                {...getDateFieldBaseProps({
                    displayName: 'My Date With Desc',
                    description: descriptionText,
                })}
            />,
        );

        const dateInput = screen.getByRole('textbox', { name: 'My Date With Desc This is a date field description.' });
        expect(dateInput).toBeInTheDocument();
        expect(screen.getByText(descriptionText)).toBeInTheDocument();
    });

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
