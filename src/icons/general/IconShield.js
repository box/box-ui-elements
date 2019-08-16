// @flow
import * as React from 'react';

import classNames from 'classnames';
import AccessibleSVG from '../accessible-svg';
import { bdlBoxBlue, white } from '../../styles/variables';

type Props = {
    className?: string,
    color?: string,
    height?: number,
    opacity?: number,
    /** A text-only string describing the icon if it's not purely decorative for accessibility */
    title?: string | React.Element<any>,
    width?: number,
};

const IconShield = ({ className, color = bdlBoxBlue, height = 32, opacity = 0.2, width = 32, title }: Props) => (
    <AccessibleSVG
        className={classNames('bdl-IconShield', className)}
        height={height}
        title={title}
        viewBox="0 0 32 32"
        width={width}
    >
        <path
            className="stroke-color"
            fill={white}
            stroke={color}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M3 3.308S9.5 6.962 16 1c6.5 5.962 13 2.308 13 2.308v20.48L16 31 3 23.788V3.308z"
        />
        <path className="fill-color" fill={color} fillOpacity={opacity} d="M16 5C10.5 8.5 6 7 6 7v14.712L16 27V5z" />
        <path
            className="stroke-color"
            stroke={color}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M25 10v11"
        />
    </AccessibleSVG>
);

export default IconShield;
