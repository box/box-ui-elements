import * as React from 'react';

import { bdlYellorange, white } from '../../styles/variables';
import { TwoTonedIcon } from '../iconTypes';
import AccessibleSVG from '../accessible-svg';

const IconAnnotation = ({ className = '', height = 24, title, width = 24 }: TwoTonedIcon) => (
    <AccessibleSVG
        className={`bdl-IconAnnotation ${className}`}
        height={height}
        title={title}
        viewBox="0 0 32 32"
        width={width}
    >
        <g fillRule="nonzero" fill="none">
            <circle className="background-color" fill={bdlYellorange} cx="16.162" cy="16.162" r="16" />
            <path
                d="M8.8 14.31c0 5.272 4.8 7.19 7.2 7.19v1.798a1.088 1.088 0 0 0 1.8.838c2.16-1.917 5.4-5.512 5.4-9.826 0-2.518-2.4-6.71-7.2-6.71-4.2 0-7.2 3.595-7.2 6.71Z"
                className="foreground-color"
                fill={white}
            />
        </g>
    </AccessibleSVG>
);

export default IconAnnotation;
