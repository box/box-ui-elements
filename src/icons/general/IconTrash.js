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

const IconTrash = ({ className = '', color = '#979797', height = 12, title, width = 12 }: Props) => (
    <AccessibleSVG
        className={`icon-trash ${className}`}
        height={height}
        title={title}
        viewBox="0 0 12 12"
        width={width}
    >
        <g className="fill-color" fill={color}>
            <path d="M11.2 0H0l1.8 11c.1.5.6 1 1.2 1h6c.5 0 1.1-.4 1.2-1L12 0h-.8zm-2 10.9s-.1.1-.2.1H3c-.1 0-.2-.1-.2-.1L1.2 1h9.6l-1.6 9.9z" />
            <path d="M8.5 2h-5c-.3 0-.5.2-.5.5s.2.5.5.5h5c.3 0 .5-.2.5-.5S8.8 2 8.5 2z" />
        </g>
    </AccessibleSVG>
);

export default IconTrash;
