// @flow
import * as React from 'react';

import Button from '../button';

type Props = {
    children?: React.Node,
    className?: string,
    isDisabled?: boolean,
    isSelected?: boolean,
    isLoading?: boolean,
};

const PrimaryButton = ({ children, className = '', isDisabled, isSelected, isLoading, ...rest }: Props) => (
    <Button
        className={`btn-primary ${className}`}
        isDisabled={isDisabled}
        isSelected={isSelected}
        isLoading={isLoading}
        {...rest}
    >
        {children}
    </Button>
);

export default PrimaryButton;
