/**
 * @flow
 * @file Plain Button component
 * @author Box
 */

import React from 'react';
import Button from './Button';

type Props = {
    children?: any,
    className: string
};

const PlainButton = ({ children, className = '', ...rest }: Props) =>
    <Button className={`buik-btn-plain ${className}`} {...rest}>
        {children}
    </Button>;

export default PlainButton;
