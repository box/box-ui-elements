// @flow
/* eslint-disable react/jsx-sort-props */
import * as React from 'react';
import AccessibleSVG from '../../icons/accessible-svg';
import type { Icon } from '../../icons/flowTypes';

const Avatar16 = (props: Icon) => (
    <AccessibleSVG width={16} height={16} viewBox="0 0 16 16" {...props}>
        <path
            fill="#222"
            fillRule="evenodd"
            d="M8 9.5a6.497 6.497 0 015.63 3.251.5.5 0 01-.865.5A5.497 5.497 0 008 10.5a5.497 5.497 0 00-4.767 2.754.5.5 0 11-.866-.5A6.497 6.497 0 018 9.5zM8 2a3 3 0 110 6 3 3 0 010-6zm0 1a2 2 0 100 4 2 2 0 000-4z"
        />
    </AccessibleSVG>
);

export default Avatar16;
