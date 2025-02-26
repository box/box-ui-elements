import * as React from 'react';
import classNames from 'classnames';
import LinkBase, { LinkBaseProps } from './LinkBase';

export interface LinkButtonProps extends LinkBaseProps {
    children: React.ReactNode;
    className?: string;
    size?: 'large';
}

const LinkButton = ({ className = '', size, ...rest }: LinkButtonProps) => (
    <LinkBase className={classNames('btn', className, { 'bdl-btn--large': size === 'large' })} {...rest} />
);

export default LinkButton;
