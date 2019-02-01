// @flow
import * as React from 'react';

import AccessibleSVG from '../accessible-svg';

type Props = {
    className?: string,
    color?: string,
    height?: number,
    /** A text-only string describing the icon if it's not purely decorative for accessibility */
    title?: string | React.Element<any>,
    width?: number,
};

const IconOpenWith = ({ className = '', color = '#444444', height = 12, title, width = 12 }: Props) => (
    <AccessibleSVG
        className={`icon-open-with ${className}`}
        height={height}
        title={title}
        viewBox="0 0 12 12"
        width={width}
    >
        <path
            className="fill-color"
            d="M10 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h8m0-1H2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"
            fill={color}
        />
        <path className="fill-color" d="M3 3v1h4.29L2.65 8.65l.7.7L8 4.71V9h1V3H3z" fill={color} />
    </AccessibleSVG>
);

export default IconOpenWith;
