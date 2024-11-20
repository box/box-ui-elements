import { createContext } from 'react';

const FormContext = createContext({ 
    form: {
        registerInput: null, 
        unregisterInput: null,
    },
});

export default FormContext;