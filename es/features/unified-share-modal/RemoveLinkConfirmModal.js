function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Modal, ModalActions } from '../../components/modal';
import Button from '../../components/button';
import PrimaryButton from '../../components/primary-button';
import commonMessages from '../../common/messages';
import messages from './messages';
class RemoveLinkConfirmModal extends Component {
  componentDidMount() {
    const {
      onLoad
    } = this.props;
    if (onLoad) {
      onLoad();
    }
  }
  render() {
    const {
      isOpen,
      onRequestClose,
      removeLink,
      submitting,
      okayButtonProps,
      modalProps,
      cancelButtonProps
    } = this.props;
    return /*#__PURE__*/React.createElement(Modal, _extends({
      className: "be-modal",
      focusElementSelector: ".btn-primary",
      isOpen: isOpen,
      onRequestClose: submitting ? undefined : onRequestClose,
      title: /*#__PURE__*/React.createElement(FormattedMessage, messages.removeLinkConfirmationTitle),
      type: "alert"
    }, modalProps), /*#__PURE__*/React.createElement(FormattedMessage, messages.removeLinkConfirmationDescription), /*#__PURE__*/React.createElement(ModalActions, null, /*#__PURE__*/React.createElement(Button, _extends({
      isDisabled: submitting,
      onClick: onRequestClose
    }, cancelButtonProps), /*#__PURE__*/React.createElement(FormattedMessage, commonMessages.cancel)), /*#__PURE__*/React.createElement(PrimaryButton, _extends({
      isDisabled: submitting,
      isLoading: submitting,
      onClick: removeLink
    }, okayButtonProps), /*#__PURE__*/React.createElement(FormattedMessage, commonMessages.okay))));
  }
}
export default RemoveLinkConfirmModal;
//# sourceMappingURL=RemoveLinkConfirmModal.js.map