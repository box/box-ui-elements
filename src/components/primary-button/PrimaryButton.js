// @flow
import * as React from 'react';

import Button from '../button';

type Props = {
    children?: React.Node,
    className?: string,
    isDisabled?: boolean,
    isLoading?: boolean,
    isSelected?: boolean,
};

const PrimaryButton = ({ children, className = '', isDisabled, isSelected, isLoading, ...rest }: Props) => (
    <Button
        className={`bdl-Button--primary ${className}`}
        isDisabled={isDisabled}
        isLoading={isLoading}
        isSelected={isSelected}
        {...rest}
    >
        {children}
    </Button>
);

export default PrimaryButton;
