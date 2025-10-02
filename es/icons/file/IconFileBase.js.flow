// @flow
import * as React from 'react';

import AccessibleSVG from '../accessible-svg';
import type { Icon } from '../flowTypes';

type Props = Icon & {
    baseClassName: string,
    children: React.Node,
};

const IconFileBase = ({ children, className = '', baseClassName, height = 32, title, width = 32 }: Props) => {
    return (
        <AccessibleSVG
            className={`${baseClassName} ${className}`}
            height={height}
            title={title}
            viewBox="0 0 32 32"
            width={width}
        >
            {children}
        </AccessibleSVG>
    );
};

export default IconFileBase;
