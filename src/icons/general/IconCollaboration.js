// @flow
import * as React from 'react';

import { BOX_BLUE } from '../../common/variables';

import AccessibleSVG from '../accessible-svg';

type Props = {
    className?: string,
    color?: string,
    height?: number,
    /** A text-only string describing the icon if it's not purely decorative for accessibility */
    title?: string | React.Element<any>,
    width?: number,
};

const IconCollaboration = ({ className = '', color = BOX_BLUE, height = 26, title, width = 27 }: Props) => (
    <AccessibleSVG
        className={`icon-collaboration ${className}`}
        title={title}
        width={width}
        height={height}
        viewBox="0 0 27 26"
    >
        <path
            className="fill-color"
            fill={color}
            d="M25.9 9.5c.3 1.1.5 2.3.5 3.5 0 7.2-5.9 13-13.2 13S0 20.2 0 13 5.9 0 13.2 0c1.5 0 3 .3 4.4.7 0 0 .9.2.7.7s-.7.3-1 .2C16 1.2 14.6 1 13.2 1 6.4 1 1 6.4 1 13s5.4 12 12.2 12 12.2-5.4 12.2-12c0-1.1-.2-2.2-.5-3.3-.1-.4-.2-.9.3-1s.7.8.7.8z"
        />
        <path
            className="fill-color"
            fill={color}
            d="M15.5 11.4c0-1.2-1-2.2-2.3-2.2s-2.3 1-2.3 2.2 1 2.2 2.3 2.2 2.3-1 2.3-2.2zm-5.6 0c0-1.8 1.5-3.2 3.3-3.2s3.3 1.5 3.3 3.2-1.5 3.2-3.3 3.2-3.3-1.4-3.3-3.2zM9 18.2c.3-.2.6-.4 1-.6 1.1-.6 2.3-.9 3.7-.9s2.6.3 3.7.9c.4.2.7.4 1 .6.2.1.3.2.3.3.2.2.5.2.7 0 .2-.2.2-.5 0-.7-.3-.3-.8-.6-1.5-1-1.2-.6-2.6-1-4.1-1s-2.9.4-4.1 1c-.7.4-1.2.8-1.5 1-.2.2-.2.5 0 .7.2.2.5.2.7 0-.2-.1-.1-.2.1-.3zM22 4V1.5c0-.3-.2-.5-.5-.5s-.5.2-.5.5V4h-2.5c-.3 0-.5.2-.5.5s.2.5.5.5H21v2.5c0 .3.2.5.5.5s.5-.2.5-.5V5h2.5c.3 0 .5-.2.5-.5s-.2-.5-.5-.5H22z"
        />
    </AccessibleSVG>
);

export default IconCollaboration;
