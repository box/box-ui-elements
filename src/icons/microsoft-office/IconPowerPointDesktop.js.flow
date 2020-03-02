// @flow
import * as React from 'react';
import uniqueId from 'lodash/uniqueId';

import AccessibleSVG from '../accessible-svg';

const ICON_CLASS = 'icon-powerpoint-desktop';

type Props = {
    className: string,
    height?: number,
    /** A text-only string describing the icon if it's not purely decorative for accessibility */
    title?: string | React.Element<any>,
    width?: number,
};

class IconPowerPointDesktop extends React.Component<Props> {
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
                viewBox="0 0 96 96"
                width={width}
            >
                <path
                    d="M90 78.5c0 .8-.7 1.5-1.5 1.5h-48c-.8 0-1.5-.7-1.5-1.5v-61c0-.8.7-1.5 1.5-1.5h48c.8 0 1.5.7 1.5 1.5v61z"
                    fill="#FFF"
                />
                <path
                    d="M89 17v61H41V17h48m0-3H41c-1.7 0-3 1.3-3 3v61c0 1.7 1.3 3 3 3h48c1.7 0 3-1.3 3-3V17c0-1.7-1.3-3-3-3z"
                    fill="#D24726"
                />
                <g clipRule="evenodd" fill="#C1442B" fillRule="evenodd">
                    <path d="M61 26c-7.2 0-13 5.8-13 13s5.8 13 13 13 13-5.8 13-13H61V26z" />
                    <path d="M63 24v13h13c0-7.2-5.8-13-13-13zM49 57h31v4H49zm1 9h30v4H50z" />
                </g>
                <path clipRule="evenodd" d="M56 4L4 13v70l52 9V4z" fill="#C1442B" fillRule="evenodd" />
                <g opacity="0.05">
                    <linearGradient
                        gradientUnits="userSpaceOnUse"
                        id={`${this.idPrefix}a`}
                        x1="4"
                        x2="56"
                        y1="48"
                        y2="48"
                    >
                        <stop offset="0" stopColor="#FFF" />
                        <stop offset="1" />
                    </linearGradient>
                    <path
                        clipRule="evenodd"
                        d="M56 4L4 13v70l52 9V4z"
                        fill={`url(#${this.idPrefix}a)`}
                        fillRule="evenodd"
                    />
                </g>
                <path
                    d="M26 46.5V37l1.9-.3c.8 0 1.5 0 2 .2.6.2 1.1.5 1.5.9.4.4.7.9.9 1.6.2.6.3 1.4.3 2.2 0 .9-.1 1.6-.3 2.3-.2.7-.5 1.2-.9 1.6-.4.4-.9.8-1.5 1-.6.2-1.3.3-2 .3l-1.9-.3M29 31l-9 .5v31.9l6 .5V52.2l2.3.2c.8 0 1.6 0 2.3-.2.7-.1 1.4-.3 2.1-.6.7-.3 1.3-.6 1.9-1 .6-.4 1.1-.9 1.6-1.4.5-.5.9-1.1 1.3-1.7.4-.6.7-1.2.9-1.9.2-.7.4-1.4.5-2.2.1-.8.2-1.6.2-2.4 0-1.8-.2-3.4-.7-4.7-.4-1.3-1.1-2.4-2-3.3-.9-.8-1.9-1.4-3.2-1.8C32 31 31 31 29 31"
                    fill="#FFF"
                />
            </AccessibleSVG>
        );
    }
}

export default IconPowerPointDesktop;
