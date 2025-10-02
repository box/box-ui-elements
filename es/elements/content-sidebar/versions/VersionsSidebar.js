const _excluded = ["error", "history", "internalSidebarNavigation", "internalSidebarNavigationHandler", "isLoading", "parentName", "routerDisabled", "versions"];
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
/**
 * 
 * @file Versions Sidebar component
 * @author Box
 */

import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Route } from 'react-router-dom';
import InlineError from '../../../components/inline-error';
import messages from './messages';
import SidebarContent from '../SidebarContent';
import VersionsMenu from './VersionsMenu';
import BackButton from '../../common/back-button';
import { DEFAULT_FETCH_END } from '../../../constants';
import { LoadingIndicatorWrapper } from '../../../components/loading-indicator';
import './VersionsSidebar.scss';
const {
  useCallback
} = React;
const MAX_VERSIONS = DEFAULT_FETCH_END;
const VersionsContent = _ref => {
  let {
      error,
      history,
      internalSidebarNavigation,
      internalSidebarNavigationHandler,
      isLoading,
      parentName,
      routerDisabled,
      versions
    } = _ref,
    rest = _objectWithoutProperties(_ref, _excluded);
  const showLimit = versions.length >= MAX_VERSIONS;
  const showVersions = !!versions.length;
  const showEmpty = !isLoading && !showVersions;
  const showError = !!error;
  const handleBackClick = useCallback(() => {
    if (routerDisabled && internalSidebarNavigationHandler) {
      internalSidebarNavigationHandler({
        sidebar: parentName
      });
    } else if (!routerDisabled && history) {
      history.push(`/${parentName}`);
    }
  }, [parentName, routerDisabled, internalSidebarNavigationHandler, history]);
  return /*#__PURE__*/React.createElement(SidebarContent, {
    className: "bcs-Versions",
    "data-resin-component": "preview",
    "data-resin-feature": "versions",
    title: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(BackButton, {
      "data-resin-target": "back",
      onClick: handleBackClick
    }), /*#__PURE__*/React.createElement(FormattedMessage, messages.versionsTitle))
  }, /*#__PURE__*/React.createElement(LoadingIndicatorWrapper, {
    className: "bcs-Versions-content",
    crawlerPosition: "top",
    isLoading: isLoading
  }, showError && /*#__PURE__*/React.createElement(InlineError, {
    title: /*#__PURE__*/React.createElement(FormattedMessage, messages.versionServerError)
  }, /*#__PURE__*/React.createElement(FormattedMessage, error)), showEmpty && /*#__PURE__*/React.createElement("div", {
    className: "bcs-Versions-empty"
  }, /*#__PURE__*/React.createElement(FormattedMessage, messages.versionsEmpty)), showVersions && /*#__PURE__*/React.createElement("div", {
    className: "bcs-Versions-menu",
    "data-testid": "bcs-Versions-menu"
  }, /*#__PURE__*/React.createElement(VersionsMenu, _extends({
    versions: versions,
    routerDisabled: routerDisabled,
    internalSidebarNavigation: internalSidebarNavigation
  }, rest))), showLimit && /*#__PURE__*/React.createElement("div", {
    className: "bcs-Versions-maxEntries",
    "data-testid": "max-versions"
  }, /*#__PURE__*/React.createElement(FormattedMessage, _extends({}, messages.versionMaxEntries, {
    values: {
      maxVersions: MAX_VERSIONS
    }
  })))));
};
const VersionsSidebar = props => {
  const {
    routerDisabled
  } = props;
  if (routerDisabled) {
    return /*#__PURE__*/React.createElement(VersionsContent, props);
  }
  return /*#__PURE__*/React.createElement(Route, null, ({
    history
  }) => /*#__PURE__*/React.createElement(VersionsContent, _extends({}, props, {
    history: history
  })));
};
export default VersionsSidebar;
//# sourceMappingURL=VersionsSidebar.js.map