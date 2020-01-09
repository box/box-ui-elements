// @flow
import * as React from 'react';

import { bdlGray50 } from '../../styles/variables';
import AccessibleSVG from '../accessible-svg';

import type { Icon } from '../flowTypes';

const IconHide = ({ className = '', color = bdlGray50, height = 16, title, width = 16 }: Icon) => (
    <AccessibleSVG className={`icon-hide ${className}`} title={title} width={width} height={height} viewBox="0 0 16 16">
        <path
            d="M7.646 7.646L4.354 4.354a.5.5 0 0 1 0-.708l1.292-1.292a.5.5 0 0 1 .708 0l5.292 5.292a.5.5 0 0 1 0 .708l-5.292 5.292a.5.5 0 0 1-.708 0l-1.292-1.292a.5.5 0 0 1 0-.708l3.292-3.292a.5.5 0 0 0 0-.708z"
            fill={color}
            fillRule="nonzero"
        />
    </AccessibleSVG>
);

export default IconHide;
