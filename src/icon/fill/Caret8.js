// @flow
/* eslint-disable react/jsx-sort-props */
import * as React from 'react';
import AccessibleSVG from '../../icons/accessible-svg';
import type { Icon } from '../../icons/flowTypes';

const Caret8 = (props: Icon) => (
    <AccessibleSVG width={8} height={8} viewBox="0 0 8 8" {...props}>
        <path
            fill="#909090"
            fillRule="evenodd"
            d="M4.322 5.884l2.17-1.883.375-.326a.36.36 0 000-.56A.493.493 0 006.544 3H1.456C1.204 3 1 3.177 1 3.395c0 .105.048.206.133.28l.385.334 2.16 1.875a.506.506 0 00.644 0z"
        />
    </AccessibleSVG>
);

export default Caret8;
