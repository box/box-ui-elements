// @flow
import * as React from 'react';

import AccessibleSVG from '../accessible-svg';

import type { Icon } from '../flowTypes';

const IconFlagSolid = ({ className = '', color = '#979797', height = 18, title, width = 18 }: Icon) => (
    <AccessibleSVG
        className={`icon-flag-solid ${className}`}
        height={height}
        title={title}
        viewBox="0 0 18 18"
        width={width}
    >
        <path
            className="fill-color"
            d="M4 1C5.33.33 6.67 0 8 0c2 0 4 2 6 2 1.33 0 2.67-.33 4-1v10c-1.33.67-2.67 1-4 1-2 0-4-2-6-2-1.33 0-2.67.33-4 1V1zM1 0h1a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V1a1 1 0 0 1 1-1z"
            fill={color}
            fillRule="nonzero"
        />
    </AccessibleSVG>
);

export default IconFlagSolid;
