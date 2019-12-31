// @flow
/* eslint-disable react/jsx-sort-props */
import * as React from 'react';
import * as vars from '../../styles/variables';
import AccessibleSVG from '../../icons/accessible-svg';
import type { Icon } from '../../icons/flowTypes';

const Filter16 = (props: Icon) => (
    <AccessibleSVG width={16} height={16} viewBox="0 0 16 16" {...props}>
        <path
            fill={vars.bdlGray50}
            fillRule="evenodd"
            d="M8.83 12a2.995 2.995 0 000-2H15a1 1 0 010 2H8.83zm-5.66 0H1a1 1 0 010-2h2.17a2.995 2.995 0 000 2zm10.66-6a2.995 2.995 0 000-2H15a1 1 0 010 2h-1.17zM8.17 6H1a1 1 0 110-2h7.17a2.995 2.995 0 000 2zM9 5a2 2 0 114 0 2 2 0 01-4 0zm-5 6a2 2 0 114 0 2 2 0 01-4 0z"
        />
    </AccessibleSVG>
);

export default Filter16;
