import * as React from 'react';
import uniqueId from 'lodash/uniqueId';

import AccessibleSVG from '../accessible-svg';

import { TwoTonedIcon } from '../iconTypes';

const ICON_CLASS = 'icon-box-tools-install';

class IconBoxToolsInstall extends React.Component<TwoTonedIcon> {
    static defaultProps = {
        className: '',
        height: 131,
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
                viewBox="0 0 200 131"
                width={width}
            >
                <defs>
                    <rect height="68.9" id={`${this.idPrefix}a`} rx="15.9" width="68.9" />
                </defs>
                <g fill="none" fillRule="evenodd">
                    <path
                        d="M1.6 119.7c.8 5.1 5.2 9 10.5 9H188c5.3 0 9.7-3.9 10.5-9h-9V5c0-2-1.6-3.5-3.5-3.5H14.1c-2 0-3.5 1.6-3.5 3.5v114.7h-9zM18.2 12.1h165.1v101.5H18.2V12.1z"
                        stroke="#0061D5"
                        strokeWidth="3"
                    />
                    <g fill="#0061D5" transform="translate(90.4 4.5)">
                        <circle cx="1.6" cy="2.5" r="1.5" />
                        <rect height="3" rx="1.5" width="15.2" x="4.1" y="1" />
                    </g>
                    <path
                        d="M10.6 119.7h83.7c0 1.4.8 2 2.3 2h10.8c1 0 1.5-.6 1.5-2h80.5"
                        stroke="#0061D5"
                        strokeLinecap="square"
                        strokeWidth="3"
                    />
                    <g transform="translate(62.1 28.5)">
                        <use fill="#0065E3" xlinkHref={`#${this.idPrefix}a`} />
                        <rect
                            height="70.2"
                            rx="15.9"
                            stroke="#C3D1D9"
                            strokeOpacity=".2"
                            strokeWidth="1.3"
                            width="70.2"
                            x="-.7"
                            y="-.7"
                        />
                    </g>
                    <path
                        d="M97.3 63a5 5 0 0 1-4.9-5 5 5 0 0 1 5-5 5 5 0 0 1 4.8 5 5 5 0 0 1-4.9 5M83 63a5 5 0 0 1-5-5 5 5 0 0 1 5-5 5 5 0 0 1 4.9 5 5 5 0 0 1-5 5m14.5-13.4c4.5 0 8.2 3.7 8.2 8.4 0 4.6-3.7 8.4-8.2 8.4a8.1 8.1 0 0 1-7.2-4.5 8.1 8.1 0 0 1-7.2 4.5 8.3 8.3 0 0 1-8.2-8.3v-14c0-.9.7-1.6 1.6-1.6 1 0 1.6.7 1.7 1.6v7.1A8 8 0 0 1 90 54c1.5-2.6 4.2-4.4 7.3-4.4zm20.9 14c.5.7.4 1.7-.4 2.3-.8.5-1.9.4-2.5-.3l-3.8-4.8-3.8 4.8c-.6.7-1.7.8-2.5.3-.8-.6-1-1.6-.4-2.3l4.5-5.6-4.5-5.7c-.5-.7-.4-1.7.4-2.3.8-.5 1.9-.4 2.5.3l3.8 4.8 3.8-4.8c.6-.7 1.7-.8 2.5-.3.8.6 1 1.6.4 2.3l-4.5 5.7 4.5 5.6z"
                        fill="#FFFFFE"
                    />
                    <text
                        fill="#FFF"
                        fontFamily="Lato-Regular, Lato"
                        fontSize="13.2"
                        letterSpacing=".5"
                        transform="translate(74.6 42.5)"
                    >
                        <tspan x=".1" y="39.4">
                            TOOLS
                        </tspan>
                    </text>
                    <g transform="translate(117.2 22.7)">
                        <circle cx="10.3" cy="10.3" fill="#26C281" r="10.3" stroke="#F5F7F9" strokeWidth="1.1" />
                        <path
                            d="M10.5 15.2l3.4-3.8a.3.3 0 0 0-.2-.5h-2V6.6c0-.2-.2-.3-.3-.3H9.3c-.2 0-.3.1-.3.3v4.3H7a.3.3 0 0 0-.3.5l3.4 3.8a.3.3 0 0 0 .4 0z"
                            fill="#FFF"
                            fillRule="nonzero"
                        />
                    </g>
                </g>
            </AccessibleSVG>
        );
    }
}

export default IconBoxToolsInstall;
