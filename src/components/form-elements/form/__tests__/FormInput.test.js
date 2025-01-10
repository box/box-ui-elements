import * as React from 'react';
import { render } from '@testing-library/react';
import { FormProvider } from '../FormContext';
import FormInput from '../FormInput';

const noop = () => {};

describe('components/form-elements/form/FormInput', () => {
    const renderWithForm = (ui, formContext = {}) => {
        return render(<FormProvider value={formContext}>{ui}</FormProvider>);
    };

    test('should register itself with the form when form context is available', () => {
        const registerInput = jest.fn();
        const unregisterInput = jest.fn();

        renderWithForm(
            <FormInput name="test-input" onValidityStateUpdate={noop}>
                <input />
            </FormInput>,
            { registerInput, unregisterInput },
        );

        expect(registerInput).toHaveBeenCalledWith('test-input', noop);
        expect(unregisterInput).not.toHaveBeenCalled();
    });

    test('should unregister itself when unmounted', () => {
        const registerInput = jest.fn();
        const unregisterInput = jest.fn();

        const { unmount } = renderWithForm(
            <FormInput name="test-input" onValidityStateUpdate={noop}>
                <input />
            </FormInput>,
            { registerInput, unregisterInput },
        );

        unmount();
        expect(unregisterInput).toHaveBeenCalledWith('test-input');
    });

    test('should not throw when form context is not available', () => {
        expect(() => {
            render(
                <FormInput name="test-input" onValidityStateUpdate={noop}>
                    <input />
                </FormInput>,
            );
        }).not.toThrow();
    });
});
