import PropTypes from 'prop-types';
import React, { Component } from 'react';
import serialize from 'form-serialize';

function getFormValidityState(form) {
    // Turn the form.elements HTMLCollection into Array before reducing
    return [].slice.call(form.elements).reduce((validityObj, inputEl) => {
        // Only serialize inputs that have a name defined
        if (inputEl.name && !inputEl.validity.valid) {
            const validityState = inputEl.validity;

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

class Form extends Component {
    static propTypes = {
        children: PropTypes.node,
        /** Called when an input in the form changes */
        onChange: PropTypes.func,
        /** Called when a valid submit is made */
        onValidSubmit: PropTypes.func.isRequired,
        /** Called when an invalid submit is made */
        onInvalidSubmit: PropTypes.func,
        /** An object mapping input names to error messages */
        formValidityState: PropTypes.object, // eslint-disable-line react/no-unused-prop-types
    };

    static childContextTypes = {
        form: PropTypes.shape({
            registerInput: PropTypes.func.isRequired,
            unregisterInput: PropTypes.func.isRequired,
        }).isRequired,
    };

    constructor(props) {
        super(props);

        this.state = {
            registeredInputs: {},
        };
    }

    getChildContext() {
        return {
            form: {
                registerInput: this.registerInput.bind(this),
                unregisterInput: this.unregisterInput.bind(this),
            },
        };
    }

    componentDidUpdate({ formValidityState: prevFormValidityState }) {
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

    onChange = ({ currentTarget }) => {
        if (this.props.onChange) {
            const formData = serialize(currentTarget, {
                hash: true,
                empty: true,
            });
            this.props.onChange(formData);
        }
    };

    onSubmit = event => {
        const form = event.target;
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

    registerInput = (name, setValidityStateHandler) => {
        const { registeredInputs } = this.state;

        if (registeredInputs[name]) {
            throw new Error(`Input '${name}' is already registered.`);
        }

        const nextState = this.state;
        nextState.registeredInputs[name] = setValidityStateHandler;
        this.setState(nextState);
    };

    unregisterInput = name => {
        const nextState = this.state;
        delete nextState.registeredInputs[name];
        this.setState(nextState);
    };

    render() {
        const { children } = this.props;
        return (
            <form noValidate onChange={this.onChange} onSubmit={this.onSubmit}>
                {children}
            </form>
        );
    }
}

export default Form;
