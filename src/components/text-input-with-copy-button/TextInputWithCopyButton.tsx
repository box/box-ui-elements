import * as React from 'react';
import classNames from 'classnames';
import omit from 'lodash/omit';
import { FormattedMessage } from 'react-intl';

import messages from '../../common/messages';
import TextInput, { type TextInputProps } from '../text-input';
import Button, { ButtonType } from '../button';
import { type ButtonProps } from '../button/Button';

import './TextInputWithCopyButton.scss';

const DEFAULT_SUCCESS_STATE_DURATION = 3000;

const defaultCopyText = <FormattedMessage {...messages.copy} />;
const defaultCopiedText = <FormattedMessage {...messages.copied} />;

export interface TextInputWithCopyButtonProps
    extends Omit<TextInputProps, 'className' | 'disabled' | 'label' | 'onFocus' | 'type' | 'value'> {
    /** Array of nodes for additional buttons */
    additionalButtons?: React.ReactNode[];
    /** Set the focus to input when component loads */
    autofocus?: boolean;
    /** Default copy button text */
    buttonDefaultText: React.ReactNode;
    /** Props passed to the copy button */
    buttonProps?: Partial<ButtonProps> | object;
    /** Copy button text when copy is successful */
    buttonSuccessText?: React.ReactNode;
    /** Custom class for the component */
    className: string;
    /** Disables the text input and copy button */
    disabled?: boolean;
    /** Label displayed for the text input */
    // TODO: Make label required
    label?: React.ReactNode;
    /** Function called when link is copied by keyboard or button */
    onCopySuccess?: React.ClipboardEventHandler<HTMLDivElement>;
    /** Focus handler for the input element */
    onFocus?: React.FocusEventHandler<HTMLInputElement>;
    /** Duration (milliseconds) in which to show the copy success state */
    successStateDuration: number;
    /** Triggers the copy animation when the component loads */
    triggerCopyOnLoad?: boolean;
    /** HTML input type, defaults to "text" */
    type: string;
    /** Value of the text input */
    value: React.ReactNode;
}

interface State {
    /** Text currently displayed by the copy button */
    buttonText: React.ReactNode;
    /** Whether the copy action succeeded */
    copySuccess: boolean;
    /** Whether the input has already been focused */
    hasFocused: boolean;
}

class TextInputWithCopyButton extends React.PureComponent<TextInputWithCopyButtonProps, State> {
    static defaultProps = {
        buttonDefaultText: defaultCopyText,
        buttonProps: {},
        buttonSuccessText: defaultCopiedText,
        className: '',
        hideOptionalLabel: true,
        readOnly: true,
        successStateDuration: DEFAULT_SUCCESS_STATE_DURATION,
        type: 'text',
    };

    constructor(props: TextInputWithCopyButtonProps) {
        super(props);

        this.isCopyCommandSupported = document.queryCommandSupported('copy');

        this.state = {
            copySuccess: false,
            buttonText: props.buttonDefaultText,
            hasFocused: false,
        };
    }

    componentDidMount() {
        const { autofocus, value } = this.props;

        if (autofocus && value) {
            this.performAutofocus();
        }
    }

    componentDidUpdate() {
        const { autofocus, value, triggerCopyOnLoad } = this.props;
        const { copySuccess, hasFocused } = this.state;

        // if we've set focus before, and should auto focus on update, make sure to
        // focus after component update
        if (autofocus && value) {
            this.performAutofocus();
        }

        if (triggerCopyOnLoad && !copySuccess && !hasFocused) {
            this.animateCopyButton();
        }
    }

    componentWillUnmount() {
        this.clearCopySuccessTimeout();
    }

    copyInputRef: HTMLInputElement | null = null;

    copySuccessTimeout: number | null = null;

    isCopyCommandSupported: boolean;

    animateCopyButton() {
        const { successStateDuration, buttonSuccessText } = this.props;
        this.clearCopySuccessTimeout();

        this.setState(
            {
                copySuccess: true,
                buttonText: buttonSuccessText,
                hasFocused: true,
            },
            () => {
                this.copySuccessTimeout = window.setTimeout(() => {
                    this.restoreCopyButton();
                }, successStateDuration);
            },
        );
    }

    clearCopySuccessTimeout() {
        if (!this.copySuccessTimeout) {
            return;
        }

        window.clearTimeout(this.copySuccessTimeout);
        this.copySuccessTimeout = null;
    }

    copySelectedText = () => document.execCommand('copy');

    restoreCopyButton = () => {
        this.setState({
            copySuccess: false,
            buttonText: this.props.buttonDefaultText,
        });
    };

    handleCopyButtonClick = () => {
        this.performAutofocus();
        this.copySelectedText();
        this.animateCopyButton();
    };

    handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
        if (this.copyInputRef) {
            this.performAutofocus();
        }

        if (this.props.onFocus) {
            this.props.onFocus(event);
        }
    };

    handleCopyEvent = (event: React.ClipboardEvent<HTMLDivElement>) => {
        const { disabled, onCopySuccess } = this.props;

        if (disabled) {
            event.preventDefault();
        } else {
            this.animateCopyButton();

            if (onCopySuccess) {
                onCopySuccess(event);
            }
        }
    };

    performAutofocus = () => {
        const { copyInputRef } = this;
        if (copyInputRef) {
            copyInputRef.select();
            copyInputRef.scrollLeft = 0;
        }
    };

    renderCopyButton = () =>
        this.isCopyCommandSupported ? (
            <Button
                isDisabled={this.props.disabled}
                onClick={this.handleCopyButtonClick}
                type={ButtonType.BUTTON}
                {...this.props.buttonProps}
            >
                {this.state.buttonText}
            </Button>
        ) : null;

    render() {
        const { additionalButtons, className, ...rest } = this.props;
        const { copySuccess } = this.state;
        const { isCopyCommandSupported } = this;

        const inputProps = omit(rest, [
            'autofocus',
            'buttonDefaultText',
            'buttonSuccessText',
            'buttonProps',
            'onCopySuccess',
            'successStateDuration',
            'triggerCopyOnLoad',
        ]) as TextInputProps;

        if (isCopyCommandSupported) {
            inputProps.inputRef = ref => {
                this.copyInputRef = ref;
            };
        }

        const wrapperClasses = classNames(className, {
            'copy-success': copySuccess,
            'text-input-with-copy-button-container': isCopyCommandSupported,
        });

        const copyEvent = isCopyCommandSupported ? { onCopy: this.handleCopyEvent } : {};

        return (
            <div className={wrapperClasses} {...copyEvent}>
                <TextInput
                    {...inputProps}
                    onFocus={this.handleFocus}
                    tooltipWrapperClassName="bdl-TextInputWithCopyButton-tooltipWrapper"
                />
                {additionalButtons}
                {this.renderCopyButton()}
            </div>
        );
    }
}

export default TextInputWithCopyButton;
