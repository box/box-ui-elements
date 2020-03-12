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

const ICON_CLASS = 'folder-request-illustration';

class FolderCircleIllustration extends React.PureComponent<Props> {
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
                viewBox="0 0 140 140"
                width={width}
            >
                <defs>
                    <rect height={30} id="b" rx={15} width={30} />
                    <filter filterUnits="objectBoundingBox" height="420%" id="a" width="420%" x="-160%" y="-150%">
                        <feOffset dy={1} in="SourceAlpha" result="shadowOffsetOuter1" />
                        <feGaussianBlur in="shadowOffsetOuter1" result="shadowBlurOuter1" stdDeviation="2.5" />
                        <feColorMatrix
                            in="shadowBlurOuter1"
                            result="shadowMatrixOuter1"
                            values="0 0 0 0 0 0 0 0 0 0.380392157 0 0 0 0 0.839215686 0 0 0 0.1 0"
                        />
                        <feOffset in="SourceAlpha" result="shadowOffsetOuter2" />
                        <feGaussianBlur in="shadowOffsetOuter2" result="shadowBlurOuter2" stdDeviation={4} />
                        <feColorMatrix
                            in="shadowBlurOuter2"
                            result="shadowMatrixOuter2"
                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.04 0"
                        />
                        <feOffset in="SourceAlpha" result="shadowOffsetOuter3" />
                        <feGaussianBlur in="shadowOffsetOuter3" result="shadowBlurOuter3" stdDeviation={8} />
                        <feColorMatrix
                            in="shadowBlurOuter3"
                            result="shadowMatrixOuter3"
                            values="0 0 0 0 0 0 0 0 0 0.380392157 0 0 0 0 0.839215686 0 0 0 0.05 0"
                        />
                        <feOffset dy={2} in="SourceAlpha" result="shadowOffsetOuter4" />
                        <feGaussianBlur in="shadowOffsetOuter4" result="shadowBlurOuter4" stdDeviation="5.5" />
                        <feColorMatrix
                            in="shadowBlurOuter4"
                            result="shadowMatrixOuter4"
                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.02 0"
                        />
                        <feMerge>
                            <feMergeNode in="shadowMatrixOuter1" />
                            <feMergeNode in="shadowMatrixOuter2" />
                            <feMergeNode in="shadowMatrixOuter3" />
                            <feMergeNode in="shadowMatrixOuter4" />
                        </feMerge>
                    </filter>
                </defs>
                <g fill="none" fillRule="evenodd">
                    <circle cx={70} cy={70} fill="#5FC9CF" r={60} />
                    <path
                        d="M61.616 45.983c.211.302.553.483.918.485h40.335A1.14 1.14 0 0 1 104 47.615v44.238A1.14 1.14 0 0 1 102.869 93H37.13A1.14 1.14 0 0 1 36 91.853V42.147A1.14 1.14 0 0 1 37.131 41h20.463c.379.01.728.21.93.535l3.092 4.448z"
                        fill="#0061D5"
                        fillRule="nonzero"
                    />
                    <g transform="translate(77.4 71)">
                        <use fill="#000" filter="url(#a)" xlinkHref="#b" />
                        <use fill="#F7D271" xlinkHref="#b" />
                    </g>
                    <g stroke="#F9F9F9" strokeWidth=".6" transform="translate(84.4 80)">
                        <circle cx="1.98" cy="1.98" r="1.98" />
                        <path d="M3.96 1.98h11.52v2.88m-3.42-2.88v2.16" strokeLinecap="square" />
                    </g>
                    <g stroke="#F9F9F9" strokeWidth=".6" transform="rotate(180 49.94 46.02)">
                        <circle cx="1.98" cy="1.98" r="1.98" />
                        <path d="M3.96 1.98h11.52v2.88m-3.42-2.88v2.16" strokeLinecap="square" />
                    </g>
                    <g transform="translate(46 56)">
                        <rect fill="#FFF" height={28} opacity=".24" rx={14} width={28} />
                        <g stroke="#FFF" strokeWidth=".6">
                            <path d="M12.7 10a2.7 2.7 0 1 0-5.4 0 2.7 2.7 0 0 0 5.4 0z" />
                            <path
                                d="M14.152 16.09C14.665 14.31 16.417 13 18.5 13c2.485 0 4.5 1.865 4.5 4.167 0 .048-.001 2.784-.003 2.833m-17.992.4C5.002 20.33 5 18.833 5 18.762 5 16.132 7.239 14 10 14s5 2.132 5 4.762c0 .056-.001 1.583-.003 1.638"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path d="M20.7 9.5a2.2 2.2 0 1 0-4.4 0 2.2 2.2 0 0 0 4.4 0z" />
                        </g>
                    </g>
                    <path
                        d="M62.603-13.592a.993.993 0 0 0 .81.429h35.589c.551 0 .998.454.998 1.015v39.133c0 .56-.447 1.015-.998 1.015H40.998c-.551 0-.998-.454-.998-1.015v-43.97c0-.56.447-1.015.998-1.015h18.056a.995.995 0 0 1 .82.473l2.729 3.935zm0 124a.993.993 0 0 0 .81.429h35.589c.551 0 .998.454.998 1.014v39.134c0 .56-.447 1.015-.998 1.015H40.998c-.551 0-.998-.454-.998-1.015v-43.97c0-.56.447-1.015.998-1.015h18.056a.995.995 0 0 1 .82.473l2.729 3.935z"
                        fill="#FFF"
                        fillRule="nonzero"
                        opacity=".24"
                    />
                </g>
            </AccessibleSVG>
        );
    }
}

export default FolderCircleIllustration;
