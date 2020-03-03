// @flow
import * as React from 'react';

import AccessibleSVG from '../accessible-svg';

type Props = {
    className?: string,
    color?: string,
    height?: number,
    opacity?: number,
    /** A text-only string describing the icon if it's not purely decorative for accessibility */
    title?: string | React.Element<any>,
    width?: number,
};

const IconGridView = ({ className = '', color = '#444', height = 9, opacity = 1, title, width = 9 }: Props) => (
    <AccessibleSVG
        className={`icon-grid-view ${className}`}
        height={height}
        title={title}
        viewBox="0 0 9 9"
        width={width}
    >
        <path
            className="fill-color"
            d="M3 1v2H1V1h2m1-1H0v4h4V0zM8 1v2H6V1h2m1-1H5v4h4V0zM3 6v2H1V6h2m1-1H0v4h4V5zM8 6v2H6V6h2m1-1H5v4h4V5z"
            fill={color}
            fillOpacity={opacity}
        />
    </AccessibleSVG>
);

export default IconGridView;
