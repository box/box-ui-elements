/**
 * @flow
 * @file Preview sidebar content component
 * @author Box
 */

import * as React from 'react';
import './SidebarContent.scss';

type Props = {
    actions?: React.Node,
    children: any,
    title: React.Node,
};

const SidebarContent = ({ actions, title, children }: Props) => (
    <div className="bcs-content" data-testid="bcs-content">
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
