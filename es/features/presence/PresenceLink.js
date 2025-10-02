function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PlainButton from '../../components/plain-button';
import { Flyout, Overlay } from '../../components/flyout';
import PresenceCollaboratorsList from './PresenceCollaboratorsList';
import { collaboratorsPropType, flyoutPositionPropType } from './propTypes';
import './Presence.scss';

// eslint-disable-next-line react/prefer-stateless-function
class PresenceLink extends Component {
  render() {
    const {
      children,
      className,
      collaborators,
      onFlyoutScroll,
      containerAttributes,
      flyoutPosition
    } = this.props;
    if (collaborators.length === 0) {
      return null;
    }
    return /*#__PURE__*/React.createElement(Flyout, {
      className: `presence ${className}`,
      position: flyoutPosition
    }, /*#__PURE__*/React.createElement("div", _extends({
      className: "presence-link-container"
    }, containerAttributes), /*#__PURE__*/React.createElement(PlainButton, null, children)), /*#__PURE__*/React.createElement(Overlay, {
      shouldDefaultFocus: false
    }, /*#__PURE__*/React.createElement(PresenceCollaboratorsList, {
      collaborators: collaborators,
      onScroll: onFlyoutScroll
    })));
  }
}
_defineProperty(PresenceLink, "propTypes", {
  children: PropTypes.node,
  className: PropTypes.string,
  collaborators: PropTypes.arrayOf(collaboratorsPropType).isRequired,
  /** Addtional attributes for presenceLink container */
  containerAttributes: PropTypes.object,
  onFlyoutScroll: PropTypes.func,
  /** Option to change the orientation of the dropdown. MUST be: bottom-right, bottom-left, bottom-center etc. or in this specific format */
  flyoutPosition: flyoutPositionPropType
});
_defineProperty(PresenceLink, "defaultProps", {
  className: '',
  flyoutPosition: 'bottom-right'
});
export default PresenceLink;
//# sourceMappingURL=PresenceLink.js.map