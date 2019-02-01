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

const IconLeftArrow = ({ className = '', color = '#888888', height = 14, title, width = 12 }: Props) => (
    <AccessibleSVG
        className={`icon-governance ${className}`}
        height={height}
        title={title}
        viewBox="0 0 12 14"
        width={width}
    >
        <path
            className="stroke-color"
            d="M9.5 4.5h-9m4-4l-4 4m4 4l-4-4"
            fill="none"
            stroke={color}
            strokeLinecap="round"
        />
    </AccessibleSVG>
);

export default IconLeftArrow;
