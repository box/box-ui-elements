// @flow
import * as React from 'react';
import classNames from 'classnames';

import Label from '../label';
import Tooltip from '../tooltip';

import './TextArea.scss';

type Props = {
    className?: string,
    error?: React.Node,
    hideLabel?: boolean,
    isRequired?: boolean,
    /** Is text area resizable */
    isResizable?: boolean,
    /** Label displayed for the text area */
    label: React.Node,
    textareaRef?: Function,
};

const TextArea = ({
    className = '',
    error,
    hideLabel,
    textareaRef,
    label,
    isRequired,
    isResizable,
    ...rest
}: Props) => {
    const classes = classNames(className, 'text-area-container', {
        'show-error': !!error,
    });

    return (
        <div className={classes}>
            <Label hideLabel={hideLabel} showOptionalText={!isRequired} text={label}>
                <Tooltip isShown={!!error} text={error || ''} position="bottom-left" theme="error">
                    <textarea
                        required={isRequired}
                        ref={textareaRef}
                        style={{ resize: isResizable ? '' : 'none' }}
                        {...rest}
                    />
                </Tooltip>
            </Label>
        </div>
    );
};

TextArea.displayName = 'TextArea';

export default TextArea;
