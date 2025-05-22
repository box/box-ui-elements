import * as React from 'react';
import { render, screen } from '../../../test-utils/testing-library';

import IntegerMetadataField from '../IntegerMetadataField';

describe('IntegerMetadataField', () => {
    const getIntegerFieldBaseProps = (props = {}) => ({
        dataKey: 'testKeyInteger',
        displayName: 'Test Integer Field',
        onChange: jest.fn(),
        onRemove: jest.fn(),
        type: 'integer',
        dataValue: 123,
        canEdit: true,
        ...props,
    });

    test('should correctly render an integer field with its value', () => {
        render(
            <IntegerMetadataField
                {...getIntegerFieldBaseProps({
                    dataValue: 456,
                    displayName: 'My Test Integer',
                })}
            />,
        );
        const integerInput = screen.getByRole('textbox', { name: 'My Test Integer' });
        expect(integerInput).toBeInTheDocument();
        expect(integerInput).toHaveValue('456');
    });

    test('should display description when provided', () => {
        const descriptionText = 'This is an integer field description.';
        render(
            <IntegerMetadataField
                {...getIntegerFieldBaseProps({
                    displayName: 'My Integer With Desc',
                    description: descriptionText,
                })}
            />,
        );
        const integerInput = screen.getByRole('textbox', {
            name: 'My Integer With Desc This is an integer field description.',
        });
        expect(integerInput).toBeInTheDocument();
        expect(screen.getByText(descriptionText)).toBeInTheDocument();
    });

    test('should render as disabled when isDisabled is true', () => {
        const descriptionText = 'An integer field description for disabled test.';
        render(
            <IntegerMetadataField
                {...getIntegerFieldBaseProps({
                    isDisabled: true,
                    description: descriptionText,
                    displayName: 'Disabled Integer Field',
                })}
            />,
        );
        expect(
            screen.getByRole('textbox', {
                name: 'Disabled Integer Field An integer field description for disabled test.',
            }),
        ).toBeDisabled();
    });

    test('should render as enabled when isDisabled is false', () => {
        const descriptionText = 'An integer field description for enabled test.';
        render(
            <IntegerMetadataField
                {...getIntegerFieldBaseProps({
                    isDisabled: false,
                    description: descriptionText,
                    displayName: 'Enabled Integer Field',
                })}
            />,
        );
        expect(
            screen.getByRole('textbox', {
                name: 'Enabled Integer Field An integer field description for enabled test.',
            }),
        ).not.toBeDisabled();
    });

    test('should render as enabled when isDisabled is not provided', () => {
        const props = getIntegerFieldBaseProps({
            description: 'An integer field for default enabled test.',
            displayName: 'Default Enabled Integer',
        });
        delete props.isDisabled;
        render(<IntegerMetadataField {...props} />);
        expect(
            screen.getByRole('textbox', { name: 'Default Enabled Integer An integer field for default enabled test.' }),
        ).not.toBeDisabled();
    });
});
