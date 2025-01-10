import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { FormConsumer } from './FormContext';

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
        if (this.form) {
            this.form.registerInput(name, onValidityStateUpdate);
        }
    }

    componentWillUnmount() {
        const { name } = this.props;
        if (this.form) {
            this.form.unregisterInput(name);
        }
    }

    setFormRef = form => {
        this.form = form;
        if (form) {
            const { name, onValidityStateUpdate } = this.props;
            form.registerInput(name, onValidityStateUpdate);
        }
    };

    renderWithForm = form => {
        this.setFormRef(form);
        return <div>{this.props.children}</div>;
    };

    render() {
        return <FormConsumer>{this.renderWithForm}</FormConsumer>;
    }
}

export default FormInput;
