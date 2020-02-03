import * as React from 'react';
import LinkBase, { LinkBaseProps } from './LinkBase';

export interface LinkButtonProps extends LinkBaseProps {
    children: React.ReactChild;
    className?: string;
}

const LinkButton = ({ className = '', ...rest }: LinkButtonProps) => (
    <LinkBase className={`btn ${className}`} {...rest} />
);

export default LinkButton;
