// @flow
import * as React from 'react';

import AccessibleSVG from '../accessible-svg';

type Props = {
    className?: string,
    height?: number,
    /** A text-only string describing the icon if it's not purely decorative for accessibility */
    title?: string | React.Element<any>,
    width?: number,
};

const IconFilePowerpointPresentation = ({ className = '', height = 32, title, width = 32 }: Props) => (
    <AccessibleSVG
        className={`icon-file-powerpoint-presentation ${className}`}
        title={title}
        width={width}
        height={height}
        viewBox="0 0 32 32"
    >
        <path d="M25 27H7V5h13l5 5z" fill="#FFFFFF" />
        <path
            d="M20 4H7c-.6 0-1 .4-1 1v22c0 .6.4 1 1 1h18c.6 0 1-.4 1-1V9.9L20 4zm5 23H7V5h13v4c0 .6.4 1 1 1h4v17z"
            fill="#B84729"
        />
        <path d="M10 20h11v1H10zm0 2h11v1H10zm5-9c-1.7 0-3 1.3-3 3s1.3 3 3 3 3-1.3 3-3h-3v-3z" fill="#B84729" />
        <path d="M16 12v3h3c0-1.7-1.3-3-3-3z" fill="#B84729" />
    </AccessibleSVG>
);

export default IconFilePowerpointPresentation;
