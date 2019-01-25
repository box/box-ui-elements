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

const IconInviteCollaborators = ({ className = '', color = '#444444', height = 16, title, width = 16 }: Props) => (
    <AccessibleSVG
        className={`icon-invite-collaborators ${className}`}
        title={title}
        width={width}
        height={height}
        viewBox="0 0 16 16"
    >
        <g transform="translate(1 -1)" fill="none" fillRule="evenodd">
            <circle className="stroke-color" stroke={color} cx="7" cy="9" r="7" />
            <circle className="stroke-color" stroke={color} cx="7" cy="7" r="2" />
            <path
                className="stroke-color"
                d="M3 13s1.4985-2 4-2 4 2 4 2"
                stroke={color}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <circle fill="#FFFFFF" cx="11" cy="3" r="3" />
            <path
                className="fill-color"
                d="M11.4634 3.521H12.5c.276 0 .5-.2238.5-.5 0-.276-.224-.5-.5-.5h-1.0366V1.5c0-.276-.2238-.5-.5-.5-.276 0-.5.224-.5.5v1.021H9.5c-.276 0-.5.224-.5.5 0 .2762.224.5.5.5h.9634V4.5c0 .276.224.5.5.5.2762 0 .5-.224.5-.5v-.979z"
                fill={color}
            />
        </g>
    </AccessibleSVG>
);

export default IconInviteCollaborators;
