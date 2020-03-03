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

const IconListView = ({ className = '', color = '#222', height = 9, opacity = 1, title, width = 9 }: Props) => (
    <AccessibleSVG
        className={`icon-list-view ${className}`}
        height={height}
        title={title}
        viewBox="0 0 9 9"
        width={width}
    >
        <path
            className="fill-color"
            d="M0 5h9V4H0v1zm0 4h9V8H0v1zm0-9v1h9V0H0z"
            fill={color}
            fillOpacity={opacity}
            fillRule="evenodd"
        />
    </AccessibleSVG>
);

export default IconListView;
