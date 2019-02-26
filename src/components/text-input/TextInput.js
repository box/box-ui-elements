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
    const classes = classNames(className, 'bdl-TextInput-container', {
        'bdl-hasError': !!error,
    });

    return (
        <div className={classes}>
            <Label
                className="bdl-TextInput-label"
                hideLabel={hideLabel}
                showOptionalText={!hideOptionalLabel && !isRequired}
                text={label}
                tooltip={labelTooltip}
            >
                {!!description && <i className="bdl-TextInput-description">{description}</i>}
                <Tooltip isShown={!!error} position={errorPosition || 'middle-right'} text={error || ''} theme="error">
                    <input {...rest} className="bdl-TextInput-input" ref={inputRef} required={isRequired} />
                </Tooltip>
                {isLoading && !isValid && <LoadingIndicator className="bdl-TextInput-loadingIndicator" />}
                {isValid && !isLoading && <IconVerified className="bdl-TextInput-iconVerified" />}
            </Label>
        </div>
    );
};

export default TextInput;
