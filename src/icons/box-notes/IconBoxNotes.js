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

const IconBoxNotes = ({ className = '', height = 20, title, width = 19 }: Props) => (
    <AccessibleSVG
        className={`icon-boxnotes ${className}`}
        height={height}
        title={title}
        viewBox="0 0 19 20"
        width={width}
    >
        <path d="M14.25 3H1a1 1 0 0 0 0 2h11.85z" fill="#980de0" />
        <path d="M10.68 8H1a1 1 0 0 0 0 2h8.36z" fill="#0061d5" />
        <path d="M7.15 13H1a1 1 0 0 0 0 2h5.2l.06-.33c.07-.2.07-.54.2-.67z" fill="#00c9c1" />
        <path
            d="M15 4.63a4 4 0 0 0 1 1 3.34 3.34 0 0 0 1.2.54l-6.84 10-.47.47-2.41 1.75c-.16.17-.31 0-.25-.15l.67-3a2.59 2.59 0 0 1 .31-.65zm1.82-2.81a1.57 1.57 0 0 1 2 1v.1a1.36 1.36 0 0 1 .06.29 10.23 10.23 0 0 1-.77 1.37 9.53 9.53 0 0 1-1.27-.44 2.53 2.53 0 0 1-1-1z"
            fill="#000123"
        />
    </AccessibleSVG>
);

export default IconBoxNotes;
