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

const IconCaretDown = ({ className = '', color = '#000', height = 6, title, width = 10 }: Props) => (
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
