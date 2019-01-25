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

const IconEllipsis = ({ className = '', color = '#000000', height = 20, title, width = 20 }: Props) => (
    <AccessibleSVG
        className={`icon-ellipsis ${className}`}
        title={title}
        width={width}
        height={height}
        viewBox="0 0 10 2"
    >
        <path
            className="fill-color"
            fill={color}
            fillRule="evenodd"
            d="M1 2c.6 0 1-.4 1-1s-.4-1-1-1-1 .4-1 1 .4 1 1 1zm8 0c.6 0 1-.4 1-1s-.4-1-1-1-1 .4-1
                    1 .4 1 1 1zM5 2c.6 0 1-.4 1-1s-.4-1-1-1-1 .4-1 1 .4 1 1 1z"
        />
    </AccessibleSVG>
);

export default IconEllipsis;
