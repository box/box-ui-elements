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

const IconNavigateRight = ({ className = '', height = 48, title, width = 48 }: Props) => (
    <AccessibleSVG
        className={`icon-navigate-right ${className}`}
        focusable="false"
        height={height}
        title={title}
        viewBox="0 0 48 48"
        width={width}
    >
        <path
            d="M17.2,14.8l9.2,9.2l-9.2,9.2L20,36l12-12L20,12L17.2,14.8z"
            fill="#494949"
            stroke="#DCDCDC"
            strokeMiterlimit="10"
        />
        <path d="M48,48H0L0,0l48,0V48z" display="none" fill="none" />
    </AccessibleSVG>
);

export default IconNavigateRight;
