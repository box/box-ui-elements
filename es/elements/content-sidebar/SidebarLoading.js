/**
 * 
 * @file a placeholder component which will be displayed while a code splitted sidebar chunk is being loaded asyncronously
 * @author Box
 */
import * as React from 'react';
import LoadingIndicator from '../../components/loading-indicator/LoadingIndicator';
import SidebarContent from './SidebarContent';
import SidebarSection from './SidebarSection';
import './SidebarLoading.scss';
const SidebarLoading = ({
  title
}) => {
  return /*#__PURE__*/React.createElement(SidebarContent, {
    title: title
  }, /*#__PURE__*/React.createElement(SidebarSection, {
    isOpen: true
  }, /*#__PURE__*/React.createElement(LoadingIndicator, {
    className: "bcs-sidebar-loading"
  })));
};
export default SidebarLoading;
//# sourceMappingURL=SidebarLoading.js.map