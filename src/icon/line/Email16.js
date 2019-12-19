// @flow
/* eslint-disable react/jsx-sort-props */
import * as React from 'react';
import AccessibleSVG from '../../icons/accessible-svg';
import type { Icon } from '../../icons/flowTypes';

const Email16 = (props: Icon) => (
    <AccessibleSVG width={16} height={16} viewBox="0 0 16 16" {...props}>
        <path
            fill="#222"
            fillRule="evenodd"
            d="M14 3H2c-.6 0-1 .4-1 1v9c0 .6.5 1 1 1h12c.6 0 1-.4 1-1V4c0-.6-.5-1-1-1zM8 8.5L2.8 4h10.5L8 8.5zm6 4.5H2V4.7l5.7 4.8.3.3.3-.3L14 4.7V13z"
        />
    </AccessibleSVG>
);

export default Email16;
