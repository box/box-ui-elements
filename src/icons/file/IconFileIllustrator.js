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

const IconFileIllustrator = ({ className = '', height = 32, title, width = 32 }: Props) => (
    <AccessibleSVG
        className={`icon-file-illustrator ${className}`}
        title={title}
        width={width}
        height={height}
        viewBox="0 0 32 32"
    >
        <path fill="#fff" d="M25 27H7V5h13l5 5v17z" />
        <path
            d="M20 4H7a1 1 0 0 0-1 1v22a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1V9.89zm5 23H7V5h13v4a1 1 0 0 0 1 1h4z"
            fill="#f7931d"
        />
        <path
            d="M14 14.85L12.89 18h2.25zm2.16 6l-.68-2h-2.83l-.71 2H11l2.61-7.1h.88l2.61 7.1zM18.99 13.7h.89v7.1h-.89z"
            fill="#f7931d"
        />
    </AccessibleSVG>
);

export default IconFileIllustrator;
