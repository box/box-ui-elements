import * as React from 'react';

export interface FormContextValue {
    form?: {
        /** Registers a named input so the form can push validity updates */
        registerInput: (name: string, setValidityStateHandler: (validityState: unknown) => void) => void;
        /** Unregisters a previously registered named input */
        unregisterInput: (name: string) => void;
    };
}

export const FormContext = React.createContext<FormContextValue | null>(null);

FormContext.displayName = 'FormContext';
