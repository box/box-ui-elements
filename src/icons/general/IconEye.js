// @flow
import * as React from 'react';

import AccessibleSVG from '../accessible-svg';

import type { Icon } from '../flowTypes';

const IconEye = ({ className = '', color = '#000000', height = 11, title, width = 15 }: Icon) => (
    <AccessibleSVG className={`icon-eye ${className}`} height={height} title={title} viewBox="0 0 15 11" width={width}>
        <path
            className="fill-color"
            d="M.118 5.857C1.233 8.855 3.986 10.98 7.21 10.98c3.223 0 5.976-2.125 7.09-5.123C13.187 2.86 10.434.735 7.21.735 3.986.735 1.233 2.86.118 5.857zM7.21 9.27c-1.78 0-3.224-1.528-3.224-3.413 0-1.885 1.444-3.414 3.224-3.414 1.78 0 3.223 1.53 3.223 3.414 0 1.885-1.444 3.414-3.223 3.414zm0-5.462c-1.07 0-1.935.915-1.935 2.05 0 1.133.864 2.048 1.935 2.048 1.07 0 1.934-.915 1.934-2.05 0-1.133-.864-2.048-1.934-2.048z"
            fill={color}
        />
    </AccessibleSVG>
);

export default IconEye;
