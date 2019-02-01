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

const IconAccepted = ({ className = '', color = '#26C281', height = 16, title, width = 16 }: Props) => (
    <AccessibleSVG
        className={`icon-accepted ${className}`}
        height={height}
        title={title}
        viewBox="0 0 16 16"
        width={width}
    >
        <g fill="none" fillRule="evenodd">
            <circle cx={8} cy={8} fill={color} r={8} />
            <path
                d="M7.051 9.253L4.965 7.172 3.75 8.423l3.301 3.327 5.699-5.751-1.235-1.249-4.464 4.503z"
                fill="#FFF"
            />
        </g>
    </AccessibleSVG>
);

export default IconAccepted;
