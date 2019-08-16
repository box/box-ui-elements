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

const SelectButton = ({ children, className = '', error, isDisabled = false, ...rest }: Props) => (
    <Tooltip isShown={!!error} position="middle-right" text={error} theme="error">
        <button
            className={classNames(className, 'select-button', {
                'is-invalid': !!error,
            })}
            disabled={isDisabled}
            type="button"
            {...rest}
        >
            {children}
        </button>
    </Tooltip>
);

export default SelectButton;
