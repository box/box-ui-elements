// @flow
import * as React from 'react';

import AccessibleSVG from '../accessible-svg';
import { BOX_BLUE } from '../../common/variables';

type Props = {
    className?: string,
    color?: string,
    height?: number,
    /** A text-only string describing the icon if it's not purely decorative for accessibility */
    title?: string | React.Element<any>,
    width?: number,
};

const UploadSuccessState = ({ className = '', color = BOX_BLUE, height = 49, title, width = 50 }: Props) => (
    <AccessibleSVG
        className={`upload-success-state ${className}`}
        title={title}
        width={width}
        height={height}
        viewBox="0 0 50 49"
    >
        <path
            className="fill-color"
            d="M41.88,4.39l4,4.53L17,38.73,4.24,26,9,21.28l5.89,6.09L17,29.57l2.16-2.18,22.74-23M42,0,17,25.28,9,17,0,26,17,43,50,9,42,0Z"
            fill={color}
        />
        <rect
            className="fill-color"
            width="6"
            height="3"
            fill={color}
            fillOpacity="0.2"
            rx="1.5"
            ry="1.5"
            x="4"
            y="46"
        />
        <rect
            className="fill-color"
            width="6"
            height="3"
            fill={color}
            fillOpacity="0.2"
            rx="1.5"
            ry="1.5"
            x="33"
            y="46"
        />
        <rect
            className="fill-color"
            width="21"
            height="3"
            fill={color}
            fillOpacity="0.2"
            rx="1.5"
            ry="1.5"
            x="11"
            y="46"
        />
    </AccessibleSVG>
);

export default UploadSuccessState;
