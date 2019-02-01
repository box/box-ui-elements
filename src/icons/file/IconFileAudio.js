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

const IconFileAudio = ({ className = '', height = 32, title, width = 32 }: Props) => (
    <AccessibleSVG
        className={`icon-file-audio ${className}`}
        height={height}
        title={title}
        viewBox="0 0 32 32"
        width={width}
    >
        <path d="M25 27H7V5h13l5 5v17z" fill="#fff" />
        <path
            d="M20 4H7a.94.94 0 0 0-1 1v22a.94.94 0 0 0 1 1h18a.94.94 0 0 0 1-1V9.9zm5 23H7V5h13v4a.94.94 0 0 0 1 1h4z"
            fill="#955ca5"
        />
        <path
            d="M19 20.1V17h-6v4.5a1.5 1.5 0 1 1-1.5-1.5.9.9 0 0 1 .5.1V13h8v8.5a1.5 1.5 0 1 1-1.5-1.5.9.9 0 0 1 .5.1zM13 16h6v-2h-6z"
            fill="#955ca5"
        />
    </AccessibleSVG>
);

export default IconFileAudio;
