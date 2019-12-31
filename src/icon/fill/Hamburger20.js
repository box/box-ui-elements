// @flow
/* eslint-disable react/jsx-sort-props */
import * as React from 'react';
import * as vars from '../../styles/variables';
import AccessibleSVG from '../../icons/accessible-svg';
import type { Icon } from '../../icons/flowTypes';

const Hamburger20 = (props: Icon) => (
    <AccessibleSVG width={20} height={20} viewBox="0 0 20 20" {...props}>
        <path
            fill={vars.white}
            fillRule="evenodd"
            d="M19 15a1 1 0 010 2H1a1 1 0 010-2h18zm0-6a1 1 0 010 2H1a1 1 0 010-2h18zm0-6a1 1 0 010 2H1a1 1 0 110-2h18z"
        />
    </AccessibleSVG>
);

export default Hamburger20;
