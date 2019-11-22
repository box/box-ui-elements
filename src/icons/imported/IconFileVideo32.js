// @flow
/* eslint-disable react/jsx-sort-props */
import * as React from 'react';
import AccessibleSVG from '../accessible-svg';
import type { Icon } from '../flowTypes';

const IconFileVideo32 = (props: Icon) => (
    <AccessibleSVG width={32} height={32} viewBox="0 0 32 32" {...props}>
        <g fill="none" fillRule="evenodd">
            <path
                fill="#009AED"
                fillRule="nonzero"
                d="M9 3h9.586a1 1 0 01.707.293l6.415 6.414a1 1 0 01.293.707V26A3 3 0 0123 29H9a3 3 0 01-3-3V6a3 3 0 013-3z"
            />
            <path
                fill="#FFF"
                fillOpacity={0.5}
                fillRule="nonzero"
                d="M19.286 3.286l5.01 5.009 1.412 1.412a1 1 0 01.203.293H21a2 2 0 01-2-2V3.09a1 1 0 01.286.196z"
            />
            <path
                fill="#FFF"
                d="M19.723 18.973l-5.914 3.957a.543.543 0 01-.809-.473v-7.914a.543.543 0 01.809-.473l5.914 3.957a.543.543 0 010 .946z"
            />
        </g>
    </AccessibleSVG>
);

export default IconFileVideo32;
