// @flow
import * as React from 'react';

import AccessibleSVG from '../accessible-svg';
import { bdlBoxBlue } from '../../styles/variables';

import type { Icon } from '../flowTypes';

const UploadEmptyState = ({ className = '', color = bdlBoxBlue, height = 55, title, width = 46 }: Icon) => (
    <AccessibleSVG
        className={`upload-empty-state ${className}`}
        height={height}
        title={title}
        viewBox="0 0 46 55"
        width={width}
    >
        <path
            d="M1,52V3A2,2,0,0,1,3,1H30.91a2,2,0,0,1,1.41.59L44.41,13.68A2,2,0,0,1,45,15.09V52a2,2,0,0,1-2,2H3A2,2,0,0,1,1,52Z"
            fill="#fff"
        />
        <path
            className="fill-color"
            d="M45.12,13,33,.88A3,3,0,0,0,30.91,0H3A3,3,0,0,0,0,3V52a3,3,0,0,0,3,3H43a3,3,0,0,0,3-3V15.09A3,3,0,0,0,45.12,13ZM43,53H3a1,1,0,0,1-1-1V3A1,1,0,0,1,3,2H30V13a3,3,0,0,0,3,3H44V52A1,1,0,0,1,43,53Z"
            fill={color}
        />
        <path
            className="fill-color"
            d="M21,29v4a1,1,0,0,0,.91,1h2.18A1,1,0,0,0,25,33V29h2.74a1,1,0,0,0,.76-1.65l-4.83-5.62a1,1,0,0,0-1.41-.11l-.11.11-4.82,5.62A1,1,0,0,0,18.09,29Z"
            fill={color}
        />
        <polyline
            className="stroke-color"
            fill="none"
            points="13 36 13 39 33 39 33 36"
            stroke={color}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
        />
    </AccessibleSVG>
);

export default UploadEmptyState;
