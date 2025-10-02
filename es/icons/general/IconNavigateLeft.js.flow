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

const IconNavigateLeft = ({ className = '', height = 48, title, width = 48 }: Props) => (
    <AccessibleSVG
        className={`icon-navigate-left ${className}`}
        focusable="false"
        height={height}
        title={title}
        viewBox="0 0 48 48"
        width={width}
    >
        <path
            d="M30.8,33.2L21.7,24l9.2-9.2L28,12L16,24l12,12L30.8,33.2z"
            fill="#494949"
            stroke="#DCDCDC"
            strokeMiterlimit="10"
        />
        <path d="M0,0h48v48H0V0z" display="none" fill="none" />
    </AccessibleSVG>
);

export default IconNavigateLeft;
