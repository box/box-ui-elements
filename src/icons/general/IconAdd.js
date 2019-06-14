// @flow
import * as React from 'react';

import AccessibleSVG from '../accessible-svg';
import { bdlGray } from '../../styles/variables';

type Props = {
    className?: string,
    color?: string,
    height?: number,
    /** A text-only string describing the icon if it's not purely decorative for accessibility */
    title?: string | React.Element<any>,
    width?: number,
};

const IconAdd = ({ className = '', color = bdlGray, height = 32, title, width = 32 }: Props) => (
    <AccessibleSVG
        className={`bdl-IconAdd ${className}`}
        height={height}
        title={title}
        viewBox="0 0 32 32"
        width={width}
    >
        <path
            className="fill-color"
            d="M18 14h9a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-9v9a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-9H5a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1h9V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v9z"
            fill={color}
            fillRule="nonzero"
        />
    </AccessibleSVG>
);

export default IconAdd;
