// @flow
import * as React from 'react';

import AccessibleSVG from '../accessible-svg';

type Props = {
    className?: string,
    color?: string,
    height?: number,
    title?: string,
    width?: number,
};

const IconDrag = ({ className = '', color = '#aaa', height = 16, title, width = 16 }: Props) => (
    <AccessibleSVG className={`icon-drag ${className}`} height={height} title={title} viewBox="0 0 24 24" width={width}>
        <path className="fill-color" d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" fill={color} />
        <path d="M0 0h24v24H0z" fill="none" />
    </AccessibleSVG>
);

export default IconDrag;
