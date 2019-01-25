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

const IconSharedLink = ({ className = '', color = '#444444', height = 15, title, width = 15 }: Props) => (
    <AccessibleSVG
        className={`icon-shared-link ${className}`}
        title={title}
        width={width}
        height={height}
        viewBox="0 0 15 15"
    >
        <g className="stroke-color" fill="none" fillRule="evenodd" stroke={color} transform="translate(1 1)">
            <path
                d="M7.913 10.657l-1.086 1.086c-1.562 1.562-4.097 1.56-5.656 0-1.56-1.562-1.56-4.098 0-5.657L2.257 5M5 2.256L6.086 1.17c1.562-1.562 4.098-1.56 5.657 0 1.562 1.562 1.56 4.098 0 5.657l-1.086 1.086"
                strokeLinecap="round"
            />
            <rect
                className="stroke-color"
                height="0.5"
                rx=".5"
                stroke={color}
                strokeWidth="0.5"
                transform="rotate(-45 6.342 6.808)"
                width="8"
                x="2.342"
                y="6.308"
            />
        </g>
    </AccessibleSVG>
);

export default IconSharedLink;
