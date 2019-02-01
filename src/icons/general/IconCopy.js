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

const IconCopy = ({ className = '', color = '#999', height = 14, title, width = 14 }: Props) => (
    <AccessibleSVG className={`icon-copy ${className}`} height={height} title={title} viewBox="0 0 14 14" width={width}>
        <path
            className="fill-color"
            d="M1 11a1 1 0 0 1-1-1V1a1 1 0 0 1 1-1h9a1 1 0 0 1 0 2H2v8a1 1 0 0 1-1 1z"
            fill={color}
        />
        <path
            className="fill-color"
            d="M13 3H3v10a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1zm-3 8H7a1 1 0 0 1 0-2h3a1 1 0 0 1 0 2zm0-3H7a1 1 0 0 1 0-2h3a1 1 0 0 1 0 2z"
            fill={color}
        />
    </AccessibleSVG>
);

export default IconCopy;
