// @flow
import * as React from 'react';

import './styles/LeftSidebarDropWrapper.scss';

type Props = {
    children: React.Node,
    className?: string,
    dropTargetRef?: { current: null | HTMLDivElement },
    isDragging?: boolean,
    message?: string,
};

const LeftSidebarDropWrapper = ({
    children,
    className = '',
    isDragging = false,
    message = '',
    dropTargetRef,
    ...rest
}: Props) => (
    <div className={`left-sidebar-drop-wrapper ${className}`} ref={dropTargetRef} {...rest}>
        {isDragging ? (
            <div className="left-sidebar-drop-veil">
                <span className="left-sidebar-drop-wrapper-text">{message}</span>
            </div>
        ) : null}
        {children}
    </div>
);

export default LeftSidebarDropWrapper;
