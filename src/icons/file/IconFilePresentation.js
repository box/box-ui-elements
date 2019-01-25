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

const IconFilePresentation = ({ className = '', height = 32, title, width = 32 }: Props) => (
    <AccessibleSVG
        className={`icon-file-presentation ${className}`}
        title={title}
        width={width}
        height={height}
        viewBox="0 0 32 32"
    >
        <path fill="#fff" d="M25 27H7V5h13l5 5v17z" />
        <path
            d="M20 4H7a1 1 0 0 0-1 1v22a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1V9.89zm5 23H7V5h13v4a1 1 0 0 0 1 1h4z"
            fill="#f7931d"
        />
        <path
            fill="#f7931d"
            d="M10.35 22.41l-.7-.71 4.88-4.86 2.49 2.47 4.63-4.61.7.71-5.33 5.32-2.49-2.48-4.18 4.16z"
        />
    </AccessibleSVG>
);

export default IconFilePresentation;
