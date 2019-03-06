/**
 * @flow
 * @file Preview sidebar additional tabs components
 * @author Box
 */

import * as React from 'react';
import AdditionalTab from './AdditionalTab';
import AdditionalTabsLoading from './AdditionalTabsLoading';
import './AdditionalTabs.scss';

type Props = {
    tabs: ?AdditionalSidebarTabs,
};

const AdditionalTabs = ({ tabs }: Props) => {
    return (
        <div className="bcs-nav-additional-tabs">
            {tabs && tabs.length >= 0 ? (
                tabs.map(tabData => <AdditionalTab key={tabData.id} {...tabData} />)
            ) : (
                <AdditionalTabsLoading />
            )}
        </div>
    );
};

export default AdditionalTabs;
