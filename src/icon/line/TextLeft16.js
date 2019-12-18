// @flow
/* eslint-disable react/jsx-sort-props */
import * as React from 'react';
import AccessibleSVG from '../../icons/accessible-svg';
import type { Icon } from '../../icons/flowTypes';

const TextLeft16 = (props: Icon) => (
    <AccessibleSVG width={16} height={16} viewBox="0 0 16 16" {...props}>
        <path fill="#222" fillRule="evenodd" d="M11 12v1H2v-1h9zM8 9v1H2V9h6zm3-3v1H2V6h9zm3-3v1H2V3h12z" />
    </AccessibleSVG>
);

export default TextLeft16;
