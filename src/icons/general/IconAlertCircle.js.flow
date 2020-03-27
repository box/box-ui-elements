// @flow
import * as React from 'react';

import AccessibleSVG from '../accessible-svg';

import type { Icon } from '../flowTypes';

const IconAlertCircle = ({ className = '', color = '#FFFFFF', height = 20, title, width = 20 }: Icon) => (
    <AccessibleSVG
        className={`icon-alert-circle ${className}`}
        height={height}
        title={title}
        viewBox="0 0 20 20"
        width={width}
    >
        <g fill="none" fillRule="evenodd" transform="translate(1 1)">
            <circle className="stroke-color" cx="9" cy="9" r="9" stroke={color} />
            <rect className="fill-color" fill={color} height="6" rx="1" width="2" x="8" y="4" />
            <circle className="fill-color" cx="9" cy="13" fill={color} r="1" />
        </g>
    </AccessibleSVG>
);

export default IconAlertCircle;
