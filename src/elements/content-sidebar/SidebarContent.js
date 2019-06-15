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
    children: any,
    className?: string,
    title: React.Node,
};

const SidebarContent = ({ actions, children, className, title, ...rest }: Props) => (
    <div className={classNames('bcs-content', className)} data-testid="bcs-content" {...rest}>
        <div className="bcs-content-header">
            <h3 className="bcs-title">{title}</h3>
            {actions}
        </div>
        <div className="bcs-scroll-content-wrapper">
            <div className="bcs-scroll-content">{children}</div>
        </div>
    </div>
);

export default SidebarContent;
