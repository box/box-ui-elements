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

const IconApps = ({ className = '', color = '#888888', height = 14, title, width = 14 }: Props) => (
    <AccessibleSVG className={`icon-apps ${className}`} height={height} title={title} viewBox="0 0 14 14" width={width}>
        <path
            className="stroke-color"
            d="M.5.5h3v3h-3zm5 0h3v3h-3zm5 0h3v3h-3zm-10 5h3v3h-3zm5 0h3v3h-3zm5 0h3v3h-3zm-10 5h3v3h-3zm5 0h3v3h-3zm5 0h3v3h-3z"
            fill="none"
            stroke={color}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </AccessibleSVG>
);

export default IconApps;
