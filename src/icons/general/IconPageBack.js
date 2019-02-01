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

const IconPageBack = ({ className = '', color = '#000000', height = 13, title, width = 8 }: Props) => (
    <AccessibleSVG
        className={`icon-page-back ${className}`}
        height={height}
        title={title}
        viewBox="0 0 8 13"
        width={width}
    >
        <path
            className="fill-color"
            d="M.1 11.3l4.6-4.5L.1 2.2 1.5.8l6 6-6 6-1.4-1.5z"
            fill={color}
            fillRule="evenodd"
            transform="rotate(180 4 7)"
        />
    </AccessibleSVG>
);

export default IconPageBack;
