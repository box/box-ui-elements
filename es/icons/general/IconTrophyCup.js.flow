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

const ICON_CLASS = 'icon-trophy-cup';

class IconTrophyCup extends React.PureComponent<Props> {
    static defaultProps = {
        className: '',
        height: 30,
        width: 36,
    };

    idPrefix = `${uniqueId(ICON_CLASS)}-`;

    render() {
        const { className, height, title, width } = this.props;

        return (
            <AccessibleSVG
                className={`${ICON_CLASS} ${className}`}
                height={height}
                title={title}
                viewBox="0 0 36 30"
                width={width}
            >
                <defs>
                    <path
                        d="M18 15.707c6.395 0 11.579-5.1 11.579-11.393H6.42c0 6.292 5.184 11.393 11.579 11.393z"
                        id={`${this.idPrefix}b`}
                    />
                    <filter
                        filterUnits="objectBoundingBox"
                        height="126.3%"
                        id={`${this.idPrefix}a`}
                        width="113%"
                        x="-6.5%"
                        y="-13.2%"
                    >
                        <feOffset in="SourceAlpha" result="shadowOffsetOuter1" />
                        <feGaussianBlur in="shadowOffsetOuter1" result="shadowBlurOuter1" stdDeviation=".5" />
                        <feColorMatrix
                            in="shadowBlurOuter1"
                            values="0 0 0 0 0.960784314 0 0 0 0 0.725490196 0 0 0 0 0.352941176 0 0 0 0.32 0"
                        />
                    </filter>
                </defs>
                <g fill="none" fillRule="evenodd">
                    <path
                        d="M32.822 4.173h-16.17c.546 3.901 3.954 6.911 8.085 6.911 4.13 0 7.539-3.01 8.085-6.911z"
                        stroke="#F8D371"
                        strokeWidth="2.203"
                    />
                    <path
                        d="M19.348 4.173H3.178c.546 3.901 3.955 6.911 8.085 6.911 4.13 0 7.539-3.01 8.085-6.911z"
                        stroke="#F8D371"
                        strokeWidth="2.203"
                    />
                    <path
                        d="M6.972 1h22.056a.55.55 0 0 1 .55.55v2.764H6.422V1.551A.55.55 0 0 1 6.971 1z"
                        fill="#F5B95A"
                    />
                    <rect fill="#F5B95A" height="3.314" rx=".551" width="10.947" x="12.526" y="18.607" />
                    <rect fill="#0061D5" height="8" rx=".551" width="16.632" x="9.789" y="20.3" />
                    <path
                        d="M10.34 20.3h15.53a.55.55 0 0 1 .551.55v7.45H9.79v-7.45a.55.55 0 0 1 .551-.55z"
                        fill="#FC627A"
                    />
                    <path
                        d="M11.603 20.3h12.794a.55.55 0 0 1 .55.55v7.45H11.053v-7.45a.55.55 0 0 1 .55-.55z"
                        fill="#FFF"
                        fillOpacity=".2"
                    />
                    <path d="M15.474 13.221h5.052L18.842 21.3h-1.684z" fill="#F5B95A" />
                    <path
                        d="M14.34 20.3h7.11a.55.55 0 0 1 .55.55v7.45h-8.21v-7.45a.55.55 0 0 1 .55-.55z"
                        fill="#FC627A"
                    />
                    <use fill="#000" filter={`url(#${this.idPrefix}a)`} xlinkHref={`#${this.idPrefix}b`} />
                    <use fill="#F8D371" xlinkHref={`#${this.idPrefix}b`} />
                </g>
            </AccessibleSVG>
        );
    }
}

export default IconTrophyCup;
