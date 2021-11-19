import * as React from 'react';

import LinkButton, { LinkButtonProps } from './LinkButton';

export interface LinkPrimaryButtonProps extends LinkButtonProps {
    className?: string;
}

const LinkPrimaryButton = ({ className = '', ...rest }: LinkPrimaryButtonProps) => (
    <LinkButton className={`btn-primary ${className}`} {...rest} />
);

export default LinkPrimaryButton;
