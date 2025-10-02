/**
 * 
 * @file Preview sidebar additional tabs loading component
 * @author Box
 */

import * as React from 'react';
import AdditionalTabPlaceholder from './AdditionalTabPlaceholder';
import MoreTabPlaceholder from './MoreTabPlaceholder';
import './AdditionalTabsLoading.scss';

// Loading layout for the sidebar's additional tabs
const LOADING_TABS = [AdditionalTabPlaceholder, AdditionalTabPlaceholder, AdditionalTabPlaceholder, AdditionalTabPlaceholder, AdditionalTabPlaceholder, MoreTabPlaceholder];
const AdditionalTabsLoading = () => {
  return LOADING_TABS.map((LoadingComponent, idx) => /*#__PURE__*/React.createElement(LoadingComponent, {
    isLoading: true,
    key: idx
  }));
};
export default AdditionalTabsLoading;
//# sourceMappingURL=AdditionalTabsLoading.js.map