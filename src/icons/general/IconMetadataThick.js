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

const IconMetadataThick = ({ className = '', color = '#999', height = 24, title, width = 24 }: Props) => (
    <AccessibleSVG
        className={`icon-metadata-thick ${className}`}
        title={title}
        width={width}
        height={height}
        viewBox="0 0 24 24"
    >
        <path
            className="fill-color"
            fill={color}
            d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm4.37,13.43a1,1,0,0,1-.37.07,1,1,0,0,1-.93-.63L13.9,11.94l-1,2a1,1,0,0,1-1.78,0l-1-2L8.93,14.87a1,1,0,1,1-1.86-.74l2-5a1,1,0,0,1,1.82-.08L12,11.26l1.11-2.21A1,1,0,0,1,14,8.5a1,1,0,0,1,.89.63l2,5A1,1,0,0,1,16.37,15.43Z"
        />
    </AccessibleSVG>
);

export default IconMetadataThick;
