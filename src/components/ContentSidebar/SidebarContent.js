/**
 * @flow
 * @file Preview sidebar content component
 * @author Box
 */

import React from 'react';
import './SidebarContent.scss';

type Props = {
    title: React$Element<any>,
    children: any
};

const SidebarContent = ({ title, children }: Props) => (
    <div className='bcs-content'>
        <h3 className='bcs-title'>{title}</h3>
        <div className='bcs-scroll-content-wrapper'>
            <div className='bcs-scroll-content'>{children}</div>
        </div>
    </div>
);

export default SidebarContent;
