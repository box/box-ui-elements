// @flow
/* eslint-disable react/jsx-sort-props */
import * as React from 'react';
import * as vars from '../../styles/variables';
import AccessibleSVG from '../../icons/accessible-svg';
import type { Icon } from '../../icons/flowTypes';

const Retry16 = (props: Icon) => (
    <AccessibleSVG width={16} height={16} viewBox="0 0 16 16" {...props}>
        <path
            fill={vars.bdlGray}
            fillRule="evenodd"
            d="M11.978 8H10l2.5 2.5L15 8h-2.019a6.5 6.5 0 10-2.332 5.504.5.5 0 00-.639-.77A5.5 5.5 0 1111.978 8v.001z"
        />
    </AccessibleSVG>
);

export default Retry16;
