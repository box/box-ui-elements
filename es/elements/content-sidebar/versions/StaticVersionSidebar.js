function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * 
 * @file Static Versions Sidebar component
 * @author Box
 */

import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Route } from 'react-router-dom';
import BoxDrive140 from '../../../illustration/BoxDrive140';
import BackButton from '../../common/back-button';
import PrimaryButton from '../../../components/primary-button';
import { LoadingIndicatorWrapper } from '../../../components/loading-indicator';
import VersionsMenu from './VersionsMenu';
import messages from './messages';
import './StaticVersionsSidebar.scss';
const {
  useCallback
} = React;
const StaticVersionsContent = ({
  history,
  internalSidebarNavigation,
  internalSidebarNavigationHandler,
  isLoading,
  onUpgradeClick,
  parentName,
  routerDisabled
}) => {
  const versionTimestamp = new Date();
  versionTimestamp.setDate(versionTimestamp.getDate() - 1);
  const versions = ['1', '2', '3'].map(versionNumber => {
    return {
      id: versionNumber,
      version_number: versionNumber,
      type: 'file_version',
      permissions: {
        can_preview: true
      },
      created_at: versionTimestamp.toUTCString(),
      modified_by: null,
      size: 1875887,
      trashed_at: null,
      uploader_display_name: 'John Doe'
    };
  });
  const handleBackClick = useCallback(() => {
    if (routerDisabled && internalSidebarNavigationHandler) {
      internalSidebarNavigationHandler({
        sidebar: parentName
      });
    } else if (!routerDisabled && history) {
      history.push(`/${parentName}`);
    }
  }, [parentName, routerDisabled, internalSidebarNavigationHandler, history]);
  return /*#__PURE__*/React.createElement("div", {
    className: "bcs-StaticVersionSidebar",
    role: "tabpanel",
    "data-resin-component": "preview",
    "data-resin-feature": "versions"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bcs-StaticVersionSidebar-header"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "bcs-StaticVersionSidebar-title"
  }, /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(BackButton, {
    "data-resin-target": "back",
    onClick: handleBackClick
  }), /*#__PURE__*/React.createElement(FormattedMessage, messages.versionsTitle)))), /*#__PURE__*/React.createElement("div", {
    className: "bcs-StaticVersionSidebar-content-wrapper"
  }, /*#__PURE__*/React.createElement(LoadingIndicatorWrapper, {
    className: "bcs-StaticVersionSidebar-content",
    crawlerPosition: "top",
    isLoading: isLoading
  }, /*#__PURE__*/React.createElement(VersionsMenu, {
    versions: versions,
    fileId: "1",
    versionCount: 3,
    versionLimit: 3,
    routerDisabled: routerDisabled,
    internalSidebarNavigation: internalSidebarNavigation
  }))), /*#__PURE__*/React.createElement("div", {
    className: "bcs-StaticVersionSidebar-upsell-wrapper"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bcs-StaticVersionSidebar-upsell"
  }, /*#__PURE__*/React.createElement(BoxDrive140, {
    className: "bcs-StaticVersionSidebar-upsell-icon"
  }), /*#__PURE__*/React.createElement("p", {
    className: "bcs-StaticVersionSidebar-upsell-header"
  }, /*#__PURE__*/React.createElement(FormattedMessage, messages.versionUpgradeLink)), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement(FormattedMessage, messages.versionUpsell)), /*#__PURE__*/React.createElement(PrimaryButton, {
    className: "bcs-StaticVersionSidebar-upsell-button",
    "data-resin-target": "versioning_error_upgrade_cta",
    onClick: onUpgradeClick,
    type: "button"
  }, /*#__PURE__*/React.createElement(FormattedMessage, messages.upgradeButton)))));
};
const StaticVersionsSidebar = props => {
  const {
    routerDisabled
  } = props;
  if (routerDisabled) {
    return /*#__PURE__*/React.createElement(StaticVersionsContent, props);
  }
  return /*#__PURE__*/React.createElement(Route, null, ({
    history
  }) => /*#__PURE__*/React.createElement(StaticVersionsContent, _extends({}, props, {
    history: history
  })));
};
export default StaticVersionsSidebar;
//# sourceMappingURL=StaticVersionSidebar.js.map