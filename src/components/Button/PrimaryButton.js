/**
 * @flow
 * @file Primary Button component
 * @author Box
 */

import React from 'react';
import Button from './Button';

type Props = {
    children?: any,
    className: string
};

const PrimaryButton = ({ children, className = '', ...rest }: Props) =>
    <Button className={`buik-btn-primary ${className}`} {...rest}>
        {children}
    </Button>;

export default PrimaryButton;
