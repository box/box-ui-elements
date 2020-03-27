import * as React from 'react';
import Button, { ButtonProps } from '../button/Button';

const PrimaryButton = ({ children, className = '', ...rest }: Partial<ButtonProps>) => (
    <Button className={`btn-primary ${className}`} {...rest}>
        {children}
    </Button>
);

export default PrimaryButton;
