// @flow
import * as React from 'react';

import AccessibleSVG from '../accessible-svg';

import type { Icon } from '../flowTypes';

const IconInfoThin = ({ className = '', color = '#FFFFFF', height = 20, title, width = 20 }: Icon) => (
    <AccessibleSVG
        className={`icon-info-thin ${className}`}
        height={height}
        title={title}
        viewBox="0 0 20 20"
        width={width}
    >
        <g fill="none" fillRule="evenodd" transform="translate(1 1)">
            <circle className="stroke-color" cx="9" cy="9" r="9" stroke={color} />
            <rect className="fill-color" fill={color} height="6" rx="1" width="2" x="8" y="8" />
            <circle className="fill-color" cx="9" cy="5" fill={color} r="1" />
        </g>
    </AccessibleSVG>
);

export default IconInfoThin;
