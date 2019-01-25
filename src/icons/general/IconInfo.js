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

const IconInfo = ({ className = '', color = '#000000', height = 24, title, width = 24 }: Props) => (
    <AccessibleSVG
        className={`icon-info ${className}`}
        title={title}
        width={width}
        height={height}
        viewBox="-603 389 16 16"
    >
        <path
            className="fill-color"
            fill={color}
            fillRule="evenodd"
            d="M-595 403c5.5 0 8-7.1 3.9-10.6-4.2-3.6-10.8.3-9.8 5.7.5 2.8 3 4.9 5.9 4.9zm.9-6.7v3.7h-1.4v-3.7h1.4zm.1-2.2c0 1-1.7 1.1-1.7 0 .1-1.1 1.7-1.1 1.7 0z"
        />
    </AccessibleSVG>
);

export default IconInfo;
