// @flow
import * as React from 'react';
import classNames from 'classnames';

import AccessibleSVG from '../../../icons/accessible-svg';

type Props = {
    className?: string,
    color?: string,
    /** A text-only string describing the icon if it's not purely decorative for accessibility */
    selected?: boolean,
    title?: string | React.Element<any>,
    width?: number,
};

const iconName = 'icon-admin-console';

const IconAdminConsole = ({ className = '', color = '#c4c4c4', title, width = 14, selected = false }: Props) => (
    <AccessibleSVG
        className={classNames(iconName, className, {
            'is-selected': selected,
        })}
        title={title}
        viewBox="0 0 14 16"
        width={width}
    >
        <path
            className="fill-color"
            color={color}
            d="M12.8 13.6c.6 0 1.2.5 1.2 1s-.5 1.1-1.2 1.1H1.1c-.6 0-1.2-.5-1.2-1.1s.5-1 1.2-1h11.7zM1.6 12.1c-.9 0-1.6-.7-1.6-1.5V6.9c0-.8.7-1.5 1.6-1.5.9 0 1.6.7 1.6 1.5v3.7c-.1.8-.8 1.5-1.6 1.5zm7-1.5c0 .8-.7 1.5-1.6 1.5s-1.6-.7-1.6-1.5V4.7c0-.8.7-1.5 1.6-1.5s1.6.7 1.6 1.5v5.9zM12.4.3c.9 0 1.6.7 1.6 1.5v8.8c0 .8-.7 1.5-1.6 1.5-.9 0-1.6-.7-1.6-1.5V1.8c.1-.8.8-1.5 1.6-1.5z"
            fill={selected ? color : undefined}
        />
    </AccessibleSVG>
);

export default IconAdminConsole;
