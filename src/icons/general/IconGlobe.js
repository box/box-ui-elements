// @flow
import * as React from 'react';

import AccessibleSVG from '../accessible-svg';
import { bdlNeutral03 } from '../../styles/variables';

type Props = {
    className?: string,
    color?: string,
    height?: number,
    /** A text-only string describing the icon if it's not purely decorative for accessibility */
    title?: string | React.Element<any>,
    width?: number,
};

const IconGlobe = ({ className = '', color = bdlNeutral03, height = 16, title, width = 16 }: Props) => (
    <AccessibleSVG
        className={`icon-globe ${className}`}
        height={height}
        title={title}
        viewBox="0 0 16 16"
        width={width}
    >
        <path
            d="M8 0C3.57 0 0 3.57 0 8s3.57 8 8 8 8-3.57 8-8-3.57-8-8-8zm-.862 14.4C4.062 13.908 1.6 11.323 1.6 8c0-.492.123-.985.123-1.477l3.815 3.815v.862c0 .862.739 1.6 1.6 1.6v1.6zm5.539-2.092c-.246-.616-.862-1.108-1.477-1.108h-.862V8.738c0-.369-.246-.738-.738-.738H4.8V6.4h1.6c.492 0 .862-.37.862-.862V4.062h1.6c.861 0 1.6-.739 1.6-1.6v-.37C12.8 3.077 14.4 5.292 14.4 8c0 1.723-.615 3.2-1.723 4.308z"
            fill={color}
        />
    </AccessibleSVG>
);

export default IconGlobe;
