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

const ExpirationBadge = ({ className = '', height = 16, title, width = 16 }: Props) => (
    <AccessibleSVG
        className={`expiration-badge ${className}`}
        height={height}
        title={title}
        viewBox="0 0 16 16"
        width={width}
    >
        <g fill="#ED3757" fillRule="evenodd">
            <path d="M15 8c0-3.866-3.134-7-7-7S1 4.134 1 8s3.134 7 7 7 7-3.134 7-7zM0 8c0-4.418 3.582-8 8-8s8 3.582 8 8-3.582 8-8 8-8-3.582-8-8z" />
            <path d="M7.5 9.57c0 .276.224.5.5.5s.5-.224.5-.5V3c0-.276-.224-.5-.5-.5s-.5.224-.5.5v6.57z" />
            <path d="M11.66 7.478c.263-.08.412-.36.33-.624-.08-.264-.36-.413-.623-.332L5.854 8.207c-.264.08-.413.36-.332.624.08.266.36.414.624.333l5.513-1.685zM4 8.5c.276 0 .5-.224.5-.5s-.224-.5-.5-.5H3c-.276 0-.5.224-.5.5s.224.5.5.5h1zM8.5 12c0-.276-.224-.5-.5-.5s-.5.224-.5.5v.874c0 .276.224.5.5.5s.5-.224.5-.5V12z" />
        </g>
    </AccessibleSVG>
);

export default ExpirationBadge;
