// @flow
/* eslint-disable react/jsx-sort-props */
import * as React from 'react';
import AccessibleSVG from '../../icons/accessible-svg';
import type { Icon } from '../../icons/flowTypes';

const X16 = (props: Icon) => (
    <AccessibleSVG width={16} height={16} viewBox="0 0 16 16" {...props}>
        <path
            fill="#909090"
            fillRule="evenodd"
            d="M8 6.586l4.182-4.182a.5.5 0 01.707 0l.707.707a.5.5 0 010 .707L9.414 8l4.182 4.182a.5.5 0 010 .707l-.707.707a.5.5 0 01-.707 0L8 9.414l-4.182 4.182a.5.5 0 01-.707 0l-.707-.707a.5.5 0 010-.707L6.586 8 2.404 3.818a.5.5 0 010-.707l.707-.707a.5.5 0 01.707 0L8 6.586z"
        />
    </AccessibleSVG>
);

export default X16;
