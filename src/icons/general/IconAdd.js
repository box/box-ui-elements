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

const IconAdd = ({ className = '', color = '#000000', height = 24, title, width = 24 }: Props) => (
    <AccessibleSVG
        className={`icon-add ${className}`}
        height={height}
        title={title}
        viewBox="-603 389 16 16"
        width={width}
    >
        <path
            className="fill-color"
            d="M-593 395.5v-4c0-.8-.7-1.5-1.5-1.5s-1.5.7-1.5 1.5v4h-4c-.8 0-1.5.7-1.5 1.5s.7
                    1.5 1.5 1.5h4v4c0 .8.7 1.5 1.5 1.5s1.5-.7 1.5-1.5v-4h4c.8 0 1.5-.7 1.5-1.5s-.7-1.5-1.5-1.5h-4z"
            fill={color}
            fillRule="evenodd"
        />
    </AccessibleSVG>
);

export default IconAdd;
