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

const IconFileThreeD = ({ className = '', height = 32, title, width = 32 }: Props) => (
    <AccessibleSVG
        className={`icon-file-three-d ${className}`}
        title={title}
        width={width}
        height={height}
        viewBox="0 0 32 32"
    >
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            fill="#F79420"
            d="M24.5,27.5h-17c-0.6,0-1-0.4-1-1v-21c0-0.6,0.4-1,1-1h12l6,6v16
                C25.5,27.1,25.1,27.5,24.5,27.5z"
        />
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            fill="#FFFFFF"
            d="M24,26.5H8c-0.3,0-0.5-0.2-0.5-0.5V6c0-0.3,0.2-0.5,0.5-0.5h11.5
                l5,5V26C24.5,26.3,24.3,26.5,24,26.5z"
        />
        <path fillRule="evenodd" clipRule="evenodd" fill="#F79420" d="M19.5,4.5l6,6h-5c-0.6,0-1-0.4-1-1V4.5z" />
        <path
            fill="#F69322"
            d="M20.5,13.9L16.9,12c-0.5-0.3-1.3-0.3-1.8,0l-3.6,1.9c-0.6,0.3-1,1-1,1.6v4.9c0,0.7,0.4,1.3,1,1.6l3.6,1.9
                c0.3,0.1,0.6,0.2,0.9,0.2c0.3,0,0.6-0.1,0.9-0.2l3.6-1.9c0.6-0.3,1-1,1-1.6v-4.9C21.5,14.9,21.1,14.2,20.5,13.9z M11.9,21.2
                c-0.2-0.1-0.4-0.5-0.4-0.7v-4.9c0-0.3,0.2-0.6,0.4-0.7l3.6-1.9c0.2-0.1,0.6-0.1,0.9,0l3.6,1.9c0.1,0,0.1,0.1,0.2,0.2L16,17v6.2
                c-0.2,0-0.3,0-0.4-0.1L11.9,21.2z"
        />
    </AccessibleSVG>
);

export default IconFileThreeD;
