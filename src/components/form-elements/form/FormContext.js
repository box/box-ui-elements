import React from 'react';

export const FormContext = React.createContext({
    registerInput: () => {},
    unregisterInput: () => {},
});

export const FormConsumer = FormContext.Consumer;

export const FormProvider = ({ children, value }) => (
    <FormContext.Provider value={value}>{children}</FormContext.Provider>
);
