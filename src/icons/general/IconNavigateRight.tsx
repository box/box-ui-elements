import * as React from 'react';

import AccessibleSVG from '../accessible-svg';

import { TwoTonedIcon } from '../iconTypes';

const IconNavigateRight = ({ className = '', height = 48, title, width = 48 }: TwoTonedIcon) => (
    <AccessibleSVG
        className={`icon-navigate-right ${className}`}
        focusable="false"
        height={height}
        title={title}
        viewBox="0 0 48 48"
        width={width}
    >
        <path
            d="M17.2,14.8l9.2,9.2l-9.2,9.2L20,36l12-12L20,12L17.2,14.8z"
            fill="#494949"
            stroke="#DCDCDC"
            strokeMiterlimit="10"
        />
        <path d="M48,48H0L0,0l48,0V48z" display="none" fill="none" />
    </AccessibleSVG>
);

export default IconNavigateRight;
