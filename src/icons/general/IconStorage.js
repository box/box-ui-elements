// @flow
import * as React from 'react';

import AccessibleSVG from '../accessible-svg';
import { bdlGreenLight } from '../../styles/variables';

import type { Icon } from '../flowTypes';

const IconStorage = ({ className = '', color = bdlGreenLight, height = 12, title, width = 16 }: Icon) => (
    <AccessibleSVG
        className={`bdl-IconStorage ${className}`}
        height={height}
        title={title}
        viewBox="0 0 16 12"
        width={width}
    >
        <rect
            className="background-color"
            clipRule="evenodd"
            fill="#D8D8D8"
            fillOpacity="0"
            fillRule="evenodd"
            height="16"
            width="16"
            y="-2"
        />
        <path
            className="fill-color"
            d="M12,1c0-0.6,0.4-1,1-1h2c0.6,0,1,0.4,1,1v10c0,0.6-0.4,1-1,1h-2c-0.6,0-1-0.4-1-1V1z M6,3c0-0.6,0.4-1,1-1h2c0.6,0,1,0.4,1,1v8c0,0.6-0.4,1-1,1H7c-0.6,0-1-0.4-1-1V3z M0,7c0-0.6,0.4-1,1-1h2c0.6,0,1,0.4,1,1v4c0,0.6-0.4,1-1,1H1c-0.6,0-1-0.4-1-1V7z"
            fill={color}
        />
    </AccessibleSVG>
);

export default IconStorage;
