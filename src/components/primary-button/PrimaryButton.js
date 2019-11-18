// @flow
import * as React from 'react';
// $FlowFixMe migrated to TS
import Button from '../button'; // eslint-disable-line

type Props = {
    children?: React.Node,
    className?: string,
    isDisabled?: boolean,
    isLoading?: boolean,
    isSelected?: boolean,
};

const PrimaryButton = ({ children, className = '', isDisabled, isSelected, isLoading, ...rest }: Props) => (
    <Button
        className={`btn-primary ${className}`}
        isDisabled={isDisabled}
        isLoading={isLoading}
        isSelected={isSelected}
        {...rest}
    >
        {children}
    </Button>
);

export default PrimaryButton;
