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

const IconRecentFiles = ({ className = '', color = '#999', height = 24, title, width = 24 }: Props) => (
    <AccessibleSVG
        className={`icon-recent-files ${className}`}
        title={title}
        width={width}
        height={height}
        viewBox="0 0 24 24"
    >
        <path className="fill-color" fill={color} d="M17 20l-3 2H5c-2 0-3-1-3-3V7l2-3v15l1 1h12z" />
        <path className="fill-color" fill={color} d="M8 0h7l1 1 4 4 1 1v10l-2 2H8l-2-2V2l2-2z" />
        <path d="M13 5v5m4 0h-4" stroke="#FFF" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </AccessibleSVG>
);

export default IconRecentFiles;
