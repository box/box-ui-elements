// @flow
/* eslint-disable react/jsx-sort-props */
import * as React from 'react';
import * as vars from '../../styles/variables';
import AccessibleSVG from '../../icons/accessible-svg';
import type { Icon } from '../../icons/flowTypes';

const Download16 = (props: Icon) => (
    <AccessibleSVG width={16} height={16} viewBox="0 0 16 16" {...props}>
        <path
            fill={vars.bdlGray}
            fillRule="evenodd"
            d="M14 14v1H2v-1h12zM10.996 2v4.997H14L8 13 2 6.997h3.004V2h5.992zm-.998 1H6.002v4.996h-1.59L8 11.586l3.589-3.59H9.998V3z"
        />
    </AccessibleSVG>
);

export default Download16;
