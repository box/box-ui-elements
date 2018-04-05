/**
 * @flow
 * @file Preview sidebar content component
 * @author Box
 */

import React from 'react';
import classNames from 'classnames';
import './SidebarContent.scss';

type Props = {
    hasTitle: boolean,
    title: React$Element<any>,
    children: any
};

const SidebarContent = ({ title, hasTitle, children }: Props) => {
    const scrollContentClassName = classNames('bcs-scroll-content-wrapper', {
        'bcs-section-has-title': hasTitle
    });

    return (
        <div className='bcs-content'>
            {hasTitle && <h3 className='bcs-title'>{title}</h3>}
            <div className={scrollContentClassName}>
                <div className='bcs-scroll-content'>{children}</div>
            </div>
        </div>
    );
};

export default SidebarContent;
