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

const IconPrintInverted = ({ className = '', color = '#444', height = 16, title, width = 16 }: Props) => (
    <AccessibleSVG
        className={`icon-print-inverted ${className}`}
        title={title}
        width={width}
        height={height}
        viewBox="0 0 16 16"
    >
        <path
            className="fill-color"
            fill={color}
            d="M3.5 6h1c.3 0 .5.2.5.5s-.2.5-.5.5h-1c-.3 0-.5-.2-.5-.5s.2-.5.5-.5zM5.5 10h5c.3 0 .5.2.5.5s-.2.5-.5.5h-5c-.3 0-.5-.2-.5-.5s.2-.5.5-.5zM5.5 12h5c.3 0 .5.2.5.5s-.2.5-.5.5h-5c-.3 0-.5-.2-.5-.5s.2-.5.5-.5z"
        />
        <path
            className="fill-color"
            fill={color}
            d="M13 4V1H3v3c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2v3h10v-3c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-1-2v2H4V2h8zM4 14V9h8v5H4zm10-4c0 .5-.4 1-1 1V8H3v3c-.6 0-1-.4-1-1V6c0-.6.4-1 1-1h10c.6 0 1 .4 1 1v4z"
        />
    </AccessibleSVG>
);

export default IconPrintInverted;
