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
    strokeWidth?: number,
    /** A text-only string describing the icon if it's not purely decorative for accessibility */
    title?: string | React.Element<any>,
    width?: number,
};

const IconSecurityClassificationSolid = ({
    className = '',
    fillColor = bdlGray20,
    height = 16,
    strokeColor = bdlGray,
    strokeWidth = 1.5,
    title,
    width = 16,
}: Props) => {
    const classes = classNames('bdl-IconSecurityClassificationSolid', className);

    return (
        <AccessibleSVG className={classes} height={height} title={title} viewBox="0 0 16 16" width={width}>
            <g stroke={strokeColor} fill="none" fillRule="evenodd" strokeWidth={strokeWidth}>
                <path
                    fill={fillColor}
                    d="M14.122 7.425a8.724 8.724 0 0 1-1.692 5.12c-1.065 1.452-2.56 2.534-4.265 2.96-2.036-.426-3.53-1.508-4.595-2.96a8.724 8.724 0 0 1-1.692-5.12V3.277L8 .495l6.122 2.782v4.148z"
                />
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.4 5.323v5.441-5.441z" />
            </g>
        </AccessibleSVG>
    );
};

export default IconSecurityClassificationSolid;
