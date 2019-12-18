// @flow
/* eslint-disable react/jsx-sort-props */
import * as React from 'react';
import AccessibleSVG from '../../icons/accessible-svg';
import type { Icon } from '../../icons/flowTypes';

const Pencil16 = (props: Icon) => (
    <AccessibleSVG width={16} height={16} viewBox="0 0 16 16" {...props}>
        <path
            fill="#222"
            fillRule="evenodd"
            d="M3.829 9.096l7.392-7.392a.997.997 0 011.418.01l1.4 1.4c.395.395.397 1.032.01 1.419l-7.392 7.392L3.83 9.096zm1.414 0l1.414 1.414 6.685-6.684c-.005.004-.005 0-.01-.004l-1.4-1.401c-.005-.005-.006-.007-.006-.008L5.243 9.096zM2.925 10l2.829 2.828-3.398 1.184c-.52.18-.791-.105-.614-.614L2.925 10zm3.904 3h7v1h-7v-1z"
        />
    </AccessibleSVG>
);

export default Pencil16;
