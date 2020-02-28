// @flow
import * as React from 'react';
import uniqueId from 'lodash/uniqueId';

import AccessibleSVG from '../accessible-svg';

const ICON_CLASS = 'unknown-user-avatar';

type Props = {
    className: string,
    height?: number,
    /** A text-only string describing the icon if it's not purely decorative for accessibility */
    title?: string | React.Element<any>,
    width?: number,
};

class UnknownUserAvatar extends React.PureComponent<Props> {
    static defaultProps = {
        className: '',
        height: 28,
        width: 28,
    };

    idPrefix = `${uniqueId(ICON_CLASS)}-`;

    render() {
        const { className, height, title, width } = this.props;
        return (
            <AccessibleSVG
                className={`${ICON_CLASS} ${className}`}
                height={height}
                title={title}
                viewBox="0 0 28 28"
                width={width}
            >
                <defs>
                    <circle cx="14" cy="14" id={`${this.idPrefix}a`} r="14" />
                </defs>
                <g fill="none" fillRule="evenodd">
                    <use className="background-fill-color" fill="#EDEDED" xlinkHref={`#${this.idPrefix}a`} />
                    <path
                        className="fill-color"
                        d="M5.5 25.1C6.7 21 10 18 14 18s7.3 3 8.5 7.1a14 14 0 0 1-17 0zM14 16a5 5 0 1 1 0-10 5 5 0 0 1 0 10z"
                        fill="#C3C3C3"
                    />
                </g>
            </AccessibleSVG>
        );
    }
}

export default UnknownUserAvatar;
