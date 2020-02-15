// @flow
import * as React from 'react';
import classNames from 'classnames';

import AccessibleSVG from '../accessible-svg';
import { bdlGray, bdlGray20 } from '../../styles/variables';

type Props = {
    className?: string,
    color?: string,
    fillColor?: string,
    height?: number,
    strokeColor?: string,
    /** A text-only string describing the icon if it's not purely decorative for accessibility */
    title?: string | React.Element<any>,
    width?: number,
};

const IconSecurityClassificationSolid = ({
    className = '',
    fillColor = bdlGray20,
    height = 13,
    strokeColor = bdlGray,
    title,
    width = 13,
}: Props) => {
    const classes = classNames('bdl-IconSecurityClassificationSolid', className);

    return (
        <AccessibleSVG className={classes} height={height} title={title} viewBox="0 0 10 13" width={width}>
            <g stroke={strokeColor} fill="none" fillRule="evenodd">
                <path
                    fill={fillColor}
                    d="M9.5 6.545a6.413 6.413 0 0 1-1.244 3.765c-.782 1.068-1.88 1.863-3.135 2.176a5.458 5.458 0 0 1-3.377-2.176A6.413 6.413 0 0 1 .5 6.545V3.496L5 1.451l4.5 2.045v3.05z"
                />
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 5v4-4z" />
            </g>
        </AccessibleSVG>
    );
};

export default IconSecurityClassificationSolid;
