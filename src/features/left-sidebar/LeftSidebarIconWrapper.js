// @flow
import * as React from 'react';
import classNames from 'classnames';

import './styles/LeftSidebarIconWrapper.scss';

type Props = {
    children: React.Element<any>,
    className?: string,
};

const LeftSidebarIconWrapper = ({ children, className = '' }: Props) => (
    <span className={classNames('left-sidebar-icon-wrapper', className)}>{children}</span>
);

export default LeftSidebarIconWrapper;
