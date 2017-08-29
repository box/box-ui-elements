/**
 * @flow
 * @file Preview sidebar content component
 * @author Box
 */

import React from 'react';
import './SidebarContent.scss';

type Props = {
    title: string,
    children: any
};

/* eslint-disable jsx-a11y/label-has-for */
const SidebarContent = ({ title, children }: Props) =>
    <div className='bcpr-sidebar-content'>
        <h3 className='bcpr-sidebar-title'>
            {title}
        </h3>
        <div className='bcpr-sidebar-scroll-content-wrapper'>
            <div className='bcpr-sidebar-scroll-content'>
                {children}
            </div>
        </div>
    </div>;

export default SidebarContent;
