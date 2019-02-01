// @flow
import * as React from 'react';

import AccessibleSVG from '../accessible-svg';

type Props = {
    className?: string,
    height?: number,
    /** A text-only string describing the icon if it's not purely decorative for accessibility */
    title?: string | React.Element<any>,
    width?: number,
};

const IconAlertBlank = ({ className = '', height = 26, title, width = 26 }: Props) => (
    <AccessibleSVG
        className={`icon-alert-blank ${className}`}
        height={height}
        title={title}
        viewBox="0 0 26 26"
        width={width}
    >
        <defs>
            <circle cx="8" cy="8" id="b" r="8" />
            <filter filterUnits="objectBoundingBox" height="193.8%" id="a" width="193.8%" x="-46.9%" y="-46.9%">
                <feMorphology in="SourceAlpha" operator="dilate" radius=".5" result="shadowSpreadOuter1" />
                <feOffset in="shadowSpreadOuter1" result="shadowOffsetOuter1" />
                <feGaussianBlur in="shadowOffsetOuter1" result="shadowBlurOuter1" stdDeviation="2" />
                <feColorMatrix
                    in="shadowBlurOuter1"
                    values="0 0 0 0 0.733285502 0 0 0 0 0.733285502 0 0 0 0 0.733285502 0 0 0 0.5 0"
                />
            </filter>
        </defs>
        <g fill="none" fillRule="evenodd" transform="translate(5 5)">
            <use fill="#000" filter="url(#a)" xlinkHref="#b" />
            <use fill="#F7931D" xlinkHref="#b" />
        </g>
    </AccessibleSVG>
);

export default IconAlertBlank;
