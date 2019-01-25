// @flow
import * as React from 'react';

import AccessibleSVG from '../accessible-svg';

type Props = {
    className?: string,
    height?: number,
    /** A text-only string describing the icon if it's not purely decorative for accessibility */
    title?: string | React.Element<any>,
    width?: number,
};

const IconFileSpreadsheet = ({ className = '', height = 32, title, width = 32 }: Props) => (
    <AccessibleSVG
        className={`icon-file-spreadsheet ${className}`}
        title={title}
        width={width}
        height={height}
        viewBox="0 0 32 32"
    >
        <path fill="#fff" d="M25 27H7V5h13l5 5v17z" />
        <path
            d="M20 4H7a1 1 0 0 0-1 1v22a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1V9.89zm5 23H7V5h13v4a1 1 0 0 0 1 1h4z"
            fill="#3fb87f"
        />
        <path
            d="M21 13H11a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-8a1 1 0 0 0-1-1zm-10 1h3v2h-3zm0 3h3v2h-3zm0 5v-2h3v2zm10 0h-6v-2h6zm0-3h-6v-2h6zm-6-3v-2h6v2z"
            fill="#3fb87f"
        />
    </AccessibleSVG>
);

export default IconFileSpreadsheet;
