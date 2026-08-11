import * as React from 'react';
import classNames from 'classnames';
import uniqueId from 'lodash/uniqueId';

import Label from '../label';
import Tooltip, { TooltipPosition, TooltipTheme, type TooltipProps } from '../tooltip';

import './TextArea.scss';

export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    /** Add a class to the component */
    className?: string;
    /** Description shown below the label */
    description?: React.ReactNode;
    /** Error message shown in the error tooltip */
    error?: React.ReactNode;
    /** Renders error tooltip at the specified position (positions are those from Tooltip) */
    errorTooltipPosition?: NonNullable<TooltipProps['position']>;
    /** Hides the label */
    hideLabel?: boolean;
    /** Hides (optional) text from the label */
    hideOptionalLabel?: boolean;
    /** Makes the text area value required */
    isRequired?: boolean;
    /** Is text area resizable */
    isResizable?: boolean;
    /** Label displayed for the text area */
    label: React.ReactNode;
    /** Ref to the underlying textarea element. @TODO: eventually rename to innerRef for consistancy across all form elements */
    textareaRef?: React.Ref<HTMLTextAreaElement>;
    /** A CSS class for the tooltip's tether element component */
    tooltipTetherClassName?: string;
}

const TextArea = ({
    className = '',
    description,
    error,
    errorTooltipPosition,
    hideLabel,
    hideOptionalLabel,
    isRequired,
    isResizable,
    label,
    textareaRef,
    tooltipTetherClassName,
    ...rest
}: TextAreaProps) => {
    const hasError = !!error;
    const classes = classNames(className, 'text-area-container', {
        'show-error': hasError,
    });

    const errorMessageID = React.useRef(uniqueId('errorMessage')).current;
    const descriptionID = React.useRef(uniqueId('description')).current;

    const ariaAttrs = {
        'aria-invalid': hasError,
        'aria-required': isRequired,
        'aria-errormessage': errorMessageID,
        'aria-describedby': description ? descriptionID : undefined,
    };

    return (
        <div className={classes}>
            <Label hideLabel={hideLabel} showOptionalText={!hideOptionalLabel && !isRequired} text={label}>
                <>
                    {!!description && (
                        <div id={descriptionID} className="text-area-description">
                            {description}
                        </div>
                    )}
                    <Tooltip
                        isShown={hasError}
                        position={errorTooltipPosition || TooltipPosition.BOTTOM_LEFT}
                        tetherElementClassName={tooltipTetherClassName}
                        text={error || ''}
                        theme={TooltipTheme.ERROR}
                    >
                        <textarea
                            ref={textareaRef}
                            required={isRequired}
                            style={{ resize: isResizable ? '' : 'none' } as React.CSSProperties}
                            {...ariaAttrs}
                            {...rest}
                        />
                    </Tooltip>
                    <span id={errorMessageID} className="accessibility-hidden" role="alert">
                        {error}
                    </span>
                </>
            </Label>
        </div>
    );
};

TextArea.displayName = 'TextArea';

export default TextArea;
