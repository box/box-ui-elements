/**
 * @flow
 * @file Preview sidebar additional tabs components
 * @author Box
 */

import * as React from 'react';
import './AdditionalTabs.scss';
import AdditionalTabLoading from './AdditionalTabLoading';
import MoreTabLoading from './MoreTabLoading';
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

const AdditionalTabsLoading = () => LOADING_TABS.map((LoadingComponent, idx) => <LoadingComponent key={idx} />);

export default AdditionalTabsLoading;
