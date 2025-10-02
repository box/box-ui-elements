function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * 
 * @file Content Sidebar nav tablist Component
 * @author Box
 */

import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { KEYS } from '../../constants';
const SidebarNavTablist = ({
  children,
  history,
  elementId,
  internalSidebarNavigation,
  internalSidebarNavigationHandler,
  isOpen,
  onNavigate,
  routerDisabled = false
}) => {
  const refs = [];
  const tablist = React.Children.map(children, child => child && child.props.sidebarView);
  const handleKeyDownWithRouter = event => {
    if (!history) return;
    const currentPath = history.location.pathname.replace('/', '');
    const currentIndex = tablist.indexOf(currentPath);
    const {
      length
    } = tablist;
    let nextIndex = currentIndex;
    switch (event.key) {
      case KEYS.arrowUp:
        nextIndex = (currentIndex - 1 + length) % length;
        break;
      case KEYS.arrowDown:
        nextIndex = (currentIndex + 1) % length;
        break;
      default:
        return;
    }
    const nextTab = tablist[nextIndex];
    history.push(`/${nextTab}`);
    if (refs.length > nextIndex) {
      refs[nextIndex].focus();
    }
    event.stopPropagation();
    event.preventDefault();
  };
  const handleKeyDownWithoutRouter = event => {
    if (!internalSidebarNavigationHandler) return;
    const currentTab = internalSidebarNavigation?.sidebar;
    const currentIndex = tablist.indexOf(currentTab);
    const {
      length
    } = tablist;
    let nextIndex = currentIndex;
    switch (event.key) {
      case KEYS.arrowUp:
        nextIndex = (currentIndex - 1 + length) % length;
        break;
      case KEYS.arrowDown:
        nextIndex = (currentIndex + 1) % length;
        break;
      default:
        return;
    }
    const nextTab = tablist[nextIndex];
    internalSidebarNavigationHandler({
      sidebar: nextTab
    });
    if (refs.length > nextIndex) {
      refs[nextIndex].focus();
    }
    event.stopPropagation();
    event.preventDefault();
  };
  const handleKeyDown = routerDisabled ? handleKeyDownWithoutRouter : handleKeyDownWithRouter;
  return /*#__PURE__*/React.createElement("div", {
    "aria-orientation": "vertical",
    className: "bcs-SidebarNav-main",
    role: "tablist",
    tabIndex: "0",
    onKeyDown: handleKeyDown
  }, React.Children.map(children, tab => {
    if (!tab) {
      return null;
    }
    return /*#__PURE__*/React.cloneElement(tab, _objectSpread({
      elementId,
      internalSidebarNavigation,
      internalSidebarNavigationHandler,
      isOpen,
      onNavigate,
      routerDisabled,
      ref: ref => {
        refs.push(ref);
      }
    }, tab.props));
  }));
};

// Conditionally wrap with withRouter only when router is not disabled
const SidebarNavTablistWithRouter = withRouter(SidebarNavTablist);
const SidebarNavTablistWrapper = props => {
  if (props.routerDisabled) {
    return /*#__PURE__*/React.createElement(SidebarNavTablist, props);
  }
  return /*#__PURE__*/React.createElement(SidebarNavTablistWithRouter, props);
};
export default SidebarNavTablistWrapper;
//# sourceMappingURL=SidebarNavTablist.js.map