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

const IconAdd = ({ className = '', color = '#222', height = 24, title, width = 24 }: Props) => (
    <AccessibleSVG className={`icon-add ${className}`} height={height} title={title} viewBox="0 0 12 12" width={width}>
        <path
            className="fill-color"
            d="M7,5 L11.5,5 C11.7761424,5 12,5.22385763 12,5.5 L12,6.5 C12,6.77614237 11.7761424,7 11.5,7 L7,7 L7,11.5 C7,11.7761424 6.77614237,12 6.5,12 L5.5,12 C5.22385763,12 5,11.7761424 5,11.5 L5,7 L0.5,7 C0.22385763,7 0,6.77614237 0,6.5 L0,5.5 C0,5.22385763 0.22385763,5 0.5,5 L5,5 L5,0.5 C5,0.22385763 5.22385763,0 5.5,0 L6.5,0 C6.77614237,0 7,0.22385763 7,0.5 L7,5 Z"
            fill={color}
            fillRule="evenodd"
        />
    </AccessibleSVG>
);

export default IconAdd;
