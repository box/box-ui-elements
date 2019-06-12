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

const IconAdd = ({ className = '', color = '#222', height = 16, title, width = 16 }: Props) => (
    <AccessibleSVG
        className={`bdl-IconAdd ${className}`}
        height={height}
        title={title}
        viewBox="0 0 16 16"
        width={width}
    >
        <path
            className="fill-color"
            d="M9 7h4.5a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5H9v4.5a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5V9H2.5a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5H7V2.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5V7z"
            fill={color}
            fillRule="nonzero"
        />
    </AccessibleSVG>
);

export default IconAdd;
