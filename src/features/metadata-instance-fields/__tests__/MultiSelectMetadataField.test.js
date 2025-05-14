import * as React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen } from '../../../test-utils/testing-library';

import MultiSelectMetadataField from '../MultiSelectMetadataField';

describe('MultiSelectMetadataField', () => {
    const defaultOptions = [
        { key: 'opt1', displayName: 'Option 1' },
        { key: 'opt2', displayName: 'Option 2' },
        { key: 'opt3', displayName: 'Option 3' },
        { key: 'opt4', displayName: 'Option 4' },
    ];

    const getMultiSelectFieldBaseProps = (props = {}) => ({
        dataKey: 'testKeyMultiSelect',
        displayName: 'Test MultiSelect Field',
        onChange: jest.fn(),
        onRemove: jest.fn(),
        options: defaultOptions,
        dataValue: ['opt1', 'opt3'],
        canEdit: true,
        ...props,
    });

    test('should display options and reflect selected values', async () => {
        render(
            <MultiSelectMetadataField
                {...getMultiSelectFieldBaseProps({
                    dataValue: ['opt2', 'opt4'],
                    displayName: 'My Test MultiSelect',
                })}
            />,
        );

        const listbox = screen.getByRole('listbox', { name: 'My Test MultiSelect' });
        expect(listbox).toBeInTheDocument();
        await userEvent.click(listbox);

        expect(screen.getByRole('option', { name: 'opt2', selected: true })).toBeInTheDocument();
        expect(screen.getByRole('option', { name: 'opt4', selected: true })).toBeInTheDocument();
        expect(screen.getByRole('option', { name: 'opt1', selected: false })).toBeInTheDocument();
        expect(screen.getByRole('option', { name: 'opt3', selected: false })).toBeInTheDocument();
    });

    test('should display description when provided', () => {
        const descriptionText = 'This is a multi-select field description.';
        render(
            <MultiSelectMetadataField
                {...getMultiSelectFieldBaseProps({
                    displayName: 'My MultiSelect With Desc',
                    description: descriptionText,
                })}
            />,
        );
        const listbox = screen.getByRole('listbox', {
            name: 'My MultiSelect With Desc This is a multi-select field description.',
        });
        expect(listbox).toBeInTheDocument();
        expect(screen.getByText(descriptionText)).toBeInTheDocument();
    });

    test('should render as disabled when isDisabled is true', () => {
        const descriptionText = 'A description for the multi-select field.';
        render(
            <MultiSelectMetadataField
                {...getMultiSelectFieldBaseProps({
                    isDisabled: true,
                    description: descriptionText,
                })}
            />,
        );
        expect(
            screen.getByRole('listbox', { name: 'Test MultiSelect Field A description for the multi-select field.' }),
        ).toBeDisabled();
    });

    test('should render as enabled when isDisabled is false', () => {
        const descriptionText = 'A description for the multi-select field.';
        render(
            <MultiSelectMetadataField
                {...getMultiSelectFieldBaseProps({
                    isDisabled: false,
                    description: descriptionText,
                })}
            />,
        );
        expect(
            screen.getByRole('listbox', { name: 'Test MultiSelect Field A description for the multi-select field.' }),
        ).not.toBeDisabled();
    });

    test('should render as enabled when isDisabled is not provided', () => {
        const props = getMultiSelectFieldBaseProps({
            description: 'A description for the multi-select field.',
        });
        delete props.isDisabled;
        render(<MultiSelectMetadataField {...props} />);
        expect(
            screen.getByRole('listbox', { name: 'Test MultiSelect Field A description for the multi-select field.' }),
        ).not.toBeDisabled();
    });
});
