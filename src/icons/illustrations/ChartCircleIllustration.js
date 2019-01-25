// @flow
import * as React from 'react';
import uniqueId from 'lodash/uniqueId';

import AccessibleSVG from '../accessible-svg';

type Props = {
    className: string,
    height?: number,
    /** A text-only string describing the icon if it's not purely decorative for accessibility */
    title?: string | React.Element<any>,
    width?: number,
};

const ICON_CLASS = 'chart-circle-illustration';

class ChartCircleIllustration extends React.PureComponent<Props> {
    static defaultProps = {
        className: '',
        height: 200,
        width: 200,
    };

    idPrefix = `${uniqueId(ICON_CLASS)}-`;

    render() {
        const { className, height, title, width } = this.props;
        return (
            <AccessibleSVG
                className={`${ICON_CLASS} ${className}`}
                height={height}
                title={title}
                width={width}
                viewBox="0 0 200 200"
            >
                <defs>
                    <rect id="b" width="79.2" height="79.2" rx="1.2175" />
                    <filter x="-18.3%" y="-12%" width="136.6%" height="136.6%" filterUnits="objectBoundingBox" id="a">
                        <feOffset dy={5} in="SourceAlpha" result="shadowOffsetOuter1" />
                        <feGaussianBlur stdDeviation={4} in="shadowOffsetOuter1" result="shadowBlurOuter1" />
                        <feColorMatrix
                            values="0 0 0 0 0 0 0 0 0 0.160784314 0 0 0 0 0.278431373 0 0 0 0.12 0"
                            in="shadowBlurOuter1"
                        />
                    </filter>
                    <filter x="-58.3%" y="-152.9%" width="216.7%" height="520%" filterUnits="objectBoundingBox" id="c">
                        <feOffset dy={1} in="SourceAlpha" result="shadowOffsetOuter1" />
                        <feGaussianBlur stdDeviation={2} in="shadowOffsetOuter1" result="shadowBlurOuter1" />
                        <feColorMatrix
                            values="0 0 0 0 0 0 0 0 0 0.380392157 0 0 0 0 0.839215686 0 0 0 0.1 0"
                            in="shadowBlurOuter1"
                            result="shadowMatrixOuter1"
                        />
                        <feOffset dy={1} in="SourceAlpha" result="shadowOffsetOuter2" />
                        <feGaussianBlur stdDeviation="4.5" in="shadowOffsetOuter2" result="shadowBlurOuter2" />
                        <feColorMatrix
                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.04 0"
                            in="shadowBlurOuter2"
                            result="shadowMatrixOuter2"
                        />
                        <feOffset dy={1} in="SourceAlpha" result="shadowOffsetOuter3" />
                        <feGaussianBlur stdDeviation={7} in="shadowOffsetOuter3" result="shadowBlurOuter3" />
                        <feColorMatrix
                            values="0 0 0 0 0 0 0 0 0 0.380392157 0 0 0 0 0.839215686 0 0 0 0.05 0"
                            in="shadowBlurOuter3"
                            result="shadowMatrixOuter3"
                        />
                        <feOffset dy={1} in="SourceAlpha" result="shadowOffsetOuter4" />
                        <feGaussianBlur stdDeviation={5} in="shadowOffsetOuter4" result="shadowBlurOuter4" />
                        <feColorMatrix
                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.02 0"
                            in="shadowBlurOuter4"
                            result="shadowMatrixOuter4"
                        />
                        <feMerge>
                            <feMergeNode in="shadowMatrixOuter1" />
                            <feMergeNode in="shadowMatrixOuter2" />
                            <feMergeNode in="shadowMatrixOuter3" />
                            <feMergeNode in="shadowMatrixOuter4" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                    <rect id="e" width={126} height="34.7866" rx="17.3933" />
                    <filter
                        x="-40.9%"
                        y="-102.1%"
                        width="181.7%"
                        height="396.1%"
                        filterUnits="objectBoundingBox"
                        id="d"
                    >
                        <feOffset dy={16} in="SourceAlpha" result="shadowOffsetOuter1" />
                        <feGaussianBlur stdDeviation="14.5" in="shadowOffsetOuter1" result="shadowBlurOuter1" />
                        <feComposite in="shadowBlurOuter1" in2="SourceAlpha" operator="out" result="shadowBlurOuter1" />
                        <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.12 0" in="shadowBlurOuter1" />
                    </filter>
                    <path
                        d="M17.393 0h104.148c1.55 0 2.113.162 2.68.465a3.161 3.161 0 0 1 1.314 1.315c.303.566.465 1.129.465 2.68v25.867c0 1.55-.162 2.113-.465 2.68a3.16 3.16 0 0 1-1.315 1.315c-.567.303-1.129.465-2.68.465H17.394C7.787 34.787 0 26.999 0 17.393 0 7.787 7.787 0 17.393 0z"
                        id="g"
                    />
                    <filter x="-5.2%" y="-18.7%" width="118.3%" height="174.7%" filterUnits="objectBoundingBox" id="f">
                        <feOffset dx={5} dy={8} in="SourceAlpha" result="shadowOffsetOuter1" />
                        <feGaussianBlur stdDeviation="2.5" in="shadowOffsetOuter1" result="shadowBlurOuter1" />
                        <feColorMatrix
                            values="0 0 0 0 0.0823529412 0 0 0 0 0.121568627 0 0 0 0 0.149019608 0 0 0 0.08 0"
                            in="shadowBlurOuter1"
                        />
                    </filter>
                </defs>
                <g transform="translate(10 10)" fill="none" fillRule="evenodd">
                    <circle fill="#E9EEF3" cx={90} cy={90} r={90} />
                    <g transform="translate(74.7 18)">
                        <use fill="#000" filter="url(#a)" xlinkHref="#b" />
                        <use fill="#FFF" xlinkHref="#b" />
                        <path fill="#E9EEF3" d="M36.554 2.437h40.303v74.515H36.554z" />
                        <g transform="translate(45.083 28.0246)">
                            <circle fill="#F5B95A" cx="11.716" cy="11.716" r="11.716" />
                            <path d="M11.716 23.432V11.716h11.716c0 6.47-5.245 11.716-11.716 11.716z" fill="#0061D5" />
                            <path
                                d="M11.728 0v11.716l10.315 5.581a11.727 11.727 0 0 1-10.315 6.135C5.251 23.432 0 18.187 0 11.716 0 5.246 5.25 0 11.728 0z"
                                fill="#FC627A"
                            />
                        </g>
                        <rect fill="#0061D5" x="8.6698" y="17.8083" width="12.1846" height="1.5231" rx=".7615" />
                        <path
                            d="M9.38 22.026h17.793a.71.71 0 1 1 0 1.422H9.381a.71.71 0 0 1 0-1.422zm0 14.215h8.046a.71.71 0 1 1 0 1.422H9.38a.71.71 0 1 1 0-1.422zm0 2.843h17.793a.71.71 0 0 1 0 1.422H9.381a.71.71 0 1 1 0-1.421zm0 2.843h22.668a.71.71 0 1 1 0 1.422H9.381a.71.71 0 1 1 0-1.421z"
                            fill="#C3D1D9"
                        />
                        <path
                            d="M9.38 52.081h17.793a.71.71 0 1 1 0 1.422H9.381a.71.71 0 1 1 0-1.422zm0 2.843h11.702a.71.71 0 0 1 0 1.422H9.38a.71.71 0 1 1 0-1.421zm0 2.844h15.966a.71.71 0 1 1 0 1.421H9.38a.71.71 0 1 1 0-1.421z"
                            fill="#E9EEF3"
                        />
                    </g>
                    <g filter="url(#c)" transform="translate(0 117.9)">
                        <g opacity=".42">
                            <use fill="#000" filter="url(#d)" xlinkHref="#e" />
                            <use fillOpacity={0} fill="#FFF" xlinkHref="#e" />
                        </g>
                        <use fill="#000" filter="url(#f)" xlinkHref="#g" />
                        <use fill="#FFF" xlinkHref="#g" />
                        <rect fill="#E9EEF3" x="38.2653" y="13.9147" width={72} height="6.9573" rx="3.4787" />
                        <circle fill="#5FC9CF" cx="17.3933" cy="17.3933" r="12.1753" />
                        <text
                            fontFamily="Lato-Bold, Lato"
                            fontSize="8.6967"
                            fontWeight="bold"
                            letterSpacing=".8697"
                            fill="#FFF"
                        >
                            <tspan x="7.9292" y="21.1753">
                                MW
                            </tspan>
                        </text>
                    </g>
                </g>
            </AccessibleSVG>
        );
    }
}

export default ChartCircleIllustration;
