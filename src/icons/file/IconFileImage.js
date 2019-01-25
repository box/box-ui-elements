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

const IconFileImage = ({ className = '', height = 32, title, width = 32 }: Props) => (
    <AccessibleSVG
        className={`icon-file-image ${className}`}
        title={title}
        width={width}
        height={height}
        viewBox="0 0 32 32"
    >
        <path fill="#fff" d="M25 27H7V5h13l5 5v17z" />
        <path
            d="M20 4H7a1 1 0 0 0-1 1v22a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1V9.89zm5 23H7V5h13v4a1 1 0 0 0 1 1h4z"
            fill="#3fb87f"
        />
        <path
            d="M18 17a2 2 0 1 1 2-2 2 2 0 0 1-2 2zm-.6 4.09l-3.12-3.71a.41.41 0 0 0-.58-.06l-.06.06L9 23h13l-2.72-3.6a.35.35 0 0 0-.6 0z"
            fill="#3fb87f"
        />
    </AccessibleSVG>
);

export default IconFileImage;
