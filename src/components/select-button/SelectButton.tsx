import * as React from 'react';
import classNames from 'classnames';

import Tooltip, { TooltipPosition, TooltipTheme } from '../tooltip';
import './SelectButton.scss';

export interface SelectButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    /** Button content */
    children?: React.ReactNode;
    /** Additional CSS class for the button */
    className: string;
    /** Error content shown in a tooltip */
    error?: React.ReactNode;
    /** Position of the error tooltip relative to the button */
    errorTooltipPosition?: TooltipPosition;
    /** Whether the button is disabled */
    isDisabled: boolean;
    /** A CSS class for the tooltip's tether element component */
    tooltipTetherClassName?: string;
}

const SelectButton = React.forwardRef<HTMLButtonElement, SelectButtonProps>(
    (
        {
            children,
            className = '',
            error,
            errorTooltipPosition = TooltipPosition.MIDDLE_RIGHT,
            isDisabled = false,
            tooltipTetherClassName,
            ...rest
        },
        ref,
    ) => (
        <Tooltip
            isShown={!!error}
            position={errorTooltipPosition}
            tetherElementClassName={tooltipTetherClassName}
            text={error}
            theme={TooltipTheme.ERROR}
        >
            <button
                className={classNames(className, 'select-button', 'bdl-SelectButton', {
                    'is-invalid': !!error,
                })}
                disabled={isDisabled}
                ref={ref}
                type="button"
                {...rest}
            >
                {children}
            </button>
        </Tooltip>
    ),
);

export default SelectButton;
