// @flow
import * as React from 'react';

import AccessibleSVG from '../accessible-svg';
import { bdlGray10, bdlGray50, white } from '../../styles/variables';

type Props = {
    className?: string,
    color?: string,
    height?: number,
    strokeColor?: string,
    /** A text-only string describing the icon if it's not purely decorative for accessibility */
    title?: string | React.Element<any>,
    width?: number,
};

const SecurityBlockedState = ({
    className = '',
    color = bdlGray10,
    height = 167,
    strokeColor = bdlGray50,
    title,
    width = 130,
}: Props) => (
    <AccessibleSVG
        className={`bdl-SecurityBlockedState ${className}`}
        height={height}
        title={title}
        viewBox="0 0 130 167"
        width={width}
    >
        <path
            className="stroke-color"
            stroke={color}
            strokeWidth="4"
            fill={white}
            strokeDasharray="3"
            d="M7 0h91l32 30v130a7 7 0 0 1-7 7H7a7 7 0 0 1-7-7V7a7 7 0 0 1 7-7z"
        />
        <path className="fill-color" fill={color} d="M98 0l32 30H98z" />
        <path
            className="stroke-color"
            d="M35 55.385S50 63.91 65 50c15 13.91 30 5.385 30 5.385v47.788L65 120l-30-16.827V55.385z"
            stroke={strokeColor}
            strokeWidth="4"
            fill={white}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            className="fill-color"
            d="M64.412 57c-12.353 11.128-24.706 4.308-24.706 4.308v38.23L64.412 113V57z"
            fill={color}
        />
        <path
            className="stroke-color"
            d="M85.588 71v23.333"
            stroke={strokeColor}
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </AccessibleSVG>
);

export default SecurityBlockedState;
