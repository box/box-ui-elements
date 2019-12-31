// @flow
/* eslint-disable react/jsx-sort-props */
import * as React from 'react';
import * as vars from '../../styles/variables';
import AccessibleSVG from '../../icons/accessible-svg';
import type { Icon } from '../../icons/flowTypes';

const History16 = (props: Icon) => (
    <AccessibleSVG width={16} height={16} viewBox="0 0 16 16" {...props}>
        <path
            fill={vars.bdlGray}
            fillRule="evenodd"
            d="M8.5 1.5a6.5 6.5 0 11-4.146 11.505.5.5 0 01.638-.77A5.5 5.5 0 103.09 7H5l-2.5 3L0 7h2.076A6.502 6.502 0 018.5 1.5zm0 3A.5.5 0 019 5v3.5h1.732a.5.5 0 110 1h-2a.501.501 0 01-.116-.014A.5.5 0 018 9V5a.5.5 0 01.5-.5z"
        />
    </AccessibleSVG>
);

export default History16;
