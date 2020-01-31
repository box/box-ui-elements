// @flow
import * as React from 'react';

import AccessibleSVG from '../accessible-svg';

import type { Icon } from '../flowTypes';

const IconMetadata = ({ className = '', color = '#333', title, width = 14, height = 14 }: Icon) => (
    <AccessibleSVG
        className={`icon-metadata ${className}`}
        height={height}
        title={title}
        viewBox="0 0 14 14"
        width={width}
    >
        <path
            className="fill-color"
            d="M7 13a6 6 0 1 0-6-6 6 6 0 0 0 6 6zm0 1a7 7 0 1 1 7-7 7 7 0 0 1-7 7zM4.86 8.87l.59-2.36 1.13 1.8a.5.5 0 0 0 .85 0l1.13-1.8.59 2.36a.5.5 0 1 0 1-.24l-.87-3.5A.5.5 0 0 0 8.33 5L7 7.11 5.67 5a.5.5 0 0 0-.91.14l-.87 3.5a.5.5 0 0 0 1 .24z"
            fill={color}
        />
    </AccessibleSVG>
);

export default IconMetadata;
