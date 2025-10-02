const _excluded = ["sidebar"];
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
/**
 * 
 * @file Preview Navigation
 * @author Box
 */

import * as React from 'react';
import { injectIntl } from 'react-intl';
import { Route } from 'react-router-dom';
import IconNavigateLeft from '../../icons/general/IconNavigateLeft';
import IconNavigateRight from '../../icons/general/IconNavigateRight';
import PlainButton from '../../components/plain-button/PlainButton';
import messages from '../common/messages';
import { SIDEBAR_VIEW_METADATA } from '../../constants';
const PreviewNavigationWithRouter = ({
  collection = [],
  currentIndex,
  intl,
  onNavigateLeft,
  onNavigateRight
}) => {
  const hasLeftNavigation = collection.length > 1 && currentIndex > 0 && currentIndex < collection.length;
  const hasRightNavigation = collection.length > 1 && currentIndex > -1 && currentIndex < collection.length - 1;
  if (!hasLeftNavigation && !hasRightNavigation) {
    return null;
  }
  const goToActiveSidebarTab = (routeParams, history) => {
    if (routeParams.deeplink) {
      if (routeParams.activeTab === SIDEBAR_VIEW_METADATA) {
        history.push(`/${routeParams.activeTab}/${routeParams.deeplink}/${routeParams[0]}`);
      } else {
        history.push(`/${routeParams.activeTab}`);
      }
    }
  };
  return /*#__PURE__*/React.createElement(Route, {
    path: ['/:activeTab/:deeplink/*', '/']
  }, ({
    match,
    history
  }) => /*#__PURE__*/React.createElement(React.Fragment, null, hasLeftNavigation && /*#__PURE__*/React.createElement(PlainButton, {
    className: "bcpr-navigate-left",
    "data-testid": "preview-navigation-left",
    onClick: () => {
      goToActiveSidebarTab(match.params, history);
      onNavigateLeft();
    },
    title: intl.formatMessage(messages.previousFile),
    type: "button"
  }, /*#__PURE__*/React.createElement(IconNavigateLeft, null)), hasRightNavigation && /*#__PURE__*/React.createElement(PlainButton, {
    className: "bcpr-navigate-right",
    "data-testid": "preview-navigation-right",
    onClick: () => {
      goToActiveSidebarTab(match.params, history);
      onNavigateRight();
    },
    title: intl.formatMessage(messages.nextFile),
    type: "button"
  }, /*#__PURE__*/React.createElement(IconNavigateRight, null))));
};
const PreviewNavigationWithoutRouter = ({
  collection = [],
  currentIndex,
  intl,
  internalSidebarNavigation,
  internalSidebarNavigationHandler,
  onNavigateLeft,
  onNavigateRight
}) => {
  const hasLeftNavigation = collection.length > 1 && currentIndex > 0 && currentIndex < collection.length;
  const hasRightNavigation = collection.length > 1 && currentIndex > -1 && currentIndex < collection.length - 1;
  if (!hasLeftNavigation && !hasRightNavigation) {
    return null;
  }
  const handleInternalNavigation = () => {
    if (internalSidebarNavigationHandler && internalSidebarNavigation && internalSidebarNavigation.sidebar) {
      const {
          sidebar
        } = internalSidebarNavigation,
        rest = _objectWithoutProperties(internalSidebarNavigation, _excluded);
      const hasDeeplink = Object.keys(rest).length > 0;
      if (hasDeeplink && sidebar === SIDEBAR_VIEW_METADATA) {
        internalSidebarNavigationHandler(internalSidebarNavigation);
      } else {
        internalSidebarNavigationHandler({
          sidebar
        });
      }
    }
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, hasLeftNavigation && /*#__PURE__*/React.createElement(PlainButton, {
    className: "bcpr-navigate-left",
    onClick: () => {
      handleInternalNavigation();
      onNavigateLeft();
    },
    title: intl.formatMessage(messages.previousFile),
    type: "button"
  }, /*#__PURE__*/React.createElement(IconNavigateLeft, null)), hasRightNavigation && /*#__PURE__*/React.createElement(PlainButton, {
    className: "bcpr-navigate-right",
    onClick: () => {
      handleInternalNavigation();
      onNavigateRight();
    },
    title: intl.formatMessage(messages.nextFile),
    type: "button"
  }, /*#__PURE__*/React.createElement(IconNavigateRight, null)));
};
const PreviewNavigation = props => {
  const {
    routerDisabled = false
  } = props;
  if (routerDisabled) {
    return /*#__PURE__*/React.createElement(PreviewNavigationWithoutRouter, props);
  }
  return /*#__PURE__*/React.createElement(PreviewNavigationWithRouter, props);
};
export default injectIntl(PreviewNavigation);
//# sourceMappingURL=PreviewNavigation.js.map