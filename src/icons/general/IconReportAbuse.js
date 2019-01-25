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

const IconReportAbuse = ({ className = '', color = '#444', height = 14, title, width = 14 }: Props) => (
    <AccessibleSVG
        className={`icon-report-abuse ${className}`}
        title={title}
        width={width}
        height={height}
        viewBox="0 0 14 14"
    >
        <g fill="none" fillRule="evenodd">
            <path
                className="fill-color"
                stroke={color}
                d="M2.4413 10.3319l.1816.1567-.1001 2.7904a.2368.2368 0 0 0 .3386.2223l3.6977-1.7633.2152-.0487h1.131c3.0899 0 5.5947-2.5048 5.5947-5.5946C13.5 3.0048 10.9952.5 7.9053.5H6.0947C3.0048.5.5 3.0048.5 6.0947c0 1.6489.7168 3.1804 1.9413 4.2372z"
            />
            <path
                className="fill-color"
                fill={color}
                d="M6.5 3.0086c0-.2809.232-.5086.5-.5086.2761 0 .5.223.5.5086v3.1309c0 .281-.232.5086-.5.5086-.2761 0-.5-.223-.5-.5086V3.0086zm0 5.1725c0-.2739.232-.496.5-.496.2761 0 .5.2226.5.496v.823c0 .2739-.232.4959-.5.4959-.2761 0-.5-.2225-.5-.496v-.823z"
            />
        </g>
    </AccessibleSVG>
);

export default IconReportAbuse;
