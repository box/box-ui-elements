// @flow
/* eslint-disable react/jsx-sort-props */
import * as React from 'react';
import AccessibleSVG from '../../icons/accessible-svg';
import type { Icon } from '../../icons/flowTypes';

const AlarmClock16 = (props: Icon) => (
    <AccessibleSVG width={16} height={16} viewBox="0 0 16 16" {...props}>
        <path
            fill="#222"
            fillRule="evenodd"
            d="M8 3a6 6 0 110 12A6 6 0 018 3zm0 1a5 5 0 100 10A5 5 0 008 4zm0 1.5a.5.5 0 01.5.5v3.5h1.732a.5.5 0 110 1h-2a.501.501 0 01-.116-.014A.5.5 0 017.5 10V6a.5.5 0 01.5-.5zm2.018-4.433l3.464 2a.5.5 0 11-.5.866l-3.464-2a.5.5 0 11.5-.866zm-3.353.183a.5.5 0 01-.183.683l-3.464 2a.5.5 0 11-.5-.866l3.464-2a.5.5 0 01.683.183z"
        />
    </AccessibleSVG>
);

export default AlarmClock16;
