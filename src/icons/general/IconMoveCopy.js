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

const IconMoveCopy = ({ className = '', color = '#444', height = 14, title, width = 13 }: Props) => (
    <AccessibleSVG
        className={`icon-move-copy ${className}`}
        height={height}
        title={title}
        viewBox="0 0 13 14"
        width={width}
    >
        <path
            className="fill-color"
            d="M3 2.5h-.5V14h10V3c0-.6-.4-1-1-1h-9v.5H3V3h8.5v10h-8V2.5H3V3v-.5z"
            fill={color}
        />
        <path className="fill-color" d="M.5 0h1v11h-1z" fill={color} />
        <path className="fill-color" d="M.5 0h9v1h-9z" fill={color} />
        <path
            className="fill-color"
            d="M6 6h3c.3 0 .5.2.5.5S9.3 7 9 7H6c-.3 0-.5-.2-.5-.5S5.7 6 6 6zm0 3h3c.3 0 .5.2.5.5s-.2.5-.5.5H6c-.3 0-.5-.2-.5-.5S5.7 9 6 9z"
            fill={color}
        />
    </AccessibleSVG>
);

export default IconMoveCopy;
