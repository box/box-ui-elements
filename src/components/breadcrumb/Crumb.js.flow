// @flow
import * as React from 'react';
import classNames from 'classnames';

type Props = {
    children?: React.Node,
    className?: string,
    isLastCrumb?: boolean,
};

const Crumb = ({ children, className, isLastCrumb }: Props) => {
    const classes = classNames('breadcrumb-item', className, {
        'breadcrumb-item-last': isLastCrumb,
    });

    return <li className={classes}>{children}</li>;
};

export default Crumb;
