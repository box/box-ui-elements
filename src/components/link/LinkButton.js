// @flow
import * as React from 'react';

import LinkBase from './LinkBase';

type Props = {
    children: React.Node,
    className?: string,
};

const LinkButton = ({ className = '', ...rest }: Props) => <LinkBase className={`btn ${className}`} {...rest} />;

export default LinkButton;
