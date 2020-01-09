// @flow
import * as React from 'react';

import AccessibleSVG from '../accessible-svg';

import type { Icon } from '../flowTypes';

const IconTrackPrevious = ({ className = '', color = '#999', height = 14, title, width = 14 }: Icon) => (
    <AccessibleSVG
        className={`icon-track-previous ${className}`}
        height={height}
        title={title}
        viewBox="0 0 14 14"
        width={width}
    >
        <path
            className="fill-color"
            d="M6.31 7.88l5 4.81a1 1 0 0 0 1.41 0A1 1 0 0 0 13 12V2.35a1 1 0 0 0-1-1 1 1 0 0 0-.69.28l-5 4.81a1 1 0 0 0 0 1.41zM2 1a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1 1 1 0 0 1-1-1V2a1 1 0 0 1 1-1z"
            fill={color}
        />
    </AccessibleSVG>
);

export default IconTrackPrevious;
