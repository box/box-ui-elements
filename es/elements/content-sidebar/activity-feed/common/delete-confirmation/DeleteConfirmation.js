const _excluded = ["isOpen", "message", "onDeleteCancel", "onDeleteConfirm"];
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * 
 * @file Comment component
 */

import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Button from '../../../../../components/button';
import commonMessages from '../../../../common/messages';
import PrimaryButton from '../../../../../components/primary-button';
import { KEYS } from '../../../../../constants';
import { Overlay } from '../../../../../components/flyout';
import { ACTIVITY_TARGETS } from '../../../../common/interactionTargets';
import './DeleteConfirmation.scss';
class DeleteConfirmation extends React.Component {
  constructor(...args) {
    super(...args);
    _defineProperty(this, "onKeyDown", event => {
      const {
        nativeEvent
      } = event;
      const {
        isOpen,
        onDeleteCancel
      } = this.props;
      nativeEvent.stopImmediatePropagation();
      switch (event.key) {
        case KEYS.escape:
          event.stopPropagation();
          event.preventDefault();
          if (isOpen) {
            onDeleteCancel();
          }
          break;
        default:
          break;
      }
    });
  }
  render() {
    const _this$props = this.props,
      {
        isOpen,
        message,
        onDeleteCancel,
        onDeleteConfirm
      } = _this$props,
      rest = _objectWithoutProperties(_this$props, _excluded);
    return /*#__PURE__*/React.createElement(Overlay, _extends({
      className: "be-modal bcs-DeleteConfirmation",
      onKeyDown: this.onKeyDown,
      role: "dialog",
      shouldDefaultFocus: true,
      shouldOutlineFocus: false
    }, rest), /*#__PURE__*/React.createElement("div", {
      className: "bcs-DeleteConfirmation-promptMessage"
    }, /*#__PURE__*/React.createElement(FormattedMessage, message)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Button, {
      "aria-label": commonMessages.cancel.defaultMessage,
      className: "bcs-DeleteConfirmation-cancel",
      onClick: onDeleteCancel,
      type: "button",
      "data-resin-target": ACTIVITY_TARGETS.INLINE_DELETE_CANCEL
    }, /*#__PURE__*/React.createElement(FormattedMessage, commonMessages.cancel)), /*#__PURE__*/React.createElement(PrimaryButton, {
      "aria-label": commonMessages.delete.defaultMessage,
      className: "bcs-DeleteConfirmation-delete",
      onClick: onDeleteConfirm,
      type: "button",
      "data-resin-target": ACTIVITY_TARGETS.INLINE_DELETE_CONFIRM
    }, /*#__PURE__*/React.createElement(FormattedMessage, commonMessages.delete))));
  }
}
export default DeleteConfirmation;
//# sourceMappingURL=DeleteConfirmation.js.map