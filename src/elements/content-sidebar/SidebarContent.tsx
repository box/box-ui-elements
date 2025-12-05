/**
 * @file Preview sidebar content component
 * @author Box
 */

import * as React from 'react';
import classNames from 'classnames';
import './SidebarContent.scss';

export interface SidebarContentProps {
    actions?: React.ReactNode;
    children: React.ReactNode;
    className?: string;
    elementId?: string;
    sidebarView?: string;
    title?: React.ReactNode;
    subheader?: React.ReactNode;
}

const SidebarContent = ({
    actions,
    children,
    className,
    elementId = '',
    sidebarView = '',
    title,
    subheader,
    ...rest
}: SidebarContentProps) => {
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
                {title && <h2 className="bcs-title">{title}</h2>}
                {actions}
            </div>
            {subheader && <div className="bcs-content-subheader">{subheader}</div>}
            <div className="bcs-scroll-content-wrapper">
                <div className="bcs-scroll-content">{children}</div>
            </div>
        </div>
    );
};

export default SidebarContent;
