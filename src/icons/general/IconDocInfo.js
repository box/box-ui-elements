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

const IconDocInfo = ({ className = '', color = '#999', height = 24, title, width = 24 }: Props) => (
    <AccessibleSVG
        className={`icon-doc-info ${className}`}
        title={title}
        width={width}
        height={height}
        viewBox="0 0 24 24"
    >
        <path
            className="fill-color"
            fill={color}
            d="M19.41 7.41l-4.82-4.82A2 2 0 0 0 13.17 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8.83a2 2 0 0 0-.59-1.42zM13 16a1 1 0 0 1-2 0v-4a1 1 0 0 1 2 0zm-1-6a1 1 0 1 1 1-1 1 1 0 0 1-1 1z"
        />
    </AccessibleSVG>
);

export default IconDocInfo;
