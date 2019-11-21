// @flow
import * as React from 'react';

import AccessibleSVG from '../accessible-svg';
import { bdlGray80 } from '../../styles/variables';

import type { Icon } from '../flowTypes';

const IconCaretRound = ({ className = '', color = bdlGray80, height = 16, title, width = 16 }: Icon) => (
    <AccessibleSVG
        className={`bdl-IconCaretRound ${className}`}
        height={height}
        title={title}
        viewBox="0 0 16 16"
        width={width}
    >
        <path
            className="fill-color"
            d="M3.46 6.727a.572.572 0 0 1 .81-.81L8 9.648l3.73-3.73a.572.572 0 0 1 .81.81L8.495 10.77a.7.7 0 0 1-.99 0L3.46 6.727zm9.49 6.223a7 7 0 1 0-9.9-9.9 7 7 0 0 0 9.9 9.9z"
            fill={color}
            fillRule="evenodd"
        />
    </AccessibleSVG>
);

export default IconCaretRound;
