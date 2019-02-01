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

const IconRetry = ({ className = '', color = '#ED3757', height = 16, title, width = 14 }: Props) => (
    <AccessibleSVG
        className={`icon-retry ${className}`}
        height={height}
        title={title}
        viewBox="0 0 14 16"
        width={width}
    >
        <path
            className="fill-color"
            d="M13,8a1,1,0,0,0-1,1A5,5,0,1,1,7,4V6l5-3L7,0V2a7,7,0,1,0,7,7A1,1,0,0,0,13,8Z"
            fill={color}
        />
    </AccessibleSVG>
);

export default IconRetry;
