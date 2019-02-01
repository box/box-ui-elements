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

const IconCollapse = ({ className = '', color = '#979797', height = 13, title, width = 13 }: Props) => (
    <AccessibleSVG
        className={`icon-collapse ${className}`}
        height={height}
        title={title}
        viewBox="0 0 13 13"
        width={width}
    >
        <path
            className="fill-color"
            d="M8 6h4a1 1 0 0 0 0-2H9V1a1 1 0 0 0-2 0v4a1 1 0 0 0 1 1zM1 9h3v3a1 1 0 0 0 2 0V8a1 1 0 0 0-1-1H1a1 1 0 0 0 0 2z"
            fill={color}
        />
    </AccessibleSVG>
);

export default IconCollapse;
