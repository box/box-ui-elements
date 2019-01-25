// @flow
import * as React from 'react';
import classNames from 'classnames';

import './Badge.scss';

type Props = {
    /** Child components */
    children: React.Node,
    /** A predefined badge type */
    type?: 'info' | 'warning' | 'highlight' | 'error' | 'alert' | 'success',
    /** Adds a class to the component */
    className?: string,
};

const Badge = ({ children, className = '', type = 'default', ...rest }: Props) => {
    const classes = classNames('badge', type !== 'default' ? `badge-${type}` : '', className);

    return (
        <span className={classes} {...rest}>
            {children}
        </span>
    );
};

export default Badge;
