// @flow
import * as React from 'react';
import classNames from 'classnames';

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
    hideLabel?: boolean,
    hideOptionalLabel?: boolean,
    inputRef?: Function,
    /** Renders a loading indicator within the component when true */
    isLoading?: boolean,
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
    const classes = classNames(className, 'text-input-container', {
        'show-error': !!error,
    });

    return (
        <div className={classes}>
            <Label
                text={label}
                showOptionalText={!hideOptionalLabel && !isRequired}
                hideLabel={hideLabel}
                tooltip={labelTooltip}
            >
                {!!description && <i className="text-input-description">{description}</i>}
                <Tooltip isShown={!!error} text={error || ''} position={errorPosition || 'middle-right'} theme="error">
                    <input ref={inputRef} required={isRequired} {...rest} />
                </Tooltip>
                {isLoading && !isValid && <LoadingIndicator className="text-input-loading" />}
                {isValid && !isLoading && <IconVerified className="text-input-verified" />}
            </Label>
        </div>
    );
};

TextInput.displayName = 'TextInput';

export default TextInput;
