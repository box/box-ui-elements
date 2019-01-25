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

const IconCommentsBadge = ({ className = '', color = '#777', height = 15, title, width = 14 }: Props) => (
    <AccessibleSVG
        className={`icon-comments-badge ${className}`}
        title={title}
        width={width}
        height={height}
        viewBox="0 0 14 15"
    >
        <g className="stroke-color" stroke={color} strokeWidth=".875" fill="none" fillRule="evenodd">
            <path d="M3.063 13.938l2.88-2.905h5.432c1.208 0 2.188-.98 2.188-2.187v-6.22c0-1.21-.98-2.188-2.188-2.188h-8.75c-1.208 0-2.188.98-2.188 2.187v6.22c0 1.21.98 2.188 2.188 2.188h.438v2.905z" />
            <path d="M3.938 3.97h6.124M3.938 7.5h6.124" strokeLinecap="round" strokeLinejoin="round" />
        </g>
    </AccessibleSVG>
);

export default IconCommentsBadge;
