import * as React from 'react';

import { bdlGray50 } from '../../styles/variables';
import AccessibleSVG from '../accessible-svg';

import { Icon } from '../iconTypes';

const IconGridViewInverted = ({ className = '', color = bdlGray50, height = 16, title, width = 16 }: Icon) => (
    <AccessibleSVG
        className={`icon-grid-view-inverted ${className}`}
        height={height}
        title={title}
        viewBox="0 0 16 16"
        width={width}
    >
        <path
            d="M2.5 2h4a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.5.5h-4a.5.5 0 0 1-.5-.5v-4a.5.5 0 0 1 .5-.5zm7 0h4a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.5.5h-4a.5.5 0 0 1-.5-.5v-4a.5.5 0 0 1 .5-.5zm-7 7h4a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.5.5h-4a.5.5 0 0 1-.5-.5v-4a.5.5 0 0 1 .5-.5zm7 0h4a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.5.5h-4a.5.5 0 0 1-.5-.5v-4a.5.5 0 0 1 .5-.5z"
            fill={color}
            fillRule="nonzero"
        />
    </AccessibleSVG>
);

export default IconGridViewInverted;
