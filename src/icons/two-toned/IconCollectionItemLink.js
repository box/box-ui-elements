// @flow
import * as React from 'react';

import AccessibleSVG from '../accessible-svg';
import type { TwoTonedIcon } from '../flowTypes';
import { bdlGray, white } from '../../styles/variables';

const IconCollectionItemLink = ({ className = '', height = 24, title, width = 24 }: TwoTonedIcon) => (
    <AccessibleSVG
        className={`bdl-IconCollectionItemLink ${className}`}
        height={height}
        title={title}
        viewBox="0 0 32 32"
        width={width}
    >
        <g fill="none" fillRule="evenodd">
            <path
                className="background-color"
                fill={bdlGray}
                d="M2.667 15.467c0-7.09 5.71-12.8 12.8-12.8 7.089 0 12.8 5.71 12.8 12.8 0 7.089-5.711 12.8-12.8 12.8-7.09 0-12.8-5.711-12.8-12.8z"
            />
            <path
                className="foreground-color"
                fill={white}
                fillRule="nonzero"
                d="M17.281 12.184h-3.757c-.574 0-1.039-.46-1.039-1.025 0-.567.465-1.026 1.04-1.026h6.236c.574 0 1.039.46 1.039 1.026v6.151c0 .566-.465 1.025-1.04 1.025-.573 0-1.039-.459-1.039-1.025v-3.646L11.908 20.5c-.406.4-1.064.4-1.47 0a1.015 1.015 0 0 1 0-1.45l6.843-6.866z"
            />
        </g>
    </AccessibleSVG>
);

export default IconCollectionItemLink;
