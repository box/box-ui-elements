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

const iconName = 'icon-relay';

const IconRelay = ({ className = '', color = '#c4c4c4', title, width = 14, selected = false }: Props) => (
    <AccessibleSVG
        className={classNames(iconName, className, {
            'is-selected': selected,
        })}
        title={title}
        viewBox="0 0 14 14"
        width={width}
    >
        <path
            className="fill-color"
            color={color}
            d="M14 2.8H9.8V1.4H2.1v-.3C2.1.5 1.6 0 1 0S0 .5 0 1.1V13c0 .6.5 1.1 1.1 1.1s1.1-.5 1.1-1.1V8.4h5.5l-.6 1.4h7l-1.4-3.5L14 2.8z"
            fill={selected ? color : undefined}
        />
    </AccessibleSVG>
);

export default IconRelay;
