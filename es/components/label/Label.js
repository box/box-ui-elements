function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import InfoIconWithTooltip from './InfoIconWithTooltip';
import StandardLabel from './StandardLabel';
import HiddenLabel from './HiddenLabel';
// @ts-ignore flow import
import commonMessages from '../../common/messages';
import './Label.scss';
const OptionalFormattedMessage = () => /*#__PURE__*/React.createElement("span", {
  className: "label-optional bdl-Label-optional"
}, "(", /*#__PURE__*/React.createElement(FormattedMessage, commonMessages.optional), ")");
const Label = ({
  text,
  tooltip,
  labelElProps,
  infoTooltip,
  infoIconProps,
  showOptionalText,
  hideLabel,
  children
}) => {
  const labelContent = [/*#__PURE__*/React.createElement("span", {
    key: "labelText"
  }, text), showOptionalText ? /*#__PURE__*/React.createElement(OptionalFormattedMessage, {
    key: "optionalMessage"
  }) : null];
  if (infoTooltip) {
    labelContent.push(/*#__PURE__*/React.createElement(InfoIconWithTooltip, {
      key: "infoTooltip",
      iconProps: _objectSpread({
        className: 'tooltip-icon'
      }, infoIconProps),
      tooltipText: infoTooltip
    }));
  }
  if (hideLabel) {
    return /*#__PURE__*/React.createElement(HiddenLabel, {
      labelContent: labelContent,
      labelElProps: labelElProps
    }, children);
  }
  return /*#__PURE__*/React.createElement(StandardLabel, {
    labelContent: labelContent,
    tooltip: tooltip,
    labelElProps: labelElProps
  }, children);
};
export default Label;
//# sourceMappingURL=Label.js.map