// @flow
import * as React from 'react';

type Props = {
    children?: React.Node,
    className?: string,
    dataTestId?: string,
    getDOMRef?: Function,
    /** Whether this button should be functionally disabled but still react on hover/focus for tooltips */
    isDisabled?: boolean,
    type?: 'button' | 'reset' | 'submit',
};

const PlainButton = ({
    children,
    className = '',
    dataTestId,
    getDOMRef,
    isDisabled = false,
    type = 'submit',
    ...rest
}: Props) => {
    const buttonProps = {};
    if (isDisabled) {
        buttonProps['aria-disabled'] = true;
        buttonProps.onClick = event => {
            event.preventDefault();
            event.stopPropagation();
        };
    }

    return (
        // eslint-disable-next-line react/button-has-type
        <button
            className={`btn-plain ${className}`}
            data-testid={dataTestId}
            ref={getDOMRef}
            type={type}
            {...rest}
            {...buttonProps}
        >
            {children}
        </button>
    );
};

export default PlainButton;
