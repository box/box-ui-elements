// @flow
/* eslint-disable react/jsx-sort-props */
import * as React from 'react';
import AccessibleSVG from '../../icons/accessible-svg';
import type { Icon } from '../../icons/flowTypes';

const CaretBadge16 = (props: Icon) => (
    <AccessibleSVG width={16} height={16} viewBox="0 0 16 16" {...props}>
        <path
            fill="#909090"
            fillRule="evenodd"
            d="M3.46 6.727a.572.572 0 01.81-.81L8 9.648l3.73-3.73a.572.572 0 01.81.81L8.495 10.77a.7.7 0 01-.99 0L3.46 6.727zm9.49 6.223a7 7 0 10-9.9-9.9 7 7 0 009.9 9.9z"
        />
    </AccessibleSVG>
);

export default CaretBadge16;
