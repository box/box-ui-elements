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

const IconCalendar = ({ className = '', color = '#BABABA', height = 17, title, width = 16 }: Props) => (
    <AccessibleSVG
        className={`icon-calendar ${className}`}
        title={title}
        width={width}
        height={height}
        viewBox="0 0 16 17"
    >
        <g fill="none" fillRule="evenodd" transform="translate(0 1)">
            <rect className="fill-color" width={width} height={height} y="2" fill={color} rx="2" />
            <rect width="13.75" height="9" x="1.25" y="6" fill="#FFF" rx="1" />
            <path
                className="fill-color"
                fill={color}
                d="M11 7h2.5v2.5H11zM7 11h2.5v2.5H7zM3 11h2.5v2.5H3zM7 7h2.5v2.5H7zM3 7h2.5v2.5H3z"
            />
        </g>
    </AccessibleSVG>
);

export default IconCalendar;
