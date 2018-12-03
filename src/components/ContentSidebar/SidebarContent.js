/**
 * @flow
 * @file Preview sidebar content component
 * @author Box
 */

import * as React from 'react';
import classNames from 'classnames';
import './SidebarContent.scss';

type Props = {
    actions?: React.Node,
    title: React.Node,
    children: any,
    className?: string,
};

const SidebarContent = ({ actions, title, children, className }: Props) => {
    const scrollContentWrapperClassName = classNames(
        'bcs-scroll-content-wrapper',
        className,
    );
    const scrollContentClassName = classNames('bcs-scroll-content', className);
    return (
        <div className="bcs-content">
            <div className="bcs-content-header">
                <h3 className="bcs-title">{title}</h3>
                {actions}
            </div>
            <div className={scrollContentWrapperClassName}>
                <div className={scrollContentClassName}>{children}</div>
            </div>
        </div>
    );
};

export default SidebarContent;
