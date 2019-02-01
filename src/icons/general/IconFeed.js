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

const IconFeed = ({ className = '', color = '#979797', height = 14, title, width = 14 }: Props) => (
    <AccessibleSVG className={`icon-feed ${className}`} height={height} title={title} viewBox="0 0 14 14" width={width}>
        <path
            className="stroke-color"
            d="M1 .5a.5.5 0 0 0-.5.5v5a.5.5 0 0 0 .5.5h12a.5.5 0 0 0 .5-.5V1a.5.5 0 0 0-.5-.5H1zm-.25 9a.25.25 0 1 0 0 .5h12.5a.25.25 0 1 0 0-.5H.75zm0 2.833a.25.25 0 1 0 0 .5h12.5a.25.25 0 1 0 0-.5H.75z"
            fill="none"
            fillRule="evenodd"
            stroke={color}
        />
    </AccessibleSVG>
);

export default IconFeed;
