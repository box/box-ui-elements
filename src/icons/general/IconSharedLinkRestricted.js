// @flow
import * as React from 'react';

import AccessibleSVG from '../accessible-svg';

import type { Icon } from '../flowTypes';

const IconSharedLinkRestricted = ({ className = '', color = '#444444', height = 15, title, width = 15 }: Icon) => (
    <AccessibleSVG
        className={`icon-shared-link-restricted ${className}`}
        height={height}
        title={title}
        viewBox="0 0 15 15"
        width={width}
    >
        <g className="fill-color" fill={color}>
            <path d="M8.6 11.3l-1.1 1.1c-1.4 1.4-3.6 1.4-4.9 0-1.4-1.4-1.4-3.6 0-4.9l1.1-1.1c.2-.2.2-.5 0-.7-.2-.2-.5-.2-.7 0l-1.2 1C0 8.5 0 11.3 1.8 13.1c1.8 1.8 4.6 1.8 6.4 0L9.3 12c.2-.2.2-.5 0-.7s-.5-.2-.7 0zM6.4 3.6l1.1-1.1c1.4-1.4 3.6-1.4 4.9 0 1.4 1.4 1.4 3.6 0 4.9l-1.1 1.1c-.2.2-.2.5 0 .7s.5.2.7 0l1.1-1.1c1.8-1.8 1.8-4.6 0-6.4-1.8-1.8-4.6-1.8-6.4 0L5.6 2.9c-.2.2-.2.5 0 .7.2.2.6.2.8 0z" />
        </g>
        <g className="fill-color" fill={color}>
            <path d="M14 13.2L8.3 7.5l1.9-1.9c.2-.2.2-.5 0-.7-.2-.1-.5-.1-.7.1L7.6 6.8 2 1.2c-.2-.2-.5-.2-.7 0s-.2.5 0 .7l5.6 5.6.7.7 5.7 5.7c.2.2.5.2.7 0 .2-.2.2-.5 0-.7zM4.5 9.9c-.2.2-.2.5 0 .7.2.2.5.2.7 0L6.9 9l-.7-.7-1.7 1.6z" />
        </g>
    </AccessibleSVG>
);

export default IconSharedLinkRestricted;
