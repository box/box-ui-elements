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

const IconBilling = ({ className = '', color = '#888888', height = 10, title, width = 14 }: Props) => (
    <AccessibleSVG
        className={`icon-billing ${className}`}
        title={title}
        width={width}
        height={height}
        viewBox="0 0 14 10"
    >
        <g className="stroke-color" fill="none" fillRule="evenodd" stroke={color}>
            <rect width="13" height="9" x=".5" y=".5" rx="1" />
            <path d="M7.5 7.5h-5m8 0h-1" strokeLinecap="round" strokeLinejoin="round" />
            <path strokeWidth="2" d="M1.5 3h11" strokeLinecap="square" />
        </g>
    </AccessibleSVG>
);

export default IconBilling;
