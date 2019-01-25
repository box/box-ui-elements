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

const IconClockPast = ({ className = '', color = '#444', height = 14, title, width = 16 }: Props) => (
    <AccessibleSVG
        className={`icon-clock-past ${className}`}
        title={title}
        width={width}
        height={height}
        viewBox="0 0 16 14"
    >
        <g transform="translate(0 1)" fill="none" fillRule="evenodd">
            <rect className="fill-color" fill={color} x="9.66" y="3" width="1" height="5" rx=".5" />
            <rect className="fill-color" fill={color} x="9.66" y="7" width="3" height="1" rx=".5" />
            <path
                d="M5.66 10.62C6.697 11.48 8.032 12 9.487 12c3.314 0 6-2.686 6-6s-2.686-6-6-6c-3.313 0-6 2.686-6 6"
                className="stroke-color"
                stroke={color}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path className="fill-color" fill={color} d="M6.317 5l-2.83 2.828L.66 5" />
        </g>
    </AccessibleSVG>
);

export default IconClockPast;
