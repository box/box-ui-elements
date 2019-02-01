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

const IconDownloadSolid = ({ className = '', color = '#000000', height = 10, title, width = 10 }: Props) => (
    <AccessibleSVG
        className={`icon-download-solid ${className}`}
        height={height}
        title={title}
        viewBox="0 0 10 10"
        width={width}
    >
        <path
            className="fill-color"
            d="M9.658 4.304H7.143V.634h-3.77v3.67H.857l4.4 4.283 4.4-4.283zM.858 9.81v1.224h8.8V9.81h-8.8z"
            fill={color}
        />
    </AccessibleSVG>
);

export default IconDownloadSolid;
