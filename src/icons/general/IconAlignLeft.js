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

const IconAlignLeft = ({ className = '', color = '#444', height = 10, title, width = 13 }: Props) => (
    <AccessibleSVG
        className={`icon-align-left ${className}`}
        height={height}
        title={title}
        viewBox="0 0 13 10"
        width={width}
    >
        <path
            className="stroke-color"
            d="M.3.5h11.9M.3 3.5h9.3m-9.3 6h9.3m-9.3-3H5"
            fill="none"
            stroke={color}
            strokeMiterlimit={10}
        />
    </AccessibleSVG>
);

export default IconAlignLeft;
