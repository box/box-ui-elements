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

const BookmarkIcon = ({ className = '', height = 32, title, width = 32 }: Props) => (
    <AccessibleSVG
        className={`icon-bookmark ${className}`}
        height={height}
        title={title}
        viewBox="0 0 32 32"
        width={width}
    >
        <path
            clipRule="evenodd"
            d="M24.5 27.5h-17c-.6 0-1-.4-1-1v-21c0-.6.4-1 1-1h17c.6 0 1 .4 1 1v21c0 .6-.4 1-1 1z"
            fill="#75818C"
            fillRule="evenodd"
        />
        <path
            clipRule="evenodd"
            d="M24.5 9.5V26c0 .3-.2.5-.5.5H8c-.3 0-.5-.2-.5-.5V9.5h17zM7.5 6.5h1v1h-1zM9.5 6.5h1v1h-1zM11.5 6.5h1v1h-1z"
            fill="#FFF"
            fillRule="evenodd"
        />
        <path
            d="M16.4 21.9c-1.1 1.1-3.1 1.1-4.2 0-.6-.6-.9-1.3-.9-2.1s.3-1.6.9-2.1l1.4-1.4-.7-.7-1.4 1.4c-.8.8-1.2 1.8-1.2 2.8 0 1.1.4 2.1 1.2 2.8.8.8 1.8 1.2 2.8 1.2 1.1 0 2.1-.4 2.8-1.2l1.4-1.4-.7-.7-1.4 1.4zM20.6 13.4c-1.6-1.6-4.1-1.6-5.7 0l-1.4 1.4.7.7 1.4-1.4c.6-.6 1.4-.9 2.1-.9.8 0 1.5.3 2.1.9 1.2 1.2 1.2 3.1 0 4.2l-1.4 1.4.7.7 1.4-1.4c1.7-1.5 1.7-4 .1-5.6z"
            fill="#75818C"
        />
        <path d="M17.06 16.232l.708.707-2.83 2.828-.706-.708z" fill="#75818C" />
    </AccessibleSVG>
);

export default BookmarkIcon;
