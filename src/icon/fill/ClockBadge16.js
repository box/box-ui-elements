// @flow
/* eslint-disable react/jsx-sort-props */
import * as React from 'react';
import AccessibleSVG from '../../icons/accessible-svg';
import type { Icon } from '../../icons/flowTypes';

const ClockBadge16 = (props: Icon) => (
    <AccessibleSVG width={16} height={16} viewBox="0 0 16 16" {...props}>
        <path
            fill="#909090"
            fillRule="evenodd"
            d="M8 1a7 7 0 110 14A7 7 0 018 1zm-.5 2a.5.5 0 00-.5.5v5a.5.5 0 00.5.5h3a.5.5 0 100-1H7.999L8 3.5a.5.5 0 00-.41-.492z"
        />
    </AccessibleSVG>
);

export default ClockBadge16;
