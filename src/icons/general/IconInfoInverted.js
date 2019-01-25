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

const IconInfoInverted = ({ className = '', color = '#000000', height = 18, title, width = 18 }: Props) => (
    <AccessibleSVG
        className={`icon-info-inverted ${className}`}
        title={title}
        width={width}
        height={height}
        viewBox="0 0 18 18"
    >
        <path
            className="fill-color"
            fill={color}
            fillRule="evenodd"
            d="M8.1 13.5h1.8V8.1H8.1v5.4zM9 0C4.05 0 0 4.05 0 9s4.05 9 9 9 9-4.05 9-9-4.05-9-9-9zm0 16.2c-3.96 0-7.2-3.24-7.2-7.2S5.04 1.8 9 1.8s7.2 3.24 7.2 7.2-3.24 7.2-7.2 7.2zm-.9-9.9h1.8V4.5H8.1v1.8z"
        />
    </AccessibleSVG>
);

export default IconInfoInverted;
