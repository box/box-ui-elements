import * as React from 'react';
import classNames from 'classnames';

import AccessibleSVG from '../accessible-svg';
import { bdlGray } from '../../styles/variables';
import { Icon } from '../iconTypes';

const IconSecurityClassification = ({
    className = '',
    height = 32,
    color = bdlGray,
    title,
    strokeWidth = 2,
    width = 32,
}: Icon) => {
    const classes = classNames('bdl-IconSecurityClassification', className);

    return (
        <AccessibleSVG className={classes} height={height} title={title} viewBox="0 0 32 32" width={width}>
            <path
                d="M17,2 L5,8 L5,15 C5,21.4214876 10.6933333,29.5421488 17,31 C23.3066667,29.5421488 29,21.4214876 29,15 L29,8 L17,2 Z"
                stroke={color}
                strokeWidth={strokeWidth}
                fill="none"
            />
            <path
                d="M23,11 L23,19"
                stroke={color}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
            />
        </AccessibleSVG>
    );
};

export default IconSecurityClassification;
