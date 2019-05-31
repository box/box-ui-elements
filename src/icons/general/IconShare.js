// @flow
import * as React from 'react';

import { boxBlue } from '../../styles/variables';

import AccessibleSVG from '../accessible-svg';

type Props = {
    className?: string,
    color?: string,
    height?: number,
    /** A text-only string describing the icon if it's not purely decorative for accessibility */
    title?: string | React.Element<any>,
    width?: number,
};

const IconShare = ({ className = '', color = boxBlue, height = 32, title, width = 32 }: Props) => (
    <AccessibleSVG
        className={`icon-share ${className}`}
        height={height}
        title={title}
        viewBox="0 0 32 32"
        width={width}
    >
        <g fill="none">
            <path
                className="fill-color"
                d="M10.7 16.356a3.5 3.5 0 1 0 4.949 4.95l1.413-1.413a.501.501 0 0 1 .708.706l-1.414 1.414a4.5 4.5 0 0 1-6.364-6.364l1.414-1.414a.5.5 0 0 1 .707.707L10.7 16.356zm10.606-.707a3.5 3.5 0 0 0-4.95-4.95l-1.413 1.413a.501.501 0 0 1-.71-.705h.002l1.414-1.415a4.5 4.5 0 0 1 6.364 6.364l-1.414 1.414a.5.5 0 0 1-.707-.707l1.414-1.414zm-7.778 2.121l4.242-4.242a.5.5 0 0 1 .707.707l-4.242 4.242a.5.5 0 0 1-.707-.707z"
                fill={color}
            />
            <circle className="fill-color" stroke={color} cx="16" cy="16" r="15.5" />
        </g>
    </AccessibleSVG>
);

export default IconShare;
