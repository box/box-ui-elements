// @flow
/* eslint-disable react/jsx-sort-props */
import * as React from 'react';
import AccessibleSVG from '../../icons/accessible-svg';
import type { Icon } from '../../icons/flowTypes';

const Checkmark16 = (props: Icon) => (
    <AccessibleSVG width={16} height={16} viewBox="0 0 16 16" {...props}>
        <path
            fill="#222"
            fillRule="evenodd"
            d="M3.727 7.792L2.273 9.165l4.05 4.285 8.399-8.758-1.444-1.384-6.944 7.242z"
        />
    </AccessibleSVG>
);

export default Checkmark16;
