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

const IconGlobe = ({ className = '', color = '#000', height = 16, title, width = 16 }: Props) => (
    <AccessibleSVG
        className={`icon-globe ${className}`}
        height={height}
        title={title}
        viewBox="0 0 16 16"
        width={width}
    >
        <circle className="fill-color" cx="8" cy="8" r="8" fill={color} />
        <path
            fill="#FFF"
            d="M8 1.5C4.4 1.5 1.5 4.4 1.5 8s2.9 6.5 6.5 6.5 6.5-2.9 6.5-6.5S11.6 1.5 8 1.5zm-.7 11.7c-2.5-.4-4.5-2.5-4.5-5.2 0-.4.1-.8.1-1.2L6 9.9v.7c0 .7.6 1.3 1.3 1.3v1.3zm4.5-1.7c-.2-.5-.7-.9-1.2-.9h-.7v-2c0-.3-.2-.6-.6-.6H5.4V6.7h1.3c.4 0 .7-.3.7-.7V4.8h1.3c.7 0 1.3-.6 1.3-1.3v-.3c1.9.8 3.2 2.6 3.2 4.8 0 1.4-.5 2.6-1.4 3.5z"
        />
    </AccessibleSVG>
);

export default IconGlobe;
