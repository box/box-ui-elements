import React from 'react';
import PropTypes from 'prop-types';

export const FormContext = React.createContext(null);

FormContext.displayName = 'FormContext';

export const FormContextPropTypes = {
    form: PropTypes.shape({
        registerInput: PropTypes.func.isRequired,
        unregisterInput: PropTypes.func.isRequired,
    }),
};
