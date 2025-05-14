import * as React from 'react';
import { render, screen } from '../../../test-utils/testing-library';

import TextMetadataField from '../TextMetadataField';

describe('TextMetadataField', () => {
    const getTextFieldBaseProps = (props = {}) => ({
        dataKey: 'testKeyText',
        displayName: 'Test Text Field',
        onChange: jest.fn(),
        onRemove: jest.fn(),
        type: 'text',
        dataValue: 'initial text value',
        canEdit: true,
        ...props,
    });

    test('should correctly render a text field with its value', () => {
        render(
            <TextMetadataField
                {...getTextFieldBaseProps({
                    dataValue: 'specific text',
                    displayName: 'My Test Text',
                })}
            />,
        );
        const textInput = screen.getByRole('textbox', { name: 'My Test Text' });
        expect(textInput).toBeInTheDocument();
        expect(textInput).toHaveValue('specific text');
    });

    test('should correctly render a number field with its numeric value', () => {
        render(
            <TextMetadataField
                {...getTextFieldBaseProps({
                    dataValue: 12345,
                    displayName: 'My Test Number',
                    type: 'number',
                })}
            />,
        );
        const numberInput = screen.getByRole('spinbutton', { name: 'My Test Number' });
        expect(numberInput).toBeInTheDocument();
        expect(numberInput).toHaveValue(12345);
    });

    test('should correctly render zero in a number field', () => {
        render(
            <TextMetadataField
                {...getTextFieldBaseProps({
                    dataValue: 0,
                    displayName: 'My Zero Number',
                    type: 'number',
                })}
            />,
        );
        const zeroInput = screen.getByRole('spinbutton', { name: 'My Zero Number' });
        expect(zeroInput).toBeInTheDocument();
        expect(zeroInput).toHaveValue(0);
    });

    test('should display description when provided', () => {
        const descriptionText = 'This is a text field description.';
        render(
            <TextMetadataField
                {...getTextFieldBaseProps({
                    displayName: 'My Text With Desc',
                    description: descriptionText,
                })}
            />,
        );
        const textInput = screen.getByRole('textbox', { name: 'My Text With Desc This is a text field description.' });
        expect(textInput).toBeInTheDocument();
        expect(screen.getByText(descriptionText)).toBeInTheDocument();
    });

    test('should render as disabled when isDisabled is true', () => {
        const descriptionText = 'A description for the text field.';
        render(
            <TextMetadataField
                {...getTextFieldBaseProps({
                    isDisabled: true,
                    description: descriptionText,
                })}
            />,
        );
        expect(
            screen.getByRole('textbox', { name: 'Test Text Field A description for the text field.' }),
        ).toBeDisabled();
    });

    test('should render as enabled when isDisabled is false', () => {
        const descriptionText = 'A description for the text field.';
        render(
            <TextMetadataField
                {...getTextFieldBaseProps({
                    isDisabled: false,
                    description: descriptionText,
                })}
            />,
        );
        expect(
            screen.getByRole('textbox', { name: 'Test Text Field A description for the text field.' }),
        ).not.toBeDisabled();
    });

    test('should render as enabled when isDisabled is not provided', () => {
        const props = getTextFieldBaseProps({
            description: 'A description for the text field.',
        });
        delete props.isDisabled;
        render(<TextMetadataField {...props} />);
        expect(
            screen.getByRole('textbox', { name: 'Test Text Field A description for the text field.' }),
        ).not.toBeDisabled();
    });
});
