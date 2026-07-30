import * as React from 'react';
import classNames from 'classnames';

export interface CrumbProps {
    /** Contents of the breadcrumb item */
    children?: React.ReactNode;
    /** Custom class for the breadcrumb item */
    className?: string;
    /** Whether this is the final breadcrumb item */
    isLastCrumb?: boolean;
}

const Crumb = ({ children, className, isLastCrumb }: CrumbProps) => {
    const classes = classNames('breadcrumb-item', className, {
        'breadcrumb-item-last': isLastCrumb,
    });

    return <li className={classes}>{children}</li>;
};

export default Crumb;
