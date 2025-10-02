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

const IconConePopper = ({ className = '', height = 50, title, width = 120 }: Props) => (
    <AccessibleSVG
        className={`icon-cone-popper ${className}`}
        height={height}
        title={title}
        viewBox="0 0 120 50"
        width={width}
    >
        <defs>
            <path d="M0 0h120v50H0z" id="a" />
            <path
                d="M51.419.433l7.415 7.31 8.027-2.797c-1.183 14.282-4.539 24.96-10.066 32.035-8.291 10.612-10.204 11.504-20.881 20.463-7.119 5.973-12.617 14.603-16.494 25.89l-9.356-.843c-.21-18.085 2.976-31.342 9.56-39.769 9.876-12.64 12.579-9.414 20.118-19.064C44.768 17.225 48.66 9.483 51.42.433z"
                id="d"
            />
            <filter filterUnits="objectBoundingBox" height="220.6%" id="c" width="276%" x="-88%" y="-55.5%">
                <feOffset dy="2" in="SourceAlpha" result="shadowOffsetOuter1" />
                <feGaussianBlur in="shadowOffsetOuter1" result="shadowBlurOuter1" stdDeviation="12" />
                <feColorMatrix
                    in="shadowBlurOuter1"
                    result="shadowMatrixOuter1"
                    values="0 0 0 0 0.447058824 0 0 0 0 0.517647059 0 0 0 0 0.556862745 0 0 0 0.2 0"
                />
                <feOffset dy="1" in="SourceAlpha" result="shadowOffsetOuter2" />
                <feGaussianBlur in="shadowOffsetOuter2" result="shadowBlurOuter2" stdDeviation="6" />
                <feColorMatrix
                    in="shadowBlurOuter2"
                    result="shadowMatrixOuter2"
                    values="0 0 0 0 0 0 0 0 0 0.160784314 0 0 0 0 0.278431373 0 0 0 0.1 0"
                />
                <feOffset dy="1" in="SourceAlpha" result="shadowOffsetOuter3" />
                <feGaussianBlur in="shadowOffsetOuter3" result="shadowBlurOuter3" stdDeviation=".5" />
                <feColorMatrix
                    in="shadowBlurOuter3"
                    result="shadowMatrixOuter3"
                    values="0 0 0 0 0 0 0 0 0 0.380392157 0 0 0 0 0.835294118 0 0 0 0.02 0"
                />
                <feMerge>
                    <feMergeNode in="shadowMatrixOuter1" />
                    <feMergeNode in="shadowMatrixOuter2" />
                    <feMergeNode in="shadowMatrixOuter3" />
                </feMerge>
            </filter>
        </defs>
        <g fill="none" fillRule="evenodd">
            <mask fill="#fff" id="b">
                <use xlinkHref="#a" />
            </mask>
            <use fill="#FFF" fillOpacity="0" xlinkHref="#a" />
            <g mask="url(#b)">
                <g transform="scale(-1 1) rotate(52 4.655 -71.114)">
                    <ellipse cx="15" cy="74" fill="#0061D5" rx="15" ry="4" />
                    <use fill="#000" filter="url(#c)" xlinkHref="#d" />
                    <use fill="#F85064" xlinkHref="#d" />
                    <g>
                        <path
                            d="M.37 74.886C1.88 76.669 7.856 78 15 78c7.143 0 13.12-1.331 14.63-3.114L15 110 .37 74.886z"
                            fill="#FFBF00"
                        />
                        <path
                            d="M3.897 76.69c1.112.326 2.424.603 3.883.817l7.232 32.501L3.897 76.69z"
                            fill="#FFF"
                            opacity=".2"
                        />
                    </g>
                </g>
            </g>
        </g>
    </AccessibleSVG>
);

export default IconConePopper;
