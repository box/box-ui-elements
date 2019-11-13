// @flow
import * as React from 'react';

import AccessibleSVG from '../accessible-svg';

import type { Icon } from '../flowTypes';

const IconLink = ({ className = '', color = '#000000', height = 24, title, width = 24 }: Icon) => (
    <AccessibleSVG
        className={`icon-link ${className}`}
        height={height}
        title={title}
        viewBox="-603 389 16 16"
        width={width}
    >
        <path
            className="fill-color"
            d="M-592 396c-.2-.4-.5-.9-.8-1.2-.4-.4-.8-.6-1.2-.8-.5.5-1.1 1-1.5 1.6.5 0 1 .2 1.4.6.4.4.6.9.6 1.4 0 .3
                    0 .6-.1.8-.3.9-1.2 1.6-1.9 2.2l-1.8 1.8c-2 2-5-1.1-3-3l1.5-1.5c-.3-.8-.3-1.7-.1-2.6l-2.7 2.7c-1.6 1.6-1.6
                    4.1 0 5.7 1.6 1.6 4.2 1.6 5.7 0 1.2-1.2 2.8-2.4 3.7-3.9.7-1.1.8-2.6.2-3.8z"
            fill={color}
            fillRule="evenodd"
        />
        <path
            className="fill-color"
            d="M-588.3 390.3c-.8-.8-1.8-1.2-2.9-1.2-1 0-2.1.4-2.9 1.2-1.2 1.2-2.8 2.4-3.7 3.9-.3.4-.4.9-.5 1.4-.1.8 0
                    1.6.3 2.4.4.9 1.1 1.6 2 2 .5-.5 1.1-1 1.5-1.6-.5 0-1-.2-1.4-.6-.4-.4-.6-.9-.6-1.4 0-.3 0-.6.1-.8.3-.9 1.2-1.6
                    1.9-2.2l1.8-1.8c.8-.8 2.2-.8 3 0 .8.8.8 2.2 0 3l-1.5 1.5c.3.8.3 1.7.1 2.6l2.7-2.7c1.7-1.5 1.7-4.1.1-5.7z"
            fill={color}
            fillRule="evenodd"
        />
    </AccessibleSVG>
);

export default IconLink;
