/**
 * @flow
 * @file Preview sidebar additional tabs loading component
 * @author Box
 */

import * as React from 'react';
import AdditionalTabLoading from './AdditionalTabLoading';
import MoreTabLoading from './MoreTabLoading';

import './AdditionalTabs.scss';
import './AdditionalTabsLoading.scss';

// Loading layout for the sidebar's additional tabs
const LOADING_TABS = [
    AdditionalTabLoading,
    AdditionalTabLoading,
    AdditionalTabLoading,
    AdditionalTabLoading,
    AdditionalTabLoading,
    MoreTabLoading,
];

const AdditionalTabsLoading = (): any => {
    return LOADING_TABS.map((LoadingComponent, idx) => <LoadingComponent key={idx} />);
};

export default AdditionalTabsLoading;
