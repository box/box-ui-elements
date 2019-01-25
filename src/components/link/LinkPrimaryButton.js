// @flow
import * as React from 'react';

import LinkButton from './LinkButton';

type Props = {
    children: React.Node,
    className?: string,
};

const LinkPrimaryButton = ({ className = '', ...rest }: Props) => (
    <LinkButton className={`btn-primary ${className}`} {...rest} />
);

export default LinkPrimaryButton;
