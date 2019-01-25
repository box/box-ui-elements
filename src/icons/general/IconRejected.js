// @flow
import * as React from 'react';

import AccessibleSVG from '../accessible-svg';

type Props = {
    className?: string,
    color?: string,
    height?: number,
    /** A text-only string describing the icon if it's not purely decorative for accessibility */
    title?: string | React.Element<any>,
    width?: number,
};

const IconRejected = ({ className = '', color = '#ED3757', height = 18, title, width = 18 }: Props) => (
    <AccessibleSVG
        className={`icon-rejected ${className}`}
        title={title}
        width={width}
        height={height}
        viewBox="0 0 18 18"
    >
        <g fill="none" fillRule="evenodd">
            <circle fill={color} cx={9} cy={9} r={9} />
            <path
                fill="#FFF"
                fillRule="nonzero"
                d="M9 7.586l2.828-2.829 1.415 1.415L10.414 9l2.829 2.828-1.415 1.415L9 10.414l-2.828 2.829-1.415-1.415L7.586 9 4.757 6.172l1.415-1.415z"
            />
        </g>
    </AccessibleSVG>
);

export default IconRejected;
