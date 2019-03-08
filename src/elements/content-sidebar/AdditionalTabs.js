/**
 * @flow
 * @file Preview sidebar additional tabs components
 * @author Box
 */

import * as React from 'react';
import AdditionalTab from './AdditionalTab';
import './AdditionalTabs.scss';

type Props = {
    tabs: Array<AdditionalSidebarTab>,
};

const AdditionalSidebarTabs = ({ tabs }: Props) => {
    const sidebarTabs = tabs.map(tabData => <AdditionalTab key={tabData.id} {...tabData} />);
    return <div className="bcs-nav-additional-tabs">{sidebarTabs}</div>;
};

export default AdditionalSidebarTabs;
