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

const IconExpiration = ({ className = '', color = '#444444', height = 15, title, width = 14 }: Props) => (
    <AccessibleSVG
        className={`icon-expiration ${className}`}
        title={title}
        width={width}
        height={height}
        viewBox="0 0 14 15"
    >
        <g transform="translate(0 -1)" fill="none" fillRule="evenodd">
            <circle stroke={color} className="stroke-color" cx="7.16" cy="9.5" r="5.5" />
            <rect fill={color} className="fill-color" x="6.66" y="6" width="1" height="5" rx=".5" />
            <rect fill={color} className="fill-color" x="6.66" y="10" width="3" height="1" rx=".5" />
            <rect
                fill={color}
                className="fill-color"
                transform="rotate(30 11.16 2.5)"
                x="8.66"
                y="2"
                width="5"
                height="1"
                rx=".5"
            />
            <rect
                fill={color}
                className="fill-color"
                transform="rotate(-30 3.16 2.5)"
                x=".66"
                y="2"
                width="5"
                height="1"
                rx=".5"
            />
        </g>
    </AccessibleSVG>
);

export default IconExpiration;
