import * as React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen } from '../../../test-utils/testing-library';

import EnumMetadataField from '../EnumMetadataField';

describe('EnumMetadataField', () => {
    const defaultOptions = [
        { key: 'opt1', displayName: 'Option 1' },
        { key: 'opt2', displayName: 'Option 2' },
        { key: 'opt3', displayName: 'Option 3' },
    ];

    const getEnumFieldBaseProps = (props = {}) => ({
        dataKey: 'testKeyEnum',
        displayName: 'Test Enum Field',
        onChange: jest.fn(),
        onRemove: jest.fn(),
        options: defaultOptions,
        dataValue: 'opt1',
        canEdit: true,
        ...props,
    });

    test('should display options and reflect selected value', async () => {
        render(
            <EnumMetadataField
                {...getEnumFieldBaseProps({
                    dataValue: 'opt2',
                    displayName: 'My Test Enum',
                })}
            />,
        );

        const listbox = screen.getByRole('listbox', { name: 'My Test Enum' });
        await userEvent.click(listbox);

        expect(listbox).toBeInTheDocument();
        expect(screen.getByRole('option', { name: 'opt2', selected: true })).toBeInTheDocument();
        expect(screen.getByRole('option', { name: 'opt1' })).toBeInTheDocument();
        expect(screen.getByRole('option', { name: 'opt3' })).toBeInTheDocument();
    });

    test('should display description when provided', () => {
        const descriptionText = 'This is a test description.';
        render(
            <EnumMetadataField
                {...getEnumFieldBaseProps({
                    displayName: 'My Enum With Desc',
                    description: descriptionText,
                })}
            />,
        );

        const listbox = screen.getByRole('listbox', { name: 'My Enum With Desc This is a test description.' });
        expect(listbox).toBeInTheDocument();
        expect(screen.getByText(descriptionText)).toBeInTheDocument();
    });

    test('should render as disabled when isDisabled is true', () => {
        render(<EnumMetadataField {...getEnumFieldBaseProps({ isDisabled: true })} />);
        expect(screen.getByRole('listbox', { name: 'Test Enum Field' })).toBeDisabled();
    });

    test('should render as enabled when isDisabled is false', () => {
        render(<EnumMetadataField {...getEnumFieldBaseProps({ isDisabled: false })} />);
        expect(screen.getByRole('listbox', { name: 'Test Enum Field' })).not.toBeDisabled();
    });

    test('should render as enabled when isDisabled is not provided', () => {
        const props = getEnumFieldBaseProps();
        delete props.isDisabled;
        render(<EnumMetadataField {...props} />);
        expect(screen.getByRole('listbox', { name: 'Test Enum Field' })).not.toBeDisabled();
    });
});
