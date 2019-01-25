// @flow
import * as React from 'react';

type Props = {
    children?: React.Node,
    className?: string,
    isDisabled?: boolean,
};

const SelectButton = ({ children, className = '', isDisabled = false, ...rest }: Props) => (
    <button className={`select-button ${className}`} type="button" disabled={isDisabled} {...rest}>
        {children}
    </button>
);

export default SelectButton;
