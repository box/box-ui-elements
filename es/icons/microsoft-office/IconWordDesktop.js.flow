// @flow
import * as React from 'react';
import uniqueId from 'lodash/uniqueId';

import AccessibleSVG from '../accessible-svg';

const ICON_CLASS = 'icon-word-desktop';

type Props = {
    className: string,
    height?: number,
    /** A text-only string describing the icon if it's not purely decorative for accessibility */
    title?: string | React.Element<any>,
    width?: number,
};

class IconWordDesktop extends React.Component<Props> {
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
                    d="M47 81.5c-.8 0-1.5-.7-1.5-1.5V16c0-.8.7-1.5 1.5-1.5h42c.8 0 1.5.7 1.5 1.5v64c0 .8-.7 1.5-1.5 1.5H47z"
                    fill="#FFF"
                />
                <path
                    d="M89 16v64H47V16h42m0-3H47c-1.7 0-3 1.3-3 3v64c0 1.7 1.3 3 3 3h42c1.7 0 3-1.3 3-3V16c0-1.7-1.3-3-3-3z"
                    fill="#2B579A"
                />
                <path
                    d="M50 23h32v4H50zm0 9h32v4H50zm0 9h32v4H50zm0 9h32v4H50zm0 9h32v4H50zm0 9h32v4H50z"
                    fill="#2B579A"
                />
                <path clipRule="evenodd" d="M56 4L4 13v70l52 9V4z" fill="#2B579A" fillRule="evenodd" />
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
                    d="M43.6 32.7L38 33l-3.3 19.3c0 .3-.1.5-.1.8 0 .3-.1.5-.1.8 0 .3-.1.5-.1.8v.8h-.1c0-.3-.1-.7-.1-1 0-.3-.1-.6-.1-.8 0-.3-.1-.5-.1-.7 0-.2-.1-.4-.1-.6l-3.8-18.9-5.3.3-3.9 18.1c-.1.3-.1.5-.2.8 0 .3-.1.5-.1.8 0 .3-.1.5-.1.8v.7h-.1v-.9c0-.3 0-.6-.1-.8 0-.3 0-.5-.1-.7 0-.2-.1-.4-.1-.6l-2.9-17.6-4.9.3 5.2 26.1 5.4.3 3.7-17.5c0-.2.1-.4.1-.7 0-.2.1-.5.1-.7 0-.3.1-.5.1-.8 0-.3.1-.6.1-.9h.1v.9c0 .3 0 .5.1.8 0 .3.1.5.1.7 0 .2.1.5.1.7l3.7 18 5.9.4 6.6-29.3"
                    fill="#FFF"
                />
            </AccessibleSVG>
        );
    }
}

export default IconWordDesktop;
