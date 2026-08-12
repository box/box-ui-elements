// @flow
import * as React from 'react';
import classNames from 'classnames';

import Tooltip from '../tooltip';
import type { Position } from '../tooltip';
import './SelectButton.scss';

type Props = {
    children?: React.Node,
    className: string,
    error?: React.Node,
    errorTooltipPosition?: Position,
    isDisabled: boolean,
    /** A CSS class for the tooltip's tether element component */
    tooltipTetherClassName?: string,
};

const SelectButton = React.forwardRef<Props, HTMLButtonElement>(
    (
        {
            children,
            className = '',
            error,
            errorTooltipPosition = 'middle-right',
            isDisabled = false,
            tooltipTetherClassName,
            ...rest
        }: Props,
        ref,
    ) => (
        <Tooltip
            isShown={!!error}
            position={errorTooltipPosition}
            tetherElementClassName={tooltipTetherClassName}
            text={error}
            theme="error"
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
