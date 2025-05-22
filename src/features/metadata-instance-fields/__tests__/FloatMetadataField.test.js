import * as React from 'react';
import { render, screen } from '../../../test-utils/testing-library';

import FloatMetadataField from '../FloatMetadataField';

describe('FloatMetadataField', () => {
    const getFloatFieldBaseProps = (props = {}) => ({
        dataKey: 'testKeyFloat',
        displayName: 'Test Float Field',
        onChange: jest.fn(),
        onRemove: jest.fn(),
        type: 'float',
        dataValue: 123.45,
        canEdit: true,
        ...props,
    });

    test('should correctly render a float field with its value', () => {
        render(
            <FloatMetadataField
                {...getFloatFieldBaseProps({
                    dataValue: 987.65,
                    displayName: 'My Test Float',
                })}
            />,
        );
        const floatInput = screen.getByRole('textbox', { name: 'My Test Float' });
        expect(floatInput).toBeInTheDocument();
        expect(floatInput).toHaveValue('987.65');
    });

    test('should display description when provided', () => {
        const descriptionText = 'This is a float field description.';
        render(
            <FloatMetadataField
                {...getFloatFieldBaseProps({
                    displayName: 'My Float With Desc',
                    description: descriptionText,
                })}
            />,
        );
        const floatInput = screen.getByRole('textbox', {
            name: 'My Float With Desc This is a float field description.',
        });
        expect(floatInput).toBeInTheDocument();
        expect(screen.getByText(descriptionText)).toBeInTheDocument();
    });

    test('should render as disabled when isDisabled is true', () => {
        const descriptionText = 'A description for the float field.';
        render(<FloatMetadataField {...getFloatFieldBaseProps({ isDisabled: true, description: descriptionText })} />);
        expect(
            screen.getByRole('textbox', { name: 'Test Float Field A description for the float field.' }),
        ).toBeDisabled();
    });

    test('should render as enabled when isDisabled is false', () => {
        const descriptionText = 'A description for the float field.';
        render(<FloatMetadataField {...getFloatFieldBaseProps({ isDisabled: false, description: descriptionText })} />);
        expect(
            screen.getByRole('textbox', { name: 'Test Float Field A description for the float field.' }),
        ).not.toBeDisabled();
    });

    test('should render as enabled when isDisabled is not provided', () => {
        const props = getFloatFieldBaseProps();
        props.description = 'A description for the float field.';
        delete props.isDisabled;
        render(<FloatMetadataField {...props} />);
        expect(
            screen.getByRole('textbox', { name: 'Test Float Field A description for the float field.' }),
        ).not.toBeDisabled();
    });
});
