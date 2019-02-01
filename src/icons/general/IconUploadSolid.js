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

const IconUploadSolid = ({ className = '', color = 'black', height = 24, title, width = 24 }: Props) => (
    <AccessibleSVG
        className={`icon-upload-solid ${className}`}
        height={height}
        title={title}
        viewBox="0 0 24 24"
        width={width}
    >
        <path className="fill-color" d="M9 16h6v-6h4l-7-7-7 7h4v6zm-4 2h14v2H5v-2z" fill={color} />
    </AccessibleSVG>
);

export default IconUploadSolid;
