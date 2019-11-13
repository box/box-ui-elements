// @flow
import * as React from 'react';

import AccessibleSVG from '../accessible-svg';

import type { Icon } from '../flowTypes';

const IconExpirationBadge = ({ className = '', color = '#494949', height = 14, title, width = 14 }: Icon) => (
    <AccessibleSVG
        className={`icon-expiration-badge ${className}`}
        height={height}
        title={title}
        viewBox="0 0 16 16"
        width={width}
    >
        <circle className="fill-color" cx="8" cy="8" fill={color} r="8" />
        <path
            d="M8,1.5C4.4,1.5,1.5,4.4,1.5,8s2.9,6.5,6.5,6.5s6.5-2.9,6.5-6.5S11.6,1.5,8,1.5z M8,13.5C5,13.5,2.5,11,2.5,8 C2.5,5,5,2.5,8,2.5S13.5,5,13.5,8C13.5,11,11,13.5,8,13.5z"
            fill="#FFFFFF"
        />
        <polygon fill="#FFFFFF" points="8.5,8.2 8.5,3.5 7.5,3.5 7.5,8.5 9.7,11.3 10.5,10.7 " />
    </AccessibleSVG>
);

export default IconExpirationBadge;
