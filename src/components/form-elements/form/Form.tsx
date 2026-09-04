import * as React from 'react';
// @ts-ignore no types for form-serialize
import serialize from 'form-serialize';

import { FormContext } from './FormContext';

export type FormSerializedData = Record<string, unknown>;

export type FormInputValidityState = ValidityState & {
    customErrorCode?: string;
};

export interface FormFieldValidityState {
    /** Server-side error code */
    code?: string;
    /** Server-side error message */
    message?: string;
    /** HTML constraint-validation state from an invalid named input */
    validityState?: FormInputValidityState;
}

export type FormValidityStateMap = Record<string, FormFieldValidityState | null | undefined>;

export interface FormProps {
    /** Form fields and other child content */
    children?: React.ReactNode;
    /** An object mapping input names to error messages */
    formValidityState?: FormValidityStateMap;
    /** Called when an input in the form changes */
    onChange?: (formData: FormSerializedData) => void;
    /** Called when an invalid submit is made */
    onInvalidSubmit?: (formValidityState: FormValidityStateMap) => void;
    /** Called when a valid submit is made */
    onValidSubmit: (formData: FormSerializedData) => void;
}

interface FormState {
    registeredInputs: Record<string, (validityState: unknown) => void>;
}

function getFormValidityState(form: HTMLFormElement): FormValidityStateMap {
    // Turn the form.elements HTMLCollection into Array before reducing
    return [].slice.call(form.elements).reduce((validityObj: FormValidityStateMap, inputEl: HTMLInputElement) => {
        // Only serialize inputs that have a name defined
        if (inputEl.name && !inputEl.validity.valid) {
            const validityState = inputEl.validity as FormInputValidityState;

            if (inputEl.validity.customError) {
                // If the input is displaying a custom error,
                // we expose the errorCode stored in the validationMessage
                validityState.customErrorCode = inputEl.validationMessage;
            }

            validityObj[inputEl.name] = {
                validityState,
            };
            return validityObj;
        }
        return validityObj;
    }, {});
}

class Form extends React.Component<FormProps, FormState> {
    constructor(props: FormProps) {
        super(props);

        this.state = {
            registeredInputs: {},
        };
    }

    componentDidUpdate({ formValidityState: prevFormValidityState }: FormProps) {
        const { formValidityState } = this.props;
        const { registeredInputs } = this.state;

        if (formValidityState !== prevFormValidityState) {
            Object.keys(formValidityState).forEach(key => {
                if (registeredInputs[key]) {
                    registeredInputs[key](formValidityState[key]);
                }
            });
        }
    }

    onChange = ({ currentTarget }: React.FormEvent<HTMLFormElement>) => {
        if (this.props.onChange) {
            const formData = serialize(currentTarget, {
                hash: true,
                empty: true,
            });
            this.props.onChange(formData);
        }
    };

    onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        const form = event.target as HTMLFormElement;
        event.preventDefault();
        const isValid = form.checkValidity();
        const { onInvalidSubmit, onValidSubmit } = this.props;
        const { registeredInputs } = this.state;

        if (isValid) {
            const formData = serialize(form, { hash: true, empty: true });
            onValidSubmit(formData);
        } else {
            const formValidityState = getFormValidityState(form);

            // Push form validity state to inputs so errors are shown on submit
            Object.keys(formValidityState).forEach(
                key => registeredInputs[key] && registeredInputs[key](formValidityState[key].validityState),
            );

            if (onInvalidSubmit) {
                onInvalidSubmit(formValidityState);
            }
        }
    };

    registerInput = (name: string, setValidityStateHandler: (validityState: unknown) => void) => {
        const { registeredInputs } = this.state;

        if (registeredInputs[name]) {
            throw new Error(`Input '${name}' is already registered.`);
        }

        const nextState = this.state;
        nextState.registeredInputs[name] = setValidityStateHandler;
        this.setState(nextState);
    };

    unregisterInput = (name: string) => {
        const nextState = this.state;
        delete nextState.registeredInputs[name];
        this.setState(nextState);
    };

    render() {
        const { children } = this.props;
        return (
            <FormContext.Provider
                value={{
                    form: {
                        registerInput: this.registerInput,
                        unregisterInput: this.unregisterInput,
                    },
                }}
            >
                <form noValidate onChange={this.onChange} onSubmit={this.onSubmit}>
                    {children}
                </form>
            </FormContext.Provider>
        );
    }
}

export default Form;
