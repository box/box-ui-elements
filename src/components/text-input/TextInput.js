// @flow
import * as React from 'react';
import classNames from 'classnames';
import uniqueId from 'lodash/uniqueId';

import IconVerified from '../../icons/general/IconVerified';

import Label from '../label';
import LoadingIndicator from '../loading-indicator';
import Tooltip from '../tooltip';
import type { Position } from '../tooltip';

import './TextInput.scss';

type Props = {
    /** Add a class to the component */
    className?: string,
    description?: React.Node,
    error?: React.Node,
    /** Renders error tooltip at the specified position (positions are those from Tooltip) */
    errorPosition?: Position,
    /** Hides the label */
    hideLabel?: boolean,
    /** Hides (optional) text from the label */
    hideOptionalLabel?: boolean,
    inputRef?: Function, // @TODO: eventually rename to innerRef for consistancy across all form elements
    /** Renders a loading indicator within the component when true */
    isLoading?: boolean,
    /** Makes the input value required */
    isRequired?: boolean,
    /** Renders a green verified checkmark within the component when true */
    isValid?: boolean,
    /** Label displayed for the text input */
    label: React.Node,
    labelTooltip?: React.Node,
};

const TextInput = ({
    className = '',
    description,
    error,
    errorPosition,
    hideLabel,
    hideOptionalLabel,
    inputRef,
    isLoading,
    isRequired,
    isValid,
    label,
    labelTooltip,
    ...rest
}: Props) => {
    const hasError = !!error;
    const classes = classNames(className, 'text-input-container', {
        'show-error': hasError,
    });

    const errorMessageID = React.useRef(uniqueId('errorMessage')).current;
    const ariaAttrs = {
        'aria-invalid': hasError,
        'aria-required': isRequired,
        'aria-errormessage': errorMessageID,
    };

    return (
        <div className={classes}>
            <Label
                hideLabel={hideLabel}
                showOptionalText={!hideOptionalLabel && !isRequired}
                text={label}
                tooltip={labelTooltip}
            >
                {!!description && <i className="text-input-description">{description}</i>}
                <Tooltip isShown={hasError} position={errorPosition || 'middle-right'} text={error || ''} theme="error">
                    <input ref={inputRef} required={isRequired} {...ariaAttrs} {...rest} />
                </Tooltip>
                {isLoading && !isValid && <LoadingIndicator className="text-input-loading" />}
                {isValid && !isLoading && <IconVerified className="text-input-verified" />}
                <span id={errorMessageID} className="accessibility-hidden" role="alert">
                    {error}
                </span>
            </Label>
        </div>
    );
};

TextInput.displayName = 'TextInput';

export type TextInputProps = Props;
export default TextInput;
