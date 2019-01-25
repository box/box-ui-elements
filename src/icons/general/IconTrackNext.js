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

const IconTrackNext = ({ className = '', color = '#999', height = 14, title, width = 14 }: Props) => (
    <AccessibleSVG
        className={`icon-track-next ${className}`}
        title={title}
        width={width}
        height={height}
        viewBox="0 0 14 14"
    >
        <path
            className="fill-color"
            fill={color}
            d="M7.72 7.85a1 1 0 0 0 0-1.41l-5-4.81A1 1 0 0 0 2 1.35a1 1 0 0 0-1 1V12a1 1 0 0 0 .28.69 1 1 0 0 0 1.41 0l5-4.81zM13 2v10a1 1 0 0 1-1 1 1 1 0 0 1-1-1V2a1 1 0 0 1 1-1 1 1 0 0 1 1 1z"
        />
    </AccessibleSVG>
);

export default IconTrackNext;
