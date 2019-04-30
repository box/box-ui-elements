// @flow
import * as React from 'react';
import classNames from 'classnames';

import Label from '../label';
import Tooltip from '../tooltip';

import './TextArea.scss';

type Props = {
    className?: string,
    error?: React.Node,
    /** Hides the label */
    hideLabel?: boolean,
    /** Hides (optional) text from the label */
    hideOptionalLabel?: boolean,
    /** Makes the text area value required */
    isRequired?: boolean,
    /** Is text area resizable */
    isResizable?: boolean,
    /** Label displayed for the text area */
    label: React.Node,
    textareaRef?: Function, // @TODO: eventually rename to innerRef for consistancy across all form elements
};

const TextArea = ({
    className = '',
    error,
    hideLabel,
    hideOptionalLabel,
    isRequired,
    isResizable,
    label,
    textareaRef,
    ...rest
}: Props) => {
    const classes = classNames(className, 'text-area-container', {
        'show-error': !!error,
    });

    return (
        <div className={classes}>
            <Label hideLabel={hideLabel} showOptionalText={!hideOptionalLabel && !isRequired} text={label}>
                <Tooltip isShown={!!error} position="bottom-left" text={error || ''} theme="error">
                    <textarea
                        ref={textareaRef}
                        required={isRequired}
                        style={{ resize: isResizable ? '' : 'none' }}
                        {...rest}
                    />
                </Tooltip>
            </Label>
        </div>
    );
};

TextArea.displayName = 'TextArea';

export type TextAreaProps = Props;
export default TextArea;
