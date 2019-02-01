// @flow
import * as React from 'react';
import uniqueId from 'lodash/uniqueId';

import AccessibleSVG from '../accessible-svg';

const ICON_CLASS = 'icon-excel-desktop';

type Props = {
    className: string,
    height?: number,
    /** A text-only string describing the icon if it's not purely decorative for accessibility */
    title?: string | React.Element<any>,
    width?: number,
};

class IconExcelDesktop extends React.Component<Props> {
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
                    clipRule="evenodd"
                    d="M45 80.5c-.8 0-1.5-.7-1.5-1.5V16c0-.8.7-1.5 1.5-1.5h44c.8 0 1.5.7 1.5 1.5v63c0 .8-.7 1.5-1.5 1.5H45z"
                    fill="#FFF"
                    fillRule="evenodd"
                />
                <path
                    d="M89 16v63H45V16h44m0-3H45c-1.7 0-3 1.3-3 3v63c0 1.7 1.3 3 3 3h44c1.7 0 3-1.3 3-3V16c0-1.7-1.3-3-3-3z"
                    fill="#217346"
                />
                <path
                    clipRule="evenodd"
                    d="M68 22h14v7H68zm-18 0h14v7H50zm18 11h14v7H68zm-18 0h14v7H50zm18 33h14v7H68zm-18 0h14v7H50zm18-22h14v7H68zm-18 0h14v7H50zm18 11h14v7H68zm-18 0h14v7H50z"
                    fill="#217346"
                    fillRule="evenodd"
                />
                <path clipRule="evenodd" d="M56 4L4 13v70l52 9V4z" fill="#217346" fillRule="evenodd" />
                <g opacity=".05">
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
                    d="M40.5 31l-6.8.4-4.1 9.7-.3.9c-.1.3-.2.5-.2.8-.1.2-.1.4-.2.6-.1.2-.1.4-.1.5h-.1c-.1-.3-.1-.5-.2-.7-.1-.2-.1-.5-.2-.7-.1-.2-.1-.4-.2-.6-.1-.2-.1-.4-.2-.6L24.3 32l-6.6.4 7 15.2-7.6 15.2 6.4.4 4.3-9.9c.1-.2.1-.5.2-.7.1-.2.1-.4.2-.6 0-.2.1-.4.1-.5 0-.2.1-.3.1-.4h.1c0 .3.1.5.1.7 0 .2.1.4.1.6 0 .2.1.3.1.5 0 .1.1.2.1.3l4.5 10.6 7.3.4-8.3-16.7L40.5 31"
                    fill="#FFF"
                />
            </AccessibleSVG>
        );
    }
}

export default IconExcelDesktop;
