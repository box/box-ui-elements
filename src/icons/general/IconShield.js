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

const IconShield = ({ className = '', color = '#888888', height = 14, title, width = 12 }: Props) => (
    <AccessibleSVG
        className={`icon-governance ${className}`}
        height={height}
        title={title}
        viewBox="0 0 12 14"
        width={width}
    >
        <g
            className="stroke-color"
            fill="none"
            fillRule="evenodd"
            stroke={color}
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M.5 1.5S3.25 3.08 6 .5c2.75 2.58 5.5 1 5.5 1v8.88L6 13.5.5 10.37V1.5zM9.5 4.5v4" />
        </g>
    </AccessibleSVG>
);

export default IconShield;
