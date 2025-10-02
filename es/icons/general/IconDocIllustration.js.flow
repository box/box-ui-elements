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

const ICON_CLASS = 'icon-doc-illustration';

class IconDocIllustration extends React.PureComponent<Props> {
    static defaultProps = {
        className: '',
        height: 170,
        width: 170,
    };

    idPrefix = `${uniqueId(ICON_CLASS)}-`;

    render() {
        const { className, height, title, width } = this.props;
        return (
            <AccessibleSVG
                className={`${ICON_CLASS} ${className}`}
                height={height}
                title={title}
                viewBox="0 0 170 170"
                width={width}
            >
                <defs>
                    <path
                        d="M105.26 46.045v94.815c0 1.225-1.012 2.24-2.232 2.24H18.231c-1.22 0-2.231-1.015-2.231-2.24V33.34c0-1.225 1.011-2.24 2.231-2.24h72.14c.593 0 1.151.245 1.57.665l12.656 12.705c.453.385.663.98.663 1.575z"
                        id={`${this.idPrefix}a`}
                    />
                    <path
                        d="M128.235 40.9v106.68c0 1.4-1.116 2.52-2.51 2.52H30.329a2.505 2.505 0 0 1-2.51-2.52V26.62c0-1.4 1.115-2.52 2.51-2.52h81.17c.662 0 1.29.28 1.778.735l14.226 14.28c.488.49.732 1.12.732 1.785z"
                        id={`${this.idPrefix}c`}
                    />
                    <filter
                        filterUnits="objectBoundingBox"
                        height="119.8%"
                        id={`${this.idPrefix}b`}
                        width="124.9%"
                        x="-12.4%"
                        y="-6.7%"
                    >
                        <feOffset dy="4" in="SourceAlpha" result="shadowOffsetOuter1" />
                        <feGaussianBlur in="shadowOffsetOuter1" result="shadowBlurOuter1" stdDeviation="3.5" />
                        <feColorMatrix in="shadowBlurOuter1" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0" />
                    </filter>
                    <path
                        d="M153.574 33.655V152.2c0 1.54-1.255 2.8-2.789 2.8H44.79A2.803 2.803 0 0 1 42 152.2V17.8c0-1.54 1.255-2.8 2.79-2.8h90.2c.733 0 1.465.28 1.988.805l15.795 15.855c.523.56.801 1.26.801 1.995z"
                        id={`${this.idPrefix}e`}
                    />
                    <filter
                        filterUnits="objectBoundingBox"
                        height="135%"
                        id={`${this.idPrefix}d`}
                        width="143.9%"
                        x="-22%"
                        y="-12.5%"
                    >
                        <feOffset dy="7" in="SourceAlpha" result="shadowOffsetOuter1" />
                        <feGaussianBlur in="shadowOffsetOuter1" result="shadowBlurOuter1" stdDeviation="7" />
                        <feComposite in="shadowBlurOuter1" in2="SourceAlpha" operator="out" result="shadowBlurOuter1" />
                        <feColorMatrix in="shadowBlurOuter1" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0" />
                    </filter>
                    <path
                        d="M59.859 39.5c-3.835 0-6.973-3.15-6.973-7s3.138-7 6.973-7 6.973 3.15 6.973 7-3.138 7-6.973 7z"
                        id={`${this.idPrefix}g`}
                    />
                    <filter
                        filterUnits="objectBoundingBox"
                        height="278.6%"
                        id={`${this.idPrefix}f`}
                        width="279.3%"
                        x="-89.6%"
                        y="-60.7%"
                    >
                        <feOffset dy="4" in="SourceAlpha" result="shadowOffsetOuter1" />
                        <feGaussianBlur in="shadowOffsetOuter1" result="shadowBlurOuter1" stdDeviation="3.5" />
                        <feColorMatrix in="shadowBlurOuter1" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0" />
                    </filter>
                    <filter
                        filterUnits="objectBoundingBox"
                        height="274.7%"
                        id={`${this.idPrefix}h`}
                        width="249.1%"
                        x="-74.5%"
                        y="-87.4%"
                    >
                        <feGaussianBlur in="SourceGraphic" stdDeviation="3.465" />
                    </filter>
                    <path
                        d="M84.998 136.38a19.765 19.765 0 0 0 5.788-14.035c0-10.955-8.856-19.845-19.77-19.845v19.845l13.982 14.035z"
                        id={`${this.idPrefix}j`}
                    />
                    <filter
                        filterUnits="objectBoundingBox"
                        height="182.6%"
                        id={`${this.idPrefix}i`}
                        width="241.6%"
                        x="-70.8%"
                        y="-20.7%"
                    >
                        <feOffset dy="7" in="SourceAlpha" result="shadowOffsetOuter1" />
                        <feGaussianBlur in="shadowOffsetOuter1" result="shadowBlurOuter1" stdDeviation="3.5" />
                        <feColorMatrix in="shadowBlurOuter1" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0" />
                    </filter>
                </defs>
                <g fill="none" fillRule="evenodd">
                    <g fill="#8EA6B2" opacity=".2">
                        <use xlinkHref={`#${this.idPrefix}a`} />
                        <use xlinkHref={`#${this.idPrefix}a`} />
                    </g>
                    <g opacity=".2">
                        <use fill="#000" filter={`url(#${this.idPrefix}b)`} xlinkHref={`#${this.idPrefix}c`} />
                        <use fill="#8EA6B2" xlinkHref={`#${this.idPrefix}c`} />
                        <use fill="#8EA6B2" xlinkHref={`#${this.idPrefix}c`} />
                    </g>
                    <use fill="#000" filter={`url(#${this.idPrefix}d)`} xlinkHref={`#${this.idPrefix}e`} />
                    <use fill="#FFF" fillOpacity=".95" xlinkHref={`#${this.idPrefix}e`} />
                    <path d="M70.912 102.5c-10.913 0-19.77 8.89-19.77 19.845h19.77V102.5z" fill="#0061D5" />
                    <path
                        d="M70.912 122.45h-19.77c0 10.955 8.857 19.845 19.77 19.845 5.44 0 10.39-2.205 13.982-5.81L70.912 122.45z"
                        fill="#FC617A"
                    />
                    <use fill="#000" filter={`url(#${this.idPrefix}f)`} xlinkHref={`#${this.idPrefix}g`} />
                    <use fill="#8EA6B2" xlinkHref={`#${this.idPrefix}g`} />
                    <path
                        d="M52.537 30.75h13.947v11.9H52.537z"
                        fill="#005ECF"
                        fillOpacity=".2"
                        filter={`url(#${this.idPrefix}h)`}
                    />
                    <use fill="#000" filter={`url(#${this.idPrefix}i)`} xlinkHref={`#${this.idPrefix}j`} />
                    <use fill="#76AEF1" xlinkHref={`#${this.idPrefix}j`} />
                    <path d="M57.418 32.57l1.465 1.47 2.929-2.94" stroke="#FFF" strokeWidth=".5" />
                    <path
                        d="M77.293 37.75a5.233 5.233 0 0 1-5.23-5.25 5.233 5.233 0 0 1 5.23-5.25 5.233 5.233 0 0 1 5.23 5.25 5.233 5.233 0 0 1-5.23 5.25zM90.193 36c-1.917 0-3.486-1.575-3.486-3.5s1.569-3.5 3.486-3.5c1.918 0 3.487 1.575 3.487 3.5S92.111 36 90.193 36z"
                        fill="#8EA6B2"
                        opacity=".5"
                    />
                    <path
                        d="M58 46.5v-1h80v1H58zm0 9v-1h80v1H58zm0 9v-1h80v1H58zm0 8v-1h80v1H58zm0 9v-1h80v1H58zm0 9v-1h80v1H58zm44 9v-1h36v1h-36zm0 9v-1h36v1h-36zm0 9v-1h36v1h-36zm0 9v-1h36v1h-36zm0 9v-1h36v1h-36z"
                        stroke="#C3D1D9"
                    />
                </g>
            </AccessibleSVG>
        );
    }
}

export default IconDocIllustration;
