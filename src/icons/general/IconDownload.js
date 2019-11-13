// @flow
import * as React from 'react';

import AccessibleSVG from '../accessible-svg';
import { bdlGray80 } from '../../styles/variables';

import type { Icon } from '../flowTypes';

const IconDownload = ({ className = '', color = bdlGray80, height = 16, title, width = 16 }: Icon) => (
    <AccessibleSVG
        className={`icon-download ${className}`}
        height={height}
        title={title}
        viewBox="0 0 16 16"
        width={width}
    >
        <path
            className="fill-color"
            fill={color}
            fillRule="evenodd"
            d="M14 14v1H2v-1h12zM10.996 2v4.997H14L8 13 2 6.997h3.004V2h5.992zm-.998 1H6.002v4.996h-1.59L8 11.586l3.589-3.59H9.998V3z"
        />
    </AccessibleSVG>
);

export default IconDownload;
