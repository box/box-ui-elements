// @flow
import * as React from 'react';

import AccessibleSVG from '../accessible-svg';

type Props = {
    className?: string,
    color?: string,
    height?: number,
    /** A text-only string describing the icon if it's not purely decorative for accessibility */
    title?: string | React.Element<any>,
    width?: number,
};

const IconGlobe2 = ({ className = '', color = '#8EA6B2', height = 12, title, width = 12 }: Props) => (
    <AccessibleSVG
        className={`icon-zones ${className}`}
        height={height}
        title={title}
        viewBox="0 0 12 12"
        width={width}
    >
        <g id="Zones_Unselected_12x12" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
            <path
                d="M6,1 C3.24,1 1,3.24 1,6 C1,8.76 3.24,11 6,11 C8.76,11 11,8.76 11,6 C11,3.24 8.76,1 6,1 Z M5.5,9.965 C3.525,9.72 2,8.04 2,6 C2,5.69 2.04,5.395 2.105,5.105 L4.5,7.5 L4.5,8 C4.5,8.55 4.95,9 5.5,9 L5.5,9.965 Z M8.95,8.695 C8.82,8.29 8.45,8 8,8 L7.5,8 L7.5,6.5 C7.5,6.225 7.275,6 7,6 L4,6 L4,5 L5,5 C5.275,5 5.5,4.775 5.5,4.5 L5.5,3.5 L6.5,3.5 C7.05,3.5 7.5,3.05 7.5,2.5 L7.5,2.295 C8.965,2.89 10,4.325 10,6 C10,7.04 9.6,7.985 8.95,8.695 Z"
                id="Shape"
                fill={color}
                fillRule="nonzero"
            />
        </g>
    </AccessibleSVG>
);

export default IconGlobe2;
