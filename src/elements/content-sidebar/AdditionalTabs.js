/**
 * @flow
 * @file Preview sidebar additional tabs components
 * @author Box
 */

import * as React from 'react';
import AdditionalTab from './AdditionalTab';
import './AdditionalTabs.scss';

type Props = {
    tabs: AdditionalTabs,
};

const AdditionalSidebarTabs = ({ tabs }: Props) => {
    const sidebarTabs = tabs.map(tabData => <AdditionalTab key={tabData.id} {...tabData} />);
    return (
        <React.Fragment>
            <div className="bcs-nav-separator" />
            {sidebarTabs}
        </React.Fragment>
    );
};

export default AdditionalSidebarTabs;
