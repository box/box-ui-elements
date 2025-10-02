// @flow
import * as React from 'react';
import uniqueId from 'lodash/uniqueId';

import AccessibleSVG from '../accessible-svg';

const ICON_CLASS = 'icon-iwork-numbers';

type Props = {
    className: string,
    height?: number,
    /** A text-only string describing the icon if it's not purely decorative for accessibility */
    title?: string | React.Element<any>,
    width?: number,
};

class IconIWorkNumbers extends React.Component<Props> {
    static defaultProps = {
        className: '',
        height: 30,
        width: 30,
    };

    idPrefix = `${uniqueId(ICON_CLASS)}-`;

    render() {
        const { className, height, title, width } = this.props;
        return (
            <AccessibleSVG
                className={`${ICON_CLASS} ${className}`}
                height={height}
                title={title}
                viewBox="0 0 30 30"
                width={width}
            >
                <defs>
                    <linearGradient
                        gradientTransform="matrix(1.33 0 0 1.33 1370.77 1805.85)"
                        gradientUnits="userSpaceOnUse"
                        id={`${this.idPrefix}b`}
                        x1="-1016.86"
                        x2="-1016.84"
                        y1="-1332.01"
                        y2="-1354.15"
                    >
                        <stop offset="0" stopColor="#11d51d" />
                        <stop offset="1" stopColor="#82fa6c" />
                    </linearGradient>
                    <linearGradient
                        gradientTransform="translate(1047.93 1130.18)"
                        gradientUnits="userSpaceOnUse"
                        id={`${this.idPrefix}a`}
                        x1="-1035.54"
                        x2="-1035.87"
                        y1="-1124.31"
                        y2="-1105.94"
                    >
                        <stop offset="0" stopColor="#fff" />
                        <stop offset="1" stopColor="#fff" />
                    </linearGradient>
                    <linearGradient
                        id={`${this.idPrefix}c`}
                        x1="-1041.03"
                        x2="-1041.35"
                        xlinkHref={`#${this.idPrefix}a`}
                        y1="-1124.41"
                        y2="-1106.03"
                    />
                    <linearGradient
                        id={`${this.idPrefix}d`}
                        x1="-1030.07"
                        x2="-1030.4"
                        xlinkHref={`#${this.idPrefix}a`}
                        y1="-1124.22"
                        y2="-1105.84"
                    />
                    <linearGradient
                        id={`${this.idPrefix}e`}
                        x1="-1024.48"
                        x2="-1024.8"
                        xlinkHref={`#${this.idPrefix}a`}
                        y1="-1124.12"
                        y2="-1105.74"
                    />
                    <linearGradient
                        id={`${this.idPrefix}f`}
                        x1="-1032.65"
                        x2="-1032.97"
                        xlinkHref={`#${this.idPrefix}a`}
                        y1="-1124.26"
                        y2="-1105.89"
                    />
                </defs>
                <path
                    d="M6.88 0h16.24A6.87 6.87 0 0 1 30 6.88v16.24A6.87 6.87 0 0 1 23.12 30H6.88A6.87 6.87 0 0 1 0 23.12V6.88A6.87 6.87 0 0 1 6.88 0z"
                    fill={`url(#${this.idPrefix}b)`}
                />
                <path
                    d="M10 14.79h4.4a.18.18 0 0 1 .18.18v7.56a.18.18 0 0 1-.18.18H10a.18.18 0 0 1-.18-.18V15a.18.18 0 0 1 .18-.21z"
                    fill={`url(#${this.idPrefix}a)`}
                />
                <path
                    d="M4.39 19.29h4.49a.13.13 0 0 1 .14.12v3.18a.13.13 0 0 1-.14.12H4.39a.13.13 0 0 1-.14-.12v-3.18a.13.13 0 0 1 .14-.12z"
                    fill={`url(#${this.idPrefix}c)`}
                />
                <path
                    d="M15.51 5.79h4.4a.18.18 0 0 1 .18.19v16.55a.18.18 0 0 1-.18.18h-4.4a.18.18 0 0 1-.18-.18V6a.18.18 0 0 1 .18-.21z"
                    fill={`url(#${this.idPrefix}d)`}
                />
                <path
                    d="M21.05 10.74h4.43a.17.17 0 0 1 .16.18v11.62a.16.16 0 0 1-.16.17h-4.43a.16.16 0 0 1-.17-.17V10.92a.17.17 0 0 1 .17-.18z"
                    fill={`url(#${this.idPrefix}e)`}
                />
                <path
                    d="M4.52 23.58H25.4a.4.4 0 0 1 .43.35V24a.4.4 0 0 1-.43.35H4.52a.4.4 0 0 1-.43-.35v-.11a.4.4 0 0 1 .43-.31z"
                    fill={`url(#${this.idPrefix}f)`}
                />
            </AccessibleSVG>
        );
    }
}

export default IconIWorkNumbers;
