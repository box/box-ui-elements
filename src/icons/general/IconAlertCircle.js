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

const IconAlertCircle = ({ className = '', color = '#FFFFFF', height = 20, title, width = 20 }: Props) => (
    <AccessibleSVG
        className={`icon-alert-circle ${className}`}
        title={title}
        width={width}
        height={height}
        viewBox="0 0 20 20"
    >
        <g transform="translate(1 1)" fill="none" fillRule="evenodd">
            <circle className="stroke-color" stroke={color} cx="9" cy="9" r="9" />
            <rect className="fill-color" fill={color} x="8" y="4" width="2" height="6" rx="1" />
            <circle className="fill-color" fill={color} cx="9" cy="13" r="1" />
        </g>
    </AccessibleSVG>
);

export default IconAlertCircle;
