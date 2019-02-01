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

const IconClose = ({ className = '', color = '#000000', height = 24, title, width = 24 }: Props) => (
    <AccessibleSVG
        className={`icon-close ${className}`}
        height={height}
        title={title}
        viewBox="0 0 24 24"
        width={width}
    >
        <path
            className="fill-color"
            d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
            fill={color}
        />
        <path d="M0 0h24v24H0z" fill="none" />
    </AccessibleSVG>
);

export default IconClose;
