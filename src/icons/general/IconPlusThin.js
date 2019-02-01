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

const IconPlusThin = ({ className = '', color = '#222', height = 9, title, width = 9 }: Props) => (
    <AccessibleSVG
        className={`icon-plus-thin ${className}`}
        height={height}
        title={title}
        viewBox="0 0 9 9"
        width={width}
    >
        <path className="fill-color" d="M5 4V0H4v4H0v1h4v4h1V5h4V4H5z" fill={color} fillRule="evenodd" />
    </AccessibleSVG>
);

export default IconPlusThin;
