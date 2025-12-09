import PropTypes from 'prop-types';
import React, { Component } from 'react';

import { FormContext } from './FormContext';

class FormInput extends Component {
    static propTypes = {
        children: PropTypes.node.isRequired,
        /** callback called when Form pushed down a new validityState, useful for displaying server validation errors */
        onValidityStateUpdate: PropTypes.func.isRequired,
        /** Input name */
        name: PropTypes.string.isRequired,
    };

    componentDidMount() {
        const { name, onValidityStateUpdate } = this.props;
        const formContext = this.context;

        if (formContext && formContext.form) {
            formContext.form.registerInput(name, onValidityStateUpdate);
        }
    }

    componentWillUnmount() {
        const formContext = this.context;
        if (formContext && formContext.form) {
            formContext.form.unregisterInput(this.props.name);
        }
    }

    render() {
        return <div>{this.props.children}</div>;
    }
}

FormInput.contextType = FormContext;

export default FormInput;
