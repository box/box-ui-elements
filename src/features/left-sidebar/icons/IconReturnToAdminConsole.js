// @flow
import * as React from 'react';

import AccessibleSVG from '../../../icons/accessible-svg';

type Props = {
    className?: string,
    color?: string,
    /** A text-only string describing the icon if it's not purely decorative for accessibility */
    title?: string | React.Element<any>,
    width?: number,
};

const iconName = 'icon-return-to-admin-console';

const IconReturnToAdminConsole = ({ className = '', color = '#c4c4c4', title, width = 14 }: Props) => (
    <AccessibleSVG className={`${iconName} ${className}`} title={title} viewBox="0 0 14 14" width={width}>
        <path
            className="fill-color"
            d="M11.9 14H2.1C.9 14 0 13.1 0 11.9V2.1C0 .9.9 0 2.1 0h9.8c1.2 0 2.1.9 2.1 2.1v9.8c0 1.2-.9 2.1-2.1 2.1zM8.2 4.1L7.1 3 3 7l4.1 4 1.1-1.1-2.1-2.1H14V6.2H6.1l2.1-2.1z"
            fill={color}
        />
    </AccessibleSVG>
);

export default IconReturnToAdminConsole;
