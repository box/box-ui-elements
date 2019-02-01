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

const IconPlay = ({ className = '', color = '#000000', height = 24, title, width = 24 }: Props) => (
    <AccessibleSVG className={`icon-play ${className}`} height={height} title={title} viewBox="0 0 24 24" width={width}>
        <path className="fill-color" d="M8 5v14l11-7z" fill={color} />
        <path d="M0 0h24v24H0z" fill="none" />
    </AccessibleSVG>
);

export default IconPlay;
