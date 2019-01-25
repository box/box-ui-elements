// @flow
import * as React from 'react';

import AccessibleSVG from '../accessible-svg';

type Props = {
    className?: string,
    height?: number,
    /** A text-only string describing the icon if it's not purely decorative for accessibility */
    title?: string | React.Element<any>,
    width?: number,
};

const IconFolderPersonal = ({ className = '', height = 32, title, width = 32 }: Props) => (
    <AccessibleSVG
        className={`icon-folder-personal ${className}`}
        title={title}
        width={width}
        height={height}
        viewBox="0 0 32 32"
    >
        <path
            fill="#EFD289"
            d="M27,25H5c-0.6,0-1-0.4-1-1V8c0-0.6,0.4-1,1-1h8.6L16,9h11c0.6,0,1,0.4,1,1v14C28,24.6,27.6,25,27,25z"
        />
        <path fill="#FDEFC1" d="M26.5,24h-21C5.2,24,5,23.8,5,23.5V12h22v11.6C27,23.8,26.8,24,26.5,24z" />
    </AccessibleSVG>
);

export default IconFolderPersonal;
