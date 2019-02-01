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

const IconAlert = ({ className = '', color = '#000000', height = 24, title, width = 24 }: Props) => (
    <AccessibleSVG
        className={`icon-alert ${className}`}
        height={height}
        title={title}
        viewBox="0 0 24 24"
        width={width}
    >
        <path
            className="fill-color"
            d="M13,14H11V10H13M13,18H11V16H13M1,21H23L12,2L1,21Z"
            fill={color}
            fillRule="evenodd"
        />
    </AccessibleSVG>
);

export default IconAlert;
