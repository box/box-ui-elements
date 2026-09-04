import * as React from 'react';

import TextInputCore from '../../text-input';

// @ts-ignore flow import
import * as messages from '../input-messages';
// @ts-ignore flow import
import FormInput from '../form/FormInput';

export interface TextInputValidationError {
    /** Error code used with HTML constraint validation */
    code: string;
    /** Message displayed in the error tooltip */
    message: React.ReactNode;
}

export interface TextInputProps {
    /** Whether to automatically focus the input */
    autoFocus?: boolean;
    /** Add a class to the component */
    className?: string;
    /** Hides the visible label (label remains accessible) */
    hideLabel?: boolean;
    /** Whether the input is disabled */
    isDisabled?: boolean;
    /** Whether to show a loading indicator */
    isLoading?: boolean;
    /** Whether the input is read-only */
    isReadOnly?: boolean;
    /** Is input required */
    isRequired?: boolean;
    /** Label displayed for the text input */
    label: React.ReactNode;
    /** Tooltip shown on the label */
    labelTooltip?: React.ReactNode;
    /** Maximum character length */
    maxLength?: number;
    /** Minimum character length */
    minLength?: number;
    /** Name of the text input */
    name: string;
    /** Called when the text input is focused */
    onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
    /** html5 regex pattern for validation */
    pattern?: string;
    /** Placeholder for the text input */
    placeholder?: string;
    /** html input types (email, url, text, number), defaults to 'text' */
    type?: string;
    /** Custom validation. Returns `{ code, message }` when invalid, or a falsy value when valid. */
    validation?: (value: string) => TextInputValidationError | null | undefined;
    /** Value of the text input */
    value: string;
}

interface TextInputState {
    error: TextInputValidationError | null | undefined;
    value: string;
}

class TextInput extends React.Component<TextInputProps, TextInputState> {
    static defaultProps = {
        autoFocus: false,
        value: '',
        type: 'text',
        isReadOnly: false,
        isLoading: false,
    };

    constructor(props: TextInputProps) {
        super(props);
        this.state = {
            error: null,
            value: props.value,
        };
    }

    componentDidUpdate(prevProps: TextInputProps) {
        // If a new value is passed by prop, set it
        if (prevProps.value !== this.props.value) {
            this.setState({
                value: this.props.value,
            });
        }
    }

    onChange = ({ currentTarget }: React.SyntheticEvent<HTMLInputElement>) => {
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

    onValidityStateUpdateHandler = (error: ValidityState | TextInputValidationError) => {
        if ((error as ValidityState).valid !== undefined) {
            this.setErrorFromValidityState(error as ValidityState);
        } else {
            this.setState({
                error: error as TextInputValidationError,
            });
        }
    };

    setErrorFromValidityState(validityState: ValidityState) {
        const { badInput, customError, patternMismatch, tooLong, tooShort, typeMismatch, valid, valueMissing } =
            validityState;

        const { isRequired, minLength, maxLength, type, validation } = this.props;

        const { value } = this.state;

        let error: TextInputValidationError | null | undefined;

        if (valid) {
            error = null;
        } else if (badInput) {
            error = messages.badInput();
        } else if (patternMismatch) {
            error = messages.patternMismatch();
        } else if (tooShort && typeof minLength !== 'undefined') {
            error = messages.tooShort(minLength);
        } else if (tooLong && typeof maxLength !== 'undefined') {
            error = messages.tooLong(maxLength);
        } else if (typeMismatch && type === 'email') {
            error = messages.typeMismatchEmail();
        } else if (typeMismatch && type === 'url') {
            error = messages.typeMismatchUrl();
        } else if (valueMissing) {
            error = messages.valueMissing();
        } else if (customError && (isRequired || value.trim().length) && validation) {
            error = validation(value);
        }

        this.setState({
            error,
        });
    }

    input: HTMLInputElement | null | undefined;

    // Updates component value and validity state
    checkValidity = () => {
        const { isRequired, validation } = this.props;
        const { input } = this;
        if (!input) {
            return;
        }

        if (validation && (isRequired || input.value.trim().length)) {
            const error = validation(input.value);
            this.setState({
                error,
                value: input.value,
            });

            if (error) {
                input.setCustomValidity(error.code);
            } else {
                input.setCustomValidity('');
            }
        } else {
            this.setErrorFromValidityState(input.validity);
        }
    };

    render() {
        const {
            autoFocus,
            className = '',
            isDisabled,
            isRequired,
            label,
            maxLength,
            minLength,
            name,
            onFocus,
            pattern,
            placeholder,
            type,
            isReadOnly,
            isLoading,
            labelTooltip,
            hideLabel,
        } = this.props;

        const { error, value } = this.state;

        return (
            <div className={className}>
                <FormInput name={name} onValidityStateUpdate={this.onValidityStateUpdateHandler}>
                    <TextInputCore
                        disabled={isDisabled}
                        label={label}
                        isRequired={isRequired}
                        error={error ? error.message : null}
                        autoFocus={autoFocus}
                        maxLength={maxLength}
                        minLength={minLength}
                        name={name}
                        onBlur={this.checkValidity}
                        onFocus={onFocus}
                        onChange={this.onChange}
                        pattern={pattern}
                        placeholder={placeholder}
                        inputRef={input => {
                            this.input = input;
                        }}
                        type={type}
                        value={value}
                        readOnly={isReadOnly}
                        isLoading={isLoading}
                        labelTooltip={labelTooltip}
                        hideLabel={hideLabel}
                    />
                </FormInput>
            </div>
        );
    }
}

export default TextInput;
