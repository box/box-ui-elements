// @flow
/* eslint-disable react/jsx-sort-props */
import * as React from 'react';
import AccessibleSVG from '../../accessible-svg';
import type { Icon } from '../../flowTypes';

const IconFileSheets32 = (props: Icon) => (
    <AccessibleSVG width={32} height={32} viewBox="0 0 32 32" {...props}>
        <g fill="none">
            <path
                fill="#21A464"
                d="M9 3h9.586a1 1 0 01.707.293l6.415 6.414a1 1 0 01.293.707V26A3 3 0 0123 29H9a3 3 0 01-3-3V6a3 3 0 013-3z"
            />
            <path
                fill="#FFF"
                fillOpacity={0.5}
                d="M19.286 3.286l5.01 5.009 1.412 1.412a1 1 0 01.203.293H21a2 2 0 01-2-2V3.09a1 1 0 01.286.196z"
            />
            <path
                fill="#FFF"
                d="M20.499 14c.277 0 .501.228.501.51v8.98c0 .282-.23.51-.501.51H10.5a.505.505 0 01-.501-.51v-8.98c0-.282.23-.51.501-.51h10zM11 21v2h4v-2.001L11 21zm5 0v2h4v-2h-4zm4-3h-4v2h4v-2zm0-3h-4v2h4v-2zm-5 0h-4v2l4-.001V15zm-4 5l4-.001v-2L11 18v2z"
            />
        </g>
    </AccessibleSVG>
);

export default IconFileSheets32;
