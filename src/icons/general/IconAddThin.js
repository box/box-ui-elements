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

const IconAddThin = ({ className = '', color = '#222222', height = 17, title, width = 17 }: Props) => (
    <AccessibleSVG
        className={`icon-add-thin ${className}`}
        title={title}
        width={width}
        height={height}
        viewBox="0 0 17 17"
    >
        <path className="fill-color" fill={color} d="M8 0h1v17H8z" />
        <path className="fill-color" fill={color} d="M17 8v1H0V8z" />
    </AccessibleSVG>
);

export default IconAddThin;
