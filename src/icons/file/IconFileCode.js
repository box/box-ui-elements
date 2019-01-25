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

const IconFileCode = ({ className = '', height = 32, title, width = 32 }: Props) => (
    <AccessibleSVG
        className={`icon-file-code ${className}`}
        title={title}
        width={width}
        height={height}
        viewBox="0 0 32 32"
    >
        <path fill="#fff" d="M25 27H7V5h13l5 5v17z" />
        <path
            fill="#e33d55"
            d="M20 19h1v1h-1zM20 13h-3v1h2v3h1v-4zM19 23h-2v1h3v-4h-1v3zM21 18h1v1h-1zM20 17h1v1h-1zM11 24h3v-1h-2v-3h-1v4zM10 19h1v1h-1zM10 17h1v1h-1zM9 18h1v1H9zM12 14h2v-1h-3v4h1v-3z"
        />
        <path
            d="M20 4H7a.94.94 0 0 0-1 1v22a.94.94 0 0 0 .88 1H25a.94.94 0 0 0 1-1V9.9zm5 23H7V5h13v4a.94.94 0 0 0 .88 1H25z"
            fill="#e33d55"
        />
    </AccessibleSVG>
);

export default IconFileCode;
