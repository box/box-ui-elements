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
    elementId: string,
    sidebarView: string,
    title: React.Node,
};
const SidebarContent = ({ actions, children, className, title, elementId, sidebarView, ...rest }: Props) => {
    const label = `${elementId}${elementId === '' ? '' : '_'}${sidebarView}`;
    const id = `${label}-content`;

    return (
        <div
            aria-labelledby={label}
            className={classNames('bcs-content', className)}
            data-testid="bcs-content"
            id={id}
            role="tabpanel"
            {...rest}
        >
            <div className="bcs-content-header">
                <h3 className="bcs-title">{title}</h3>
                {actions}
            </div>
            <div className="bcs-scroll-content-wrapper">
                <div className="bcs-scroll-content">{children}</div>
            </div>
        </div>
    );
};

SidebarContent.defaultProps = {
    elementId: '',
    sidebarView: '',
};

export default SidebarContent;
