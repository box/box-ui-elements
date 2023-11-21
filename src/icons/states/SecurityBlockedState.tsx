import * as React from 'react';

import AccessibleSVG from '../accessible-svg';
import { bdlGray10, bdlGray50, white } from '../../styles/variables';
import { TwoTonedIcon } from '../iconTypes';

interface SecurityBlockedStateProps extends TwoTonedIcon {
    primaryColor?: string;
    secondaryColor?: string;
}

const SecurityBlockedState = ({
    className = '',
    primaryColor = bdlGray10,
    height = 167,
    secondaryColor = bdlGray50,
    title,
    width = 130,
}: SecurityBlockedStateProps) => (
    <AccessibleSVG
        className={`bdl-SecurityBlockedState ${className}`}
        height={height}
        title={title}
        viewBox="0 0 130 167"
        width={width}
    >
        <path
            className="stroke-color"
            d="M7 0h91l32 30v130a7 7 0 0 1-7 7H7a7 7 0 0 1-7-7V7a7 7 0 0 1 7-7z"
            fill={white}
            stroke={primaryColor}
            strokeDasharray="3"
            strokeWidth="4"
        />
        <path className="fill-color" d="M98 0l32 30H98z" fill={primaryColor} />
        <path
            className="stroke-color"
            d="M35 55.385S50 63.91 65 50c15 13.91 30 5.385 30 5.385v47.788L65 120l-30-16.827V55.385z"
            fill={white}
            stroke={secondaryColor}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="4"
        />
        <path
            className="fill-color"
            d="M64.412 57c-12.353 11.128-24.706 4.308-24.706 4.308v38.23L64.412 113V57z"
            fill={primaryColor}
        />
        <path
            className="stroke-color"
            d="M85.588 71v23.333"
            stroke={secondaryColor}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="4"
        />
    </AccessibleSVG>
);

export default SecurityBlockedState;
