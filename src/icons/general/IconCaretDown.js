// @flow
import * as React from 'react';

import AccessibleSVG from '../accessible-svg';

import type { Icon } from '../flowTypes';

const IconCaretDown = ({ className = '', color = '#000', height = 6, title, width = 10 }: Icon) => (
    <AccessibleSVG
        className={`icon-caret-down ${className}`}
        height={height}
        title={title}
        viewBox="0 0 10 6"
        width={width}
    >
        <path className="fill-color" d="M0 .5l5 5 5-5H0z" fill={color} fillRule="evenodd" />
    </AccessibleSVG>
);

export default IconCaretDown;
