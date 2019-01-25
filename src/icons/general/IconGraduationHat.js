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

const IconGraduationHat = ({ className = '', color = '#8EA6B2', height = 12, title, width = 12 }: Props) => (
    <AccessibleSVG
        className={`icon-graduation-hat ${className}`}
        title={title}
        width={width}
        height={height}
        viewBox="0 0 12 12"
    >
        <path
            className="fill-color"
            d="M2.818 6.444v1.82L6 10l3.182-1.737V6.444L6 8.181 2.818 6.444zM6 2L1 4.667l5 2.666 4.09-2.182v3.071H11V4.667L6 2z"
            fill={color}
            fillRule="nonzero"
        />
    </AccessibleSVG>
);

export default IconGraduationHat;
