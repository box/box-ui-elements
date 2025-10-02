// @flow
import * as React from 'react';

import TextAreaCore from '../../text-area';

import * as messages from '../input-messages';
import FormInput from '../form/FormInput';

type Props = {
    autoFocus?: boolean,
    /** Add a class to the component */
    className?: string,
    isDisabled?: boolean,
    isReadOnly?: boolean,
    isRequired?: boolean,
    /** Is text area resizable */
    isResizable?: boolean,
    /** Label displayed for the text area */
    label: React.Node,
    maxLength?: number,
    /** Name of the text area */
    name: string,
    /** Placeholder for the text area */
    placeholder?: string,
    /** Validation function that returns an error string or a promise that resolves to an error string */
    validation?: Function,
    /** Default value of the text area */
    value: string,
};

type State = {
    error: Object | null,
    value: string,
};

class TextArea extends React.Component<Props, State> {
    static defaultProps = {
        autoFocus: false,
        value: '',
        isReadOnly: false,
    };

    constructor(props: Props) {
        super(props);
        this.state = {
            error: null,
            value: props.value,
        };
    }

    componentDidUpdate({ value: prevValue }: Props) {
        // If a new value is passed by prop, set it
        if (prevValue !== this.props.value) {
            this.setState({
                value: this.props.value,
            });
        }
    }

    onChange = ({ currentTarget }: SyntheticEvent<HTMLTextAreaElement>) => {
        const { value } = currentTarget;
        if (this.state.error) {
            this.setState(
                {
                    value,
                },
                this.checkValidity,
            );
        } else {
            this.setState({
                value,
            });
        }
    };

    onValidityStateUpdateHandler = (error: Object) => {
        if (error.valid !== undefined) {
            this.setErrorFromValidityState(error);
        } else {
            this.setState({
                error,
            });
        }
    };

    setErrorFromValidityState(validityState: ValidityState) {
        const { badInput, customError, tooLong, valid, valueMissing } = validityState;

        const { isRequired, maxLength, validation } = this.props;

        const { value } = this.state;

        let error;

        if (valid) {
            error = null;
        } else if (badInput) {
            error = messages.badInput();
        } else if (tooLong && typeof maxLength !== 'undefined') {
            error = messages.tooLong(maxLength);
        } else if (valueMissing) {
            error = messages.valueMissing();
        } else if (customError && (isRequired || value.trim().length) && validation) {
            error = validation(value);
        }

        this.setState({
            error,
        });
    }

    textarea: ?HTMLTextAreaElement;

    // Updates component value and validity state
    checkValidity = () => {
        const { isRequired, validation } = this.props;
        const { textarea } = this;

        if (!textarea) {
            return;
        }

        if (validation && (isRequired || textarea.value.trim().length)) {
            const error = validation(textarea.value);
            this.setState({
                error,
                value: textarea.value,
            });

            if (error) {
                textarea.setCustomValidity(error.code);
            } else {
                textarea.setCustomValidity('');
            }
        } else {
            this.setErrorFromValidityState(textarea.validity);
        }
    };

    render() {
        const {
            autoFocus,
            className = '',
            isDisabled,
            isReadOnly,
            isRequired,
            isResizable,
            label,
            name,
            placeholder,
        } = this.props;

        const { error, value } = this.state;

        return (
            <div className={className}>
                <FormInput name={name} onValidityStateUpdate={this.onValidityStateUpdateHandler}>
                    <TextAreaCore
                        autoFocus={autoFocus}
                        disabled={isDisabled}
                        error={error ? error.message : null}
                        label={label}
                        isRequired={isRequired}
                        isResizable={isResizable}
                        name={name}
                        onBlur={this.checkValidity}
                        onChange={this.onChange}
                        placeholder={placeholder}
                        readOnly={isReadOnly}
                        textareaRef={textarea => {
                            this.textarea = textarea;
                        }}
                        value={value}
                    />
                </FormInput>
            </div>
        );
    }
}

export default TextArea;
