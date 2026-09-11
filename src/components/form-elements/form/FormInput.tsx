import * as React from 'react';

import { FormContext } from './FormContext';
import type { FormContextValue } from './FormContext';

export interface FormInputProps {
    /** Input (or other field) registered with the parent form */
    children: React.ReactNode;
    /** Input name */
    name: string;
    /** Called when Form pushes down a new validityState, useful for displaying server validation errors */
    onValidityStateUpdate: (validityState: unknown) => void;
}

class FormInput extends React.Component<FormInputProps> {
    static contextType = FormContext;

    componentDidMount() {
        const { name, onValidityStateUpdate } = this.props;
        const formContext = this.context as FormContextValue | null;

        if (formContext?.form) {
            formContext.form.registerInput(name, onValidityStateUpdate);
        }
    }

    componentWillUnmount() {
        const formContext = this.context as FormContextValue | null;
        if (formContext?.form) {
            formContext.form.unregisterInput(this.props.name);
        }
    }

    render() {
        return <div>{this.props.children}</div>;
    }
}

export default FormInput;
