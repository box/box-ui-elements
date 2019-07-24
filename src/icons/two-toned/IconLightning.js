// @flow
import * as React from 'react';

import AccessibleSVG from '../accessible-svg';
import type { TwoTonedIcon } from '../flowTypes';
import { bdlBoxBlue, white } from '../../styles/variables';

const IconLightning = ({ className = '', height = 24, title, width = 24 }: TwoTonedIcon) => (
    <AccessibleSVG
        className={`bdl-IconLightning ${className}`}
        height={height}
        title={title}
        viewBox="0 0 32 32"
        width={width}
    >
        <circle className="background-color" fill={bdlBoxBlue} cx="16" cy="16" r="12" />
        <polygon
            className="foreground-color"
            fill={white}
            points="19.3333333 8 11 17.6 14.3333333 17.6 12.6666667 24 21 14.4 17.6666667 14.4"
        />
    </AccessibleSVG>
);

export default IconLightning;
