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
    /** Icon to display in the input field */
    icon?: React.Node,
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
    /** A CSS class for the tooltip's tether element component */
    tooltipTetherClassName?: string,
};

const TextInput = ({
    className = '',
    description,
    error,
    errorPosition,
    hideLabel,
    hideOptionalLabel,
    icon,
    inputRef,
    isLoading,
    isRequired,
    isValid,
    label,
    labelTooltip,
    tooltipTetherClassName,
    ...rest
}: Props) => {
    const hasError = !!error;
    const classes = classNames(className, 'text-input-container', {
        'show-error': hasError,
    });

    const descriptionID = React.useRef(uniqueId('description')).current;

    const ariaAttrs = {
        'aria-invalid': hasError,
        'aria-required': isRequired,
        'aria-describedby': description ? descriptionID : undefined,
    };

    return (
        <div className={classes}>
            <Label
                hideLabel={hideLabel}
                showOptionalText={!hideOptionalLabel && !isRequired}
                text={label}
                tooltip={labelTooltip}
            >
                {!!description && (
                    <div id={descriptionID} className="text-input-description">
                        {description}
                    </div>
                )}
                <Tooltip
                    isShown={hasError}
                    position={errorPosition || 'middle-right'}
                    targetWrapperClassName="text-input-tooltip-target"
                    tetherElementClassName={tooltipTetherClassName}
                    text={error || ''}
                    theme="error"
                >
                    <input ref={inputRef} required={isRequired} {...ariaAttrs} {...rest} />
                </Tooltip>
                {isLoading && !isValid && <LoadingIndicator className="text-input-loading" />}
                {isValid && !isLoading && <IconVerified className="text-input-verified" />}
                {!isLoading && !isValid && icon ? icon : null}
            </Label>
        </div>
    );
};

TextInput.displayName = 'TextInput';

export type TextInputProps = Props;
export default TextInput;
