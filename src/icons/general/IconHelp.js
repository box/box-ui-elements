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

const IconHelp = ({ className = '', color = '#000', height = 16, title, width = 16 }: Props) => (
    <AccessibleSVG className={`icon-help ${className}`} title={title} width={width} height={height} viewBox="0 0 64 64">
        <path
            className="fill-color"
            fill={color}
            d="M32 0C14.2 0 0 14.2 0 32s14.2 32 32 32 32-14.2 32-32S49.8 0 32 0zm0 56.9c-13.9 0-24.9-11-24.9-24.9S18.1 7.1 32 7.1s24.9 11 24.9 24.9-11 24.9-24.9 24.9z"
        />
        <path
            className="fill-color"
            fill={color}
            d="M23.7 17.2c.6-.5 1.2-1 1.9-1.4.7-.5 1.4-.9 2.2-1.2.8-.3 1.7-.6 2.6-.8.9-.2 1.9-.3 3-.3 1.5 0 2.8.2 4 .6 1.2.4 2.2 1 3.1 1.7.9.7 1.5 1.7 2 2.7.5 1.1.7 2.2.7 3.6 0 1.3-.2 2.4-.6 3.3-.4.9-.8 1.7-1.4 2.4-.6.7-1.2 1.3-1.8 1.8-.7.5-1.3 1-1.9 1.4-.6.4-1.1.9-1.5 1.3-.4.4-.7.9-.8 1.5l-.6 3.7h-4.3l-.4-4.1c-.1-.8 0-1.5.3-2.1.3-.6.8-1.1 1.3-1.6s1.2-1 1.8-1.4c.7-.5 1.3-1 1.9-1.5.6-.5 1.1-1.2 1.5-1.8.4-.7.6-1.5.6-2.4 0-.6-.1-1.1-.3-1.6-.2-.5-.5-.9-.9-1.2-.4-.3-.9-.6-1.5-.8-.6-.2-1.2-.3-1.8-.3-1 0-1.8.1-2.4.3-.7.2-1.2.4-1.7.7-.5.3-.9.5-1.2.7-.3.2-.6.3-.9.3-.6 0-1-.3-1.3-.8l-1.6-2.7zM28.5 47c0-.5.1-1 .3-1.5.2-.5.5-.9.8-1.2.3-.3.7-.6 1.2-.8.5-.2 1-.3 1.5-.3s1 .1 1.5.3c.5.2.9.5 1.2.8.3.3.6.7.8 1.2.2.5.3 1 .3 1.5s-.1 1-.3 1.5c-.2.5-.5.9-.8 1.2-.3.3-.7.6-1.2.8-.5.2-1 .3-1.5.3s-1-.1-1.5-.3c-.5-.2-.9-.5-1.2-.8-.3-.3-.6-.7-.8-1.2-.2-.5-.3-1-.3-1.5z"
        />
    </AccessibleSVG>
);

export default IconHelp;
