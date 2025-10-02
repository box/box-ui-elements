// @flow
import * as React from 'react';

import AccessibleSVG from '../accessible-svg';

import type { Icon } from '../flowTypes';

const IconAlertDefault = ({ className = '', color = '#F7931D', height = 26, title, width = 26 }: Icon) => (
    <AccessibleSVG
        className={`icon-alert-default ${className}`}
        title={title}
        height={height}
        width={width}
        viewBox="0 0 26 26"
    >
        <defs>
            <circle id="b" cx="8" cy="8" r="8" />
            <filter x="-46.9%" y="-46.9%" width="193.8%" height="193.8%" filterUnits="objectBoundingBox" id="a">
                <feMorphology radius=".5" operator="dilate" in="SourceAlpha" result="shadowSpreadOuter1" />
                <feOffset in="shadowSpreadOuter1" result="shadowOffsetOuter1" />
                <feGaussianBlur stdDeviation="2" in="shadowOffsetOuter1" result="shadowBlurOuter1" />
                <feColorMatrix
                    values="0 0 0 0 0.733285502 0 0 0 0 0.733285502 0 0 0 0 0.733285502 0 0 0 0.5 0"
                    in="shadowBlurOuter1"
                />
            </filter>
        </defs>
        <g transform="translate(5 5)" fill="none" fillRule="evenodd">
            <use fill="#000" filter="url(#a)" xlinkHref="#b" />
            <use fill={color} xlinkHref="#b" />
            <path
                d="M8.047 4.706v4.111"
                stroke="#FFF"
                strokeWidth="1.412"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <circle fill="#FFF" cx="8.047" cy="11.294" r="1" />
        </g>
    </AccessibleSVG>
);

export default IconAlertDefault;
