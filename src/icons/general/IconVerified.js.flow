// @flow
import * as React from 'react';
import { bdlGreenLight } from '../../styles/variables';

import AccessibleSVG from '../accessible-svg';

type Props = {
    className?: string,
    color?: string,
    height?: number,
    opacity?: number,
    /** A text-only string describing the icon if it's not purely decorative for accessibility */
    title?: string | React.Element<any>,
    width?: number,
};

const IconVerified = ({
    className = '',
    color = bdlGreenLight,
    height = 14,
    opacity = 1,
    title,
    width = 14,
}: Props) => (
    <AccessibleSVG
        className={`icon-verified ${className}`}
        height={height}
        opacity={opacity}
        title={title}
        viewBox="0 0 14 14"
        width={width}
    >
        <path
            d="M7 14c-3.865993 0-7-3.134007-7-7s3.134007-7 7-7 7 3.134007 7 7-3.134007 7-7 7zM5.31288 9.303048l1.44555 1.21296 4.499514-5.36231-1.44555-1.21296-4.499514 5.36231zM3 7.36231L5.31288 9.30305l1.21296-1.44555L4.21296 5.91676 3 7.36231z"
            fill={color}
            fillRule="evenodd"
        />
    </AccessibleSVG>
);

export default IconVerified;
