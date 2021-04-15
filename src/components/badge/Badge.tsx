import * as React from 'react';
import classNames from 'classnames';

import { BadgeType } from './types';

import './Badge.scss';

type Props = {
    /** Child components */
    children: React.ReactNode;
    /** Adds a class to the component */
    className?: string;
    /** A predefined badge type */
    type?: BadgeType;
};

const Badge = ({ children, className = '', type = BadgeType.DEFAULT, ...rest }: Props) => {
    const classes = classNames('badge', type !== BadgeType.DEFAULT ? `badge-${type}` : '', className);

    return (
        <span className={classes} {...rest}>
            {children}
        </span>
    );
};

export default Badge;
