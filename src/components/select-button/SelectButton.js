// @flow
import * as React from 'react';
import classNames from 'classnames';

import Tooltip from '../tooltip';
import './SelectButton.scss';

type Props = {
    children?: React.Node,
    className: string,
    error?: React.Node,
    isDisabled: boolean,
};

const SelectButton = React.forwardRef<Props, HTMLButtonElement>(
    ({ children, className = '', error, isDisabled = false, ...rest }: Props, ref) => (
        <Tooltip isShown={!!error} position="middle-right" text={error} theme="error">
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
