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

const IconMinusThin = ({ className = '', color = '#222', height = 1, title, width = 9 }: Props) => (
    <AccessibleSVG
        className={`icon-minus-thin ${className}`}
        height={height}
        title={title}
        viewBox="0 0 9 1"
        width={width}
    >
        <path className="fill-color" d="M0 0h9v1H0z" fill={color} fillRule="evenodd" />
    </AccessibleSVG>
);

export default IconMinusThin;
