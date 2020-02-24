// @flow
import * as React from 'react';
import uniqueId from 'lodash/uniqueId';

import AccessibleSVG from '../accessible-svg';

const ICON_CLASS = 'icon-iwork-keynote';

type Props = {
    className: string,
    height?: number,
    /** A text-only string describing the icon if it's not purely decorative for accessibility */
    title?: string | React.Element<any>,
    width?: number,
};

class IconIWorkKeynote extends React.Component<Props> {
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
                        id={`${this.idPrefix}a`}
                        x1="-1016.86"
                        x2="-1016.84"
                        y1="-1332.01"
                        y2="-1354.15"
                    >
                        <stop offset="0" stopColor="#155ff4" />
                        <stop offset="1" stopColor="#00d4ff" />
                    </linearGradient>
                </defs>
                <path
                    d="M6.88 0h16.24A6.87 6.87 0 0 1 30 6.88v16.24A6.87 6.87 0 0 1 23.12 30H6.88A6.87 6.87 0 0 1 0 23.12V6.88A6.87 6.87 0 0 1 6.88 0z"
                    fill={`url(#${this.idPrefix}a)`}
                />
                <path
                    d="M6.45 14.65c.16.49.36.85.9.85h16c.54 0 .74-.36.9-.85zM19.07 23.56h-2.92a.4.4 0 0 1-.4-.4v-7H15v7a.4.4 0 0 1-.4.4h-3a.41.41 0 0 0-.43.39.41.41 0 0 0 .45.41h7.43a.41.41 0 0 0 .45-.36.41.41 0 0 0-.43-.44zM23.34 7.62a1 1 0 0 0-1-1h-13V5.25a.61.61 0 0 1 .61-.61h2.18a.71.71 0 0 0 .7.67h1.77a.71.71 0 0 0 .7-.71v-.22a.71.71 0 0 0-.7-.71h-1.79a.72.72 0 0 0-.69.57H9.93a1 1 0 0 0-1 1v1.37h-.66a1 1 0 0 0-1 1L7 14h16.7z"
                    fill="#fff"
                />
            </AccessibleSVG>
        );
    }
}

export default IconIWorkKeynote;
