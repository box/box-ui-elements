// @flow
import * as React from 'react';

import AccessibleSVG from '../accessible-svg';

import type { Icon } from '../flowTypes';

const IconCollaborators = ({ className = '', color = '#979797', height = 16, title, width = 16 }: Icon) => (
    <AccessibleSVG
        className={`icon-collaborators ${className}`}
        height={height}
        title={title}
        viewBox="0 0 16 16"
        width={width}
    >
        <g className="stroke-color" fill="none" fillRule="evenodd" stroke={color} transform="translate(1 1)">
            <circle cx="7" cy="7" r="7" />
            <circle cx="7" cy="5" r="2" />
            <path d="M7 12c2.182-.07 3.964-1.572 4-2 .064-.758-2.895-.993-4-.993S3 9.237 3 10c0 .255 1.818 2.07 4 2z" />
        </g>
    </AccessibleSVG>
);

export default IconCollaborators;
