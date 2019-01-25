// @flow
import * as React from 'react';
import uniqueId from 'lodash/uniqueId';

import AccessibleSVG from '../accessible-svg';

const ICON_CLASS = 'icon-annotation-highlight-comment';

type Props = {
    className: string,
    height?: number,
    /** A text-only string describing the icon if it's not purely decorative for accessibility */
    title?: string | React.Element<any>,
    width?: number,
};

class IconHighlightCommentAnnotation extends React.Component<Props> {
    static defaultProps = {
        className: '',
        height: 20,
        width: 20,
    };

    idPrefix = `${uniqueId(ICON_CLASS)}-`;

    render() {
        const { className, height, title, width } = this.props;
        return (
            <AccessibleSVG
                className={`${ICON_CLASS} ${className}`}
                focusable={false}
                height={height}
                title={title}
                viewBox="0 0 20 20"
                width={width}
            >
                <g fill="none" fillRule="evenodd">
                    <path d="M-2-2h24v24H-2" />
                    <path
                        className="icon"
                        d="M18 0H2C.9 0 .01.9.01 2L0 20l4-4h14c1.1 0 2-.9 2-2V2c0-1.1-.9-2-2-2zM4 7h10v2H4V7zm8 5H4v-2h8v2zm4-6H4V4h12v2z"
                        fill="#000"
                    />
                </g>
            </AccessibleSVG>
        );
    }
}

export default IconHighlightCommentAnnotation;
