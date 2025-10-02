function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import Button from '../../components/button';
import { Modal, ModalActions } from '../../components/modal';
import commonMessages from '../../common/messages';
import SharedLink from './SharedLink';
import EmailSharedLink from './EmailSharedLink';
import messages from './messages';
import { accessLevelPropType, allowedAccessLevelsPropType, permissionLevelPropType } from './propTypes';
class SharedLinkModal extends Component {
  constructor(...args) {
    super(...args);
    _defineProperty(this, "state", {
      isEmailSharedLinkExpanded: false
    });
    _defineProperty(this, "handleEmailSharedLinkExpand", () => {
      this.setState({
        isEmailSharedLinkExpanded: true
      });
    });
  }
  renderSharedLink() {
    const {
      accessLevel,
      accessMenuButtonProps,
      allowedAccessLevels,
      canRemoveLink,
      changeAccessLevel,
      changePermissionLevel,
      copyButtonProps,
      enterpriseName,
      expiration,
      isDownloadAllowed,
      isEditAllowed,
      isPreviewAllowed,
      itemType,
      onCopySuccess,
      onSettingsClick,
      permissionLevel,
      removeLink,
      removeLinkButtonProps,
      sharedLink,
      submitting
    } = this.props;
    return /*#__PURE__*/React.createElement(SharedLink, {
      accessLevel: accessLevel,
      accessMenuButtonProps: accessMenuButtonProps,
      allowedAccessLevels: allowedAccessLevels,
      canRemoveLink: canRemoveLink,
      changeAccessLevel: changeAccessLevel,
      changePermissionLevel: changePermissionLevel,
      copyButtonProps: copyButtonProps,
      enterpriseName: enterpriseName,
      expiration: expiration,
      isDownloadAllowed: isDownloadAllowed,
      isEditAllowed: isEditAllowed,
      isPreviewAllowed: isPreviewAllowed,
      itemType: itemType,
      onCopySuccess: onCopySuccess,
      onSettingsClick: onSettingsClick,
      permissionLevel: permissionLevel,
      removeLink: removeLink,
      removeLinkButtonProps: removeLinkButtonProps,
      sharedLink: sharedLink,
      submitting: submitting
    });
  }
  renderEmailSharedLink() {
    const {
      contacts,
      defaultEmailMessage,
      emailMessageProps,
      getContacts,
      onRequestClose,
      sendEmail,
      submitting
    } = this.props;
    if (!getContacts || !contacts || !sendEmail) {
      return null;
    }
    return /*#__PURE__*/React.createElement(EmailSharedLink, {
      contacts: contacts,
      defaultEmailMessage: defaultEmailMessage,
      emailMessageProps: emailMessageProps,
      getContacts: getContacts,
      isExpanded: this.state.isEmailSharedLinkExpanded,
      sendEmail: sendEmail,
      onRequestClose: onRequestClose,
      submitting: submitting,
      onExpand: this.handleEmailSharedLinkExpand
    });
  }
  render() {
    const {
      isOpen,
      itemName,
      modalProps,
      onRequestClose,
      submitting
    } = this.props;
    const {
      isEmailSharedLinkExpanded
    } = this.state;
    return /*#__PURE__*/React.createElement(Modal, _extends({
      className: "shared-link-modal",
      focusElementSelector: ".shared-link-container input",
      isOpen: isOpen,
      onRequestClose: submitting ? undefined : onRequestClose,
      title: /*#__PURE__*/React.createElement(FormattedMessage, _extends({}, messages.sharedLinkModalTitle, {
        values: {
          itemName
        }
      }))
    }, modalProps), this.renderSharedLink(), /*#__PURE__*/React.createElement("hr", null), this.renderEmailSharedLink(), !isEmailSharedLinkExpanded && /*#__PURE__*/React.createElement(ModalActions, null, /*#__PURE__*/React.createElement(Button, {
      isDisabled: submitting,
      onClick: onRequestClose,
      type: "button"
    }, /*#__PURE__*/React.createElement(FormattedMessage, commonMessages.close))));
  }
}
export default SharedLinkModal;
//# sourceMappingURL=SharedLinkModal.js.map