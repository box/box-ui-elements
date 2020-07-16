import * as React from 'react';
import noop from 'lodash/noop';

import { ButtonType } from '../button';

export interface PlainButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
    /** Contents of the plain button */
    children?: React.ReactNode;
    /** Custom class name for the plain button */
    className?: string;
    /** Function to get the DOM reference to the html button */
    getDOMRef?: React.LegacyRef<HTMLButtonElement>;
    /** Whether this button should be functionally disabled but still react on hover/focus for tooltips */
    isDisabled?: boolean;
    /** onClick handler for the button */
    onClick?: (event: React.SyntheticEvent<HTMLButtonElement>) => void;
    /** Type of the button - submit, button, reset */
    type?: ButtonType;
}

const PlainButton = ({
    children,
    className = '',
    getDOMRef = noop,
    isDisabled = false,
    type = ButtonType.SUBMIT,
    ...rest
}: PlainButtonProps) => {
    const buttonProps: { [key: string]: boolean | ((event: React.SyntheticEvent<HTMLButtonElement>) => void) } = {};
    if (isDisabled) {
        buttonProps['aria-disabled'] = true;
        buttonProps.onClick = (event: React.SyntheticEvent<HTMLButtonElement>) => {
            event.preventDefault();
            event.stopPropagation();
        };
    }

    return (
        // eslint-disable-next-line react/button-has-type
        <button className={`btn-plain ${className}`} ref={getDOMRef} type={type} {...rest} {...buttonProps}>
            {children}
        </button>
    );
};

export default PlainButton;
