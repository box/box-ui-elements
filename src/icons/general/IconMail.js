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

const IconMail = ({ className = '', color = '#444444', height = 11, title, width = 14 }: Props) => (
    <AccessibleSVG className={`icon-mail ${className}`} height={height} title={title} viewBox="0 0 14 11" width={width}>
        <path
            className="fill-color"
            d="M13 0H1C.4 0 0 .4 0 1v9c0 .6.5 1 1 1h12c.6 0 1-.4 1-1V1c0-.6-.5-1-1-1zM7 5.5L1.8 1h10.5L7 5.5zM1 1zm12 9H1V1.7l5.7 4.8.3.3.3-.3L13 1.7V10z"
            fill={color}
        />
    </AccessibleSVG>
);

export default IconMail;
