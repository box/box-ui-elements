// @flow
import * as React from 'react';
import uniqueId from 'lodash/uniqueId';

import AccessibleSVG from '../accessible-svg';

const ICON_CLASS = 'icon-annotation-highlight';

type Props = {
    className: string,
    height?: number,
    /** A text-only string describing the icon if it's not purely decorative for accessibility */
    title?: string | React.Element<any>,
    width?: number,
};

class IconHighlightAnnotation extends React.Component<Props> {
    static defaultProps = {
        className: '',
        height: 24,
        width: 24,
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
                viewBox="0 0 24 24"
                width={width}
            >
                <g fillRule="evenodd">
                    <path d="M1 23h11.875v-3H1v3zm9.19-9.854l4.103 4.102.694.694.707-.68 7-6.742.306-.295V.07l-1.673 1.524L10.224 11.7l-.775.705.74.74z" />
                    <path d="M11.023 12.17L6.33 16.58C5.28 17.62 5.9 19 7.32 19h3.95c.82 0 1.826-.413 2.406-.995l1.544-1.383.768-.69-.713-.745-2.844-2.976-.683-.717-.723.68v-.003zm-.038 1.42l2.844 2.977.053-1.435-1.584 1.42c-.244.243-.74.446-1.03.446l-2.454-.008 3.577-3.36-1.408-.04z" />
                </g>
            </AccessibleSVG>
        );
    }
}

export default IconHighlightAnnotation;
