// @flow
/* eslint-disable react/jsx-sort-props */
import * as React from 'react';
import AccessibleSVG from '../../icons/accessible-svg';
import type { Icon } from '../../icons/flowTypes';

const ArrowBoxRight16 = (props: Icon) => (
    <AccessibleSVG width={16} height={16} viewBox="0 0 16 16" {...props}>
        <path
            fill="#222"
            fillRule="evenodd"
            d="M12 2a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V4a2 2 0 012-2zm0 1H4a1 1 0 00-1 1v8a1 1 0 001 1h8a1 1 0 001-1V4a1 1 0 00-1-1zm-1 2v6h-1V6.71l-4.65 4.64-.7-.7L9.29 6H5V5h6z"
        />
    </AccessibleSVG>
);

export default ArrowBoxRight16;
