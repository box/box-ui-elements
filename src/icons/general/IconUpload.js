// @flow
import * as React from 'react';

import AccessibleSVG from '../accessible-svg';

type Props = {
    className?: string,
    color?: string,
    height?: number,
    /** A text-only string describing the icon if it's not purely decorative for accessibility */
    title?: string | React.Element<any>,
    width?: number,
};

const IconUpload = ({ className = '', color = '#444444', height = 14, title, width = 12 }: Props) => (
    <AccessibleSVG
        className={`icon-upload ${className}`}
        height={height}
        title={title}
        viewBox="0 0 12 14"
        width={width}
    >
        <path className="stroke-color" d="M3.5 10.4h5v-5h2.3L6 .6 1.2 5.4h2.3v5z" fill="none" stroke={color} />
        <path className="stroke-color" d="M12 13.5H0" fill="none" stroke={color} />
    </AccessibleSVG>
);

export default IconUpload;
