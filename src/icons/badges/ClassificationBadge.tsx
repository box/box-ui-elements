import * as React from 'react';
import classNames from 'classnames';

import AccessibleSVG from '../accessible-svg';
import { bdlBoxBlue } from '../../styles/variables';
import { Icon } from '../iconTypes';

const ClassificationBadge = ({ className = '', color = bdlBoxBlue, height = 16, title, width = 16 }: Icon) => {
    const classes = classNames('bdl-ClassificationBadge', className);

    return (
        <AccessibleSVG className={classes} height={height} title={title} viewBox="0 0 16 16" width={width}>
            <g fill="none" fillRule="evenodd" stroke={color}>
                <circle cx="8" cy="8" r="7.5" />
                <path d="M8 3.213L4.206 4.987v2.628c0 1.178.388 2.317 1.037 3.228.657.921 1.58 1.606 2.881 1.877 1.053-.27 1.976-.956 2.633-1.877.649-.91 1.037-2.05 1.037-3.228V4.987L8 3.213z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.882 6.588L9.882 9.412" />
            </g>
        </AccessibleSVG>
    );
};

export default ClassificationBadge;
