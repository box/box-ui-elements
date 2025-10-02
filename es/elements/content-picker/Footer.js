function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import * as React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Button, { ButtonType } from '../../components/button';
import ButtonGroup from '../../components/button-group';
import IconCheck from '../../icons/general/IconCheck';
import IconClose from '../../icons/general/IconClose';
import messages from '../common/messages';
import PrimaryButton from '../../components/primary-button';
import Tooltip from '../common/Tooltip';
import './Footer.scss';
const Footer = ({
  currentCollection,
  selectedCount,
  selectedItems,
  onSelectedClick,
  hasHitSelectionLimit,
  isSingleSelect,
  onCancel,
  onChoose,
  chooseButtonLabel,
  cancelButtonLabel,
  children,
  renderCustomActionButtons,
  showSelectedButton
}) => {
  const {
    formatMessage
  } = useIntl();
  const cancelMessage = formatMessage(messages.cancel);
  const chooseMessage = formatMessage(messages.choose);
  const isChooseButtonDisabled = !selectedCount;
  return /*#__PURE__*/React.createElement("footer", {
    className: "bcp-footer"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bcp-footer-left"
  }, showSelectedButton && !isSingleSelect && /*#__PURE__*/React.createElement(Button, {
    className: "bcp-selected",
    onClick: onSelectedClick,
    type: ButtonType.BUTTON
  }, /*#__PURE__*/React.createElement(FormattedMessage, _extends({
    className: "bcp-selected-count"
  }, messages.selected, {
    values: {
      count: selectedCount
    }
  })), hasHitSelectionLimit && /*#__PURE__*/React.createElement("span", {
    className: "bcp-selected-max"
  }, "(", /*#__PURE__*/React.createElement(FormattedMessage, messages.max), ")"))), /*#__PURE__*/React.createElement("div", {
    className: "bcp-footer-right"
  }, children, renderCustomActionButtons ? renderCustomActionButtons({
    currentFolderId: currentCollection.id,
    currentFolderName: currentCollection.name,
    onCancel,
    onChoose,
    selectedCount,
    selectedItems
  }) : /*#__PURE__*/React.createElement(ButtonGroup, {
    className: "bcp-footer-actions"
  }, /*#__PURE__*/React.createElement(Tooltip, {
    text: cancelButtonLabel || cancelMessage
  }, /*#__PURE__*/React.createElement(Button, {
    "aria-label": cancelMessage,
    onClick: onCancel,
    type: ButtonType.BUTTON
  }, /*#__PURE__*/React.createElement(IconClose, {
    height: 16,
    width: 16
  }))), /*#__PURE__*/React.createElement(Tooltip, {
    isDisabled: isChooseButtonDisabled,
    text: chooseButtonLabel || chooseMessage
  }, /*#__PURE__*/React.createElement(PrimaryButton, {
    "aria-label": chooseMessage,
    isDisabled: isChooseButtonDisabled,
    onClick: onChoose,
    type: ButtonType.BUTTON,
    disabled: isChooseButtonDisabled
  }, /*#__PURE__*/React.createElement(IconCheck, {
    color: "#fff",
    height: 16,
    width: 16
  }))))));
};
export default Footer;
//# sourceMappingURL=Footer.js.map