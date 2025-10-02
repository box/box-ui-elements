function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * 
 * @file Preview sidebar additional tabs component
 * @author Box
 */

import React, { PureComponent } from 'react';
import AdditionalTab from './AdditionalTab';
import AdditionalTabsLoading from './AdditionalTabsLoading';
import './AdditionalTabs.scss';
class AdditionalTabs extends PureComponent {
  constructor(props) {
    super(props);
    _defineProperty(this, "numLoadedTabs", 0);
    /**
     * Handles an individual icon image load
     *
     * @return {void}
     */
    _defineProperty(this, "onImageLoad", () => {
      const {
        tabs
      } = this.props;
      if (!tabs) {
        return;
      }
      const hasMoreTab = tabs.find(tab => tab.id < 0 && !tab.iconUrl);
      const numTabs = tabs.length - (hasMoreTab ? 1 : 0);
      this.numLoadedTabs += 1;
      if (this.numLoadedTabs === numTabs) {
        this.setState({
          isLoading: false
        });
      }
    });
    this.state = {
      isLoading: true
    };
  }
  render() {
    const {
      tabs
    } = this.props;
    const {
      isLoading
    } = this.state;
    return /*#__PURE__*/React.createElement("div", {
      className: "bdl-AdditionalTabs"
    }, isLoading && /*#__PURE__*/React.createElement(AdditionalTabsLoading, null), tabs && tabs.map(tabData => /*#__PURE__*/React.createElement(AdditionalTab, _extends({
      key: tabData.id,
      onImageLoad: this.onImageLoad,
      isLoading: isLoading
    }, tabData))));
  }
}
export default AdditionalTabs;
//# sourceMappingURL=AdditionalTabs.js.map