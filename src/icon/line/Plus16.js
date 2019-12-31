// @flow
/* eslint-disable react/jsx-sort-props */
import * as React from 'react';
import * as vars from '../../styles/variables';
import AccessibleSVG from '../../icons/accessible-svg';
import type { Icon } from '../../icons/flowTypes';

const Plus16 = (props: Icon) => (
    <AccessibleSVG width={16} height={16} viewBox="0 0 16 16" {...props}>
        <path fill={vars.bdlGray} fillRule="evenodd" d="M8.5 2v5.5H14v1H8.5V14h-1V8.5H2v-1h5.5V2z" />
    </AccessibleSVG>
);

export default Plus16;
