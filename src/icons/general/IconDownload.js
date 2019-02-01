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

const IconDownload = ({ className = '', color = '#444', height = 14, title, width = 12 }: Props) => (
    <AccessibleSVG
        className={`icon-download ${className}`}
        height={height}
        title={title}
        viewBox="0 0 12 14"
        width={width}
    >
        <path className="stroke-color" d="M8.5.8h-5v5H1.2L6 10.6l4.8-4.8H8.5v-5z" fill="none" stroke={color} />
        <path className="stroke-color" d="M0 13.3h12" fill="none" stroke={color} />
    </AccessibleSVG>
);

export default IconDownload;
