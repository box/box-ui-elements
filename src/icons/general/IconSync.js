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

const IconSync = ({ className = '', color = '#979797', height = 16, title, width = 16 }: Props) => (
    <AccessibleSVG className={`icon-sync ${className}`} height={height} title={title} viewBox="0 0 16 16" width={width}>
        <g className="stroke-color" fill="none" fillRule="evenodd" stroke={color} transform="translate(1 1)">
            <circle cx="7" cy="7" r="7" />
            <path d="M4 7.054l2.58 2.69L10.938 5" strokeLinecap="round" strokeLinejoin="round" />
        </g>
    </AccessibleSVG>
);

export default IconSync;
