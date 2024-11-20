import PropTypes from 'prop-types';
import React, { Component } from 'react';

class FormInput extends Component {
    static propTypes = {
        children: PropTypes.node.isRequired,
        /** callback called when Form pushed down a new validityState, useful for displaying server validation errors */
        onValidityStateUpdate: PropTypes.func.isRequired,
        /** Input name */
        name: PropTypes.string.isRequired,
    };

    static contextTypes = {
        form: PropTypes.shape({
            registerInput: PropTypes.func.isRequired,
            unregisterInput: PropTypes.func.isRequired,
        }),
    };

    componentDidMount() {
        const { name, onValidityStateUpdate } = this.props;

        if (this.context.form) {
            this.context.form.registerInput(name, onValidityStateUpdate);
        }
    }

    componentWillUnmount() {
        if (this.context.form) {
            this.context.form.unregisterInput(this.props.name);
        }
    }

    render() {
        return <div>{this.props.children}</div>;
    }
}

export default FormInput;
