// @flow
import * as React from 'react';

import AccessibleSVG from '../accessible-svg';

import type { Icon } from '../flowTypes';

const IconClock = ({ className = '', color = '#979797', height = 16, title, width = 16 }: Icon) => (
    <AccessibleSVG
        className={`icon-clock ${className}`}
        height={height}
        title={title}
        viewBox="0 0 15 15"
        width={width}
    >
        <g className="fill-color" fill={color}>
            <path d="M7.5 1C3.9 1 1 3.9 1 7.5S3.9 14 7.5 14 14 11.1 14 7.5 11.1 1 7.5 1zm0 12C4.5 13 2 10.5 2 7.5S4.5 2 7.5 2 13 4.5 13 7.5 10.5 13 7.5 13z" />
            <path d="M10.5 8H8V3.5c0-.3-.2-.5-.5-.5s-.5.2-.5.5V9h3.5c.3 0 .5-.2.5-.5s-.2-.5-.5-.5z" />
        </g>
    </AccessibleSVG>
);

export default IconClock;
