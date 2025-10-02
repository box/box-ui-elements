function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import * as React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import Checkbox from '../../components/checkbox';
import TextInputWithCopyButton from '../../components/text-input-with-copy-button';
import Fieldset from '../../components/fieldset';
import Tooltip from '../../components/tooltip';
import messages from './messages';
import './AllowDownloadSection.scss';
const AllowDownloadSection = ({
  canChangeDownload,
  classification,
  directLink,
  directLinkInputProps = {},
  downloadCheckboxProps = {},
  isDirectLinkAvailable,
  isDirectLinkUnavailableDueToDownloadSettings,
  isDirectLinkUnavailableDueToAccessPolicy,
  isDirectLinkUnavailableDueToMaliciousContent,
  isDownloadAvailable,
  isDownloadEnabled,
  onChange
}) => {
  if (!isDownloadAvailable && !isDirectLinkAvailable) {
    return null;
  }
  const directLinkSection = /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(TextInputWithCopyButton, _extends({
    className: "direct-link-input",
    label: /*#__PURE__*/React.createElement(FormattedMessage, messages.directLinkLabel),
    type: "url",
    value: directLink
  }, directLinkInputProps)));
  const isDirectLinkUnavailable = isDirectLinkUnavailableDueToAccessPolicy || isDirectLinkUnavailableDueToMaliciousContent;
  const allowDownloadSectionClass = classNames('bdl-AllowDownloadSection', {
    'bdl-is-disabled': isDirectLinkUnavailable
  });
  const isDirectLinkSectionVisible = (isDirectLinkAvailable || isDirectLinkUnavailableDueToDownloadSettings) && isDownloadEnabled;
  let tooltipMessage = null;
  if (isDirectLinkUnavailableDueToMaliciousContent) {
    tooltipMessage = _objectSpread({}, messages.directDownloadBlockedByMaliciousContent);
  } else if (classification) {
    tooltipMessage = _objectSpread({}, messages.directDownloadBlockedByAccessPolicyWithClassification);
  } else {
    tooltipMessage = _objectSpread({}, messages.directDownloadBlockedByAccessPolicyWithoutClassification);
  }
  if (isDownloadAvailable) {
    return /*#__PURE__*/React.createElement("div", {
      className: allowDownloadSectionClass
    }, /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement(Tooltip, {
      isDisabled: !isDirectLinkUnavailable,
      text: /*#__PURE__*/React.createElement(FormattedMessage, tooltipMessage),
      position: "middle-left"
    }, /*#__PURE__*/React.createElement(Fieldset, {
      className: "be",
      disabled: isDirectLinkUnavailable,
      title: /*#__PURE__*/React.createElement(FormattedMessage, messages.allowDownloadTitle)
    }, /*#__PURE__*/React.createElement(Checkbox, _extends({
      isChecked: isDownloadEnabled,
      isDisabled: !canChangeDownload || isDirectLinkUnavailable,
      label: /*#__PURE__*/React.createElement(FormattedMessage, messages.allowDownloadLabel),
      name: "isDownloadEnabled",
      onChange: onChange
    }, downloadCheckboxProps)), isDirectLinkSectionVisible && directLinkSection)));
  }

  // When download section not available but direct link is available
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("hr", null), directLinkSection);
};
AllowDownloadSection.propTypes = {
  canChangeDownload: PropTypes.bool.isRequired,
  classification: PropTypes.string,
  directLink: PropTypes.string.isRequired,
  directLinkInputProps: PropTypes.object,
  downloadCheckboxProps: PropTypes.object,
  isDirectLinkAvailable: PropTypes.bool.isRequired,
  isDirectLinkUnavailableDueToMaliciousContent: PropTypes.bool,
  isDirectLinkUnavailableDueToAccessPolicy: PropTypes.bool,
  isDirectLinkUnavailableDueToDownloadSettings: PropTypes.bool.isRequired,
  isDownloadAvailable: PropTypes.bool.isRequired,
  isDownloadEnabled: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired
};
export default AllowDownloadSection;
//# sourceMappingURL=AllowDownloadSection.js.map