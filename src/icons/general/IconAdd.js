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

const IconAdd = ({ className = '', color = '#000000', height = 24, title, width = 24 }: Props) => (
    <AccessibleSVG className={`icon-add ${className}`} height={height} title={title} viewBox="0 0 16 16" width={width}>
        <path
            className="fill-color"
            d="M9,7 L13.5,7 C13.7761424,7 14,7.22385763 14,7.5 L14,8.5 C14,8.77614237 13.7761424,9 13.5,9 L9,9 L9,13.5 C9,13.7761424 8.77614237,14 8.5,14 L7.5,14 C7.22385763,14 7,13.7761424 7,13.5 L7,9 L2.5,9 C2.22385763,9 2,8.77614237 2,8.5 L2,7.5 C2,7.22385763 2.22385763,7 2.5,7 L7,7 L7,2.5 C7,2.22385763 7.22385763,2 7.5,2 L8.5,2 C8.77614237,2 9,2.22385763 9,2.5 L9,7 Z"
            fill={color}
            fillRule="evenodd"
        />
    </AccessibleSVG>
);

export default IconAdd;
