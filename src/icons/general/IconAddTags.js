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

const IconAddTags = ({ className = '', height = 15, color = '#444', title, width = 15 }: Props) => (
    <AccessibleSVG
        className={`icon-add-tags ${className}`}
        height={height}
        title={title}
        viewBox="0 0 14.52 14.38"
        width={width}
    >
        <path
            className="fill-color"
            d="M.52 9.61a1.91 1.91 0 0 1 0-2.71L7.15.34A1.2 1.2 0 0 1 8 0l4.5.06a1.94 1.94 0 0 1 1.91 1.9l.05 4.45a1.18 1.18 0 0 1-.35.85l-6.59 6.55a2 2 0 0 1-2.73 0L.52 9.62zm12.73-8.38a1.07 1.07 0 0 0-.74-.31L8.01.86a.32.32 0 0 0-.23.09l-6.6 6.6a1 1 0 0 0 0 1.48l4.24 4.19a1.07 1.07 0 0 0 1.5 0l6.6-6.59a.3.3 0 0 0 .09-.22l-.05-4.45a1 1 0 0 0-.27-.72z"
            fill={color}
        />
        <circle className="fill-color" cx="11.01" cy="3.47" fill={color} r=".87" />
    </AccessibleSVG>
);

export default IconAddTags;
