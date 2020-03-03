import * as React from 'react';

import AccessibleSVG from '../accessible-svg';

import { Icon } from '../iconTypes';

const IconExpiration = ({ className = '', color = '#444444', height = 15, title, width = 14 }: Icon) => (
    <AccessibleSVG
        className={`icon-expiration ${className}`}
        height={height}
        title={title}
        viewBox="0 0 14 15"
        width={width}
    >
        <g fill="none" fillRule="evenodd" transform="translate(0 -1)">
            <circle className="stroke-color" cx="7.16" cy="9.5" r="5.5" stroke={color} />
            <rect className="fill-color" fill={color} height="5" rx=".5" width="1" x="6.66" y="6" />
            <rect className="fill-color" fill={color} height="1" rx=".5" width="3" x="6.66" y="10" />
            <rect
                className="fill-color"
                fill={color}
                height="1"
                rx=".5"
                transform="rotate(30 11.16 2.5)"
                width="5"
                x="8.66"
                y="2"
            />
            <rect
                className="fill-color"
                fill={color}
                height="1"
                rx=".5"
                transform="rotate(-30 3.16 2.5)"
                width="5"
                x=".66"
                y="2"
            />
        </g>
    </AccessibleSVG>
);

export default IconExpiration;
