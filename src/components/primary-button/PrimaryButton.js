// @flow
import * as React from 'react';

import Button from '../button';

type Props = {
    children?: React.Node,
    className?: string,
    dataTestId?: string,
    isDisabled?: boolean,
    isLoading?: boolean,
    isSelected?: boolean,
};

const PrimaryButton = ({ children, className = '', dataTestId, isDisabled, isSelected, isLoading, ...rest }: Props) => (
    <Button
        className={`btn-primary ${className}`}
        dataTestId={dataTestId}
        isDisabled={isDisabled}
        isLoading={isLoading}
        isSelected={isSelected}
        {...rest}
    >
        {children}
    </Button>
);

export default PrimaryButton;
