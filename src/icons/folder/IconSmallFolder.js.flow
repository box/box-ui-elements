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

const IconSmallFolder = ({ className = '', height = 9, title, width = 12 }: Props) => (
    <AccessibleSVG
        className={`icon-small-folder ${className}`}
        height={height}
        title={title}
        viewBox="0 0 12 9"
        width={width}
    >
        <path
            d="M11.1 1H6.2c-.1 0-.1 0-.2-.1L5.3.1c0-.1-.1-.1-.2-.1H.9C.4 0 0 .5 0 1v7.3c0 .4.4.7.9.7h10.3c.4 0 .8-.3.8-.7V2c0-.6-.4-1-.9-1zM11 8.1H1V4h10v4.1zM11 3H1V1.3c0-.2.1-.3.3-.3h3.5s.1 0 .2.1l.7.8c0 .1.1.1.2.1H11v1z"
            fill="#999"
            fillRule="evenodd"
        />
    </AccessibleSVG>
);

export default IconSmallFolder;
