import * as React from 'react';

import LinkButton from './LinkButton';
import { LinkBaseProps } from './LinkBase';

export interface LinkPrimaryButtonProps extends LinkBaseProps {
    children: React.ReactNode;
    className?: string;
}

const LinkPrimaryButton = ({ className = '', ...rest }: LinkPrimaryButtonProps) => (
    <LinkButton className={`btn-primary ${className}`} {...rest} />
);

export default LinkPrimaryButton;
