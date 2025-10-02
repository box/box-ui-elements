function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import Button from '../../components/button';
import PrimaryButton from '../../components/primary-button';
import { Modal, ModalActions } from '../../components/modal';
import InlineNotice from '../../components/inline-notice';
import Link from '../../components/link/LinkBase';
import commonMessages from '../../common/messages';
import Classification, { getClassificationLabelColor } from '../classification';
import VanityNameSection from './VanityNameSection';
import PasswordSection from './PasswordSection';
import ExpirationSection from './ExpirationSection';
import AllowDownloadSection from './AllowDownloadSection';
import messages from './messages';
import { PEOPLE_WITH_LINK, PEOPLE_IN_COMPANY, PEOPLE_IN_ITEM } from '../shared-link-modal/constants';
import './SharedLinkSettingsModal.scss';

/**
 * Return the translation message based on the access level and whether the user can download or not
 * @param {string} accessLevel one of 'peopleWithTheLink', 'peopleInYourCompany', or 'peopleInThisItem'
 * @param {boolean} canDownload prop value for whether the user can currently download
 *
 * @return {object|undefined} message for the proper translation (or undefined if nothing matches)
 */
function getAccessNoticeMessageId(accessLevel, canDownload) {
  let message;
  switch (accessLevel) {
    case PEOPLE_WITH_LINK:
      message = canDownload ? messages.withLinkViewDownload : messages.withLinkView;
      break;
    case PEOPLE_IN_COMPANY:
      message = canDownload ? messages.inCompanyViewDownload : messages.inCompanyView;
      break;
    case PEOPLE_IN_ITEM:
      message = messages.inItem;
      break;
    default:
      break;
  }
  return message;
}
class SharedLinkSettingsModal extends Component {
  constructor(props) {
    super(props);
    _defineProperty(this, "onSubmit", event => {
      event.preventDefault();
      const {
        expirationFormattedDate,
        isDownloadEnabled,
        isExpirationEnabled,
        isPasswordEnabled,
        password,
        vanityName
      } = this.state;
      this.props.onSubmit({
        expirationTimestamp: expirationFormattedDate || undefined,
        isDownloadEnabled,
        isExpirationEnabled,
        isPasswordEnabled,
        password,
        vanityName
      });
    });
    _defineProperty(this, "onVanityNameChange", event => {
      this.setState({
        vanityName: event.target.value,
        vanityNameError: undefined
      });
    });
    _defineProperty(this, "onPasswordChange", event => {
      this.setState({
        password: event.target.value,
        passwordError: undefined
      });
    });
    _defineProperty(this, "onPasswordCheckboxChange", event => {
      this.setState({
        isPasswordEnabled: event.target.checked
      });
    });
    _defineProperty(this, "onExpirationDateChange", (date, formattedDate) => {
      this.setState({
        expirationDate: date,
        expirationFormattedDate: formattedDate,
        expirationError: undefined
      });
    });
    _defineProperty(this, "onExpirationCheckboxChange", event => {
      this.setState({
        isExpirationEnabled: event.target.checked
      });
    });
    _defineProperty(this, "onAllowDownloadChange", event => {
      this.setState({
        isDownloadEnabled: event.target.checked
      });
    });
    _defineProperty(this, "onVanityCheckboxChange", event => {
      this.setState({
        isVanityEnabled: event.target.checked,
        vanityName: !event.target.checked ? '' : this.props.vanityName
      });
    });
    this.state = {
      expirationDate: props.expirationTimestamp ? new Date(props.expirationTimestamp) : null,
      expirationError: props.expirationError,
      expirationFormattedDate: props.expirationTimestamp ? new Date(props.expirationTimestamp) : null,
      isVanityEnabled: !!props.vanityName,
      isDownloadEnabled: props.isDownloadEnabled,
      isExpirationEnabled: !!props.expirationTimestamp,
      isPasswordEnabled: props.isPasswordEnabled,
      password: '',
      passwordError: props.passwordError,
      vanityName: props.vanityName,
      vanityNameError: props.vanityNameError
    };
  }
  componentDidUpdate(prevProps) {
    const {
      expirationError,
      passwordError,
      vanityNameError
    } = this.props;
    if (prevProps.expirationError !== expirationError || prevProps.passwordError !== passwordError || prevProps.vanityNameError !== vanityNameError) {
      this.setState({
        expirationError,
        passwordError,
        vanityNameError
      });
    }
  }
  renderVanityNameSection() {
    const {
      canChangeVanityName,
      hideVanityNameSection,
      serverURL,
      vanityNameInputProps,
      warnOnPublic = false
    } = this.props;
    const {
      vanityNameError,
      isVanityEnabled
    } = this.state;
    if (hideVanityNameSection) {
      return null;
    }
    return /*#__PURE__*/React.createElement(VanityNameSection, {
      canChangeVanityName: canChangeVanityName,
      isVanityEnabled: isVanityEnabled,
      error: vanityNameError,
      onChange: this.onVanityNameChange,
      onCheckboxChange: this.onVanityCheckboxChange,
      serverURL: serverURL,
      vanityName: this.state.vanityName,
      vanityNameInputProps: vanityNameInputProps,
      warnOnPublic: warnOnPublic
    });
  }
  renderPasswordSection() {
    const {
      canChangePassword,
      isPasswordAvailable,
      passwordCheckboxProps,
      passwordInformationText,
      passwordInputProps
    } = this.props;
    const {
      isPasswordEnabled,
      password,
      passwordError
    } = this.state;
    return /*#__PURE__*/React.createElement(PasswordSection, {
      canChangePassword: canChangePassword,
      error: passwordError,
      isPasswordAvailable: isPasswordAvailable,
      isPasswordEnabled: isPasswordEnabled,
      isPasswordInitiallyEnabled: this.props.isPasswordEnabled,
      onCheckboxChange: this.onPasswordCheckboxChange,
      onPasswordChange: this.onPasswordChange,
      password: password,
      passwordCheckboxProps: passwordCheckboxProps,
      passwordInformationText: passwordInformationText,
      passwordInputProps: passwordInputProps
    });
  }
  renderExpirationSection() {
    const {
      canChangeExpiration,
      dateDisplayFormat,
      dateFormat,
      expirationCheckboxProps,
      expirationInputProps
    } = this.props;
    const {
      expirationDate,
      isExpirationEnabled,
      expirationError
    } = this.state;
    return /*#__PURE__*/React.createElement(ExpirationSection, {
      canChangeExpiration: canChangeExpiration,
      dateDisplayFormat: dateDisplayFormat,
      dateFormat: dateFormat,
      error: expirationError,
      expirationCheckboxProps: expirationCheckboxProps,
      expirationDate: expirationDate,
      expirationInputProps: expirationInputProps,
      isExpirationEnabled: isExpirationEnabled,
      onCheckboxChange: this.onExpirationCheckboxChange,
      onExpirationDateChange: this.onExpirationDateChange
    });
  }
  renderAccessLevelNotice() {
    const {
      accessLevel
    } = this.props;
    const {
      isDownloadEnabled
    } = this.state;
    const message = getAccessNoticeMessageId(accessLevel, isDownloadEnabled);
    return message && /*#__PURE__*/React.createElement("div", {
      className: "link-settings-modal-notice"
    }, /*#__PURE__*/React.createElement(FormattedMessage, message), ' ', /*#__PURE__*/React.createElement(Link, {
      href: "https://support.box.com/hc/en-us/articles/360043697554-Configuring-Individual-Shared-Link-Settings",
      target: "_blank"
    }, /*#__PURE__*/React.createElement(FormattedMessage, messages.sharedLinkSettingWarningLinkText)));
  }
  renderAllowDownloadSection() {
    const {
      canChangeDownload,
      directLink,
      directLinkInputProps,
      downloadCheckboxProps,
      isDirectLinkAvailable,
      isDirectLinkUnavailableDueToDownloadSettings,
      isDirectLinkUnavailableDueToAccessPolicy,
      isDirectLinkUnavailableDueToMaliciousContent,
      isDownloadAvailable,
      item
    } = this.props;
    const {
      isDownloadEnabled
    } = this.state;
    const {
      classification
    } = item;
    return /*#__PURE__*/React.createElement(AllowDownloadSection, {
      canChangeDownload: canChangeDownload,
      classification: classification,
      directLink: directLink,
      directLinkInputProps: directLinkInputProps,
      downloadCheckboxProps: downloadCheckboxProps,
      isDirectLinkAvailable: isDirectLinkAvailable,
      isDirectLinkUnavailableDueToDownloadSettings: isDirectLinkUnavailableDueToDownloadSettings,
      isDirectLinkUnavailableDueToAccessPolicy: isDirectLinkUnavailableDueToAccessPolicy,
      isDirectLinkUnavailableDueToMaliciousContent: isDirectLinkUnavailableDueToMaliciousContent,
      isDownloadAvailable: isDownloadAvailable,
      isDownloadEnabled: isDownloadEnabled,
      onChange: this.onAllowDownloadChange
    });
  }
  renderModalTitle() {
    const {
      item
    } = this.props;
    const {
      bannerPolicy,
      classification
    } = item;
    const classificationColor = getClassificationLabelColor(bannerPolicy);
    return /*#__PURE__*/React.createElement("span", {
      className: "bdl-SharedLinkSettingsModal-title"
    }, /*#__PURE__*/React.createElement(FormattedMessage, messages.modalTitle), /*#__PURE__*/React.createElement(Classification, {
      className: "bdl-SharedLinkSettingsModal-classification",
      color: classificationColor,
      definition: bannerPolicy ? bannerPolicy.body : undefined,
      messageStyle: "tooltip",
      name: classification
    }));
  }
  render() {
    const {
      canChangeDownload,
      canChangeExpiration,
      canChangePassword,
      canChangeVanityName,
      cancelButtonProps,
      isOpen,
      modalProps,
      onRequestClose,
      saveButtonProps,
      submitting
    } = this.props;
    const showInaccessibleSettingsNotice = !(canChangeDownload && canChangeExpiration && canChangePassword && canChangeVanityName);
    const disableSaveBtn = !(canChangeDownload || canChangeExpiration || canChangePassword || canChangeVanityName);
    return /*#__PURE__*/React.createElement(Modal, _extends({
      className: "be-modal shared-link-settings-modal",
      isOpen: isOpen,
      onRequestClose: submitting ? undefined : onRequestClose,
      title: this.renderModalTitle()
    }, modalProps), /*#__PURE__*/React.createElement("form", {
      onSubmit: this.onSubmit
    }, showInaccessibleSettingsNotice && /*#__PURE__*/React.createElement(InlineNotice, {
      type: "warning"
    }, /*#__PURE__*/React.createElement(FormattedMessage, messages.inaccessibleSettingsNotice)), this.renderAccessLevelNotice(), this.renderExpirationSection(), this.renderPasswordSection(), this.renderVanityNameSection(), this.renderAllowDownloadSection(), /*#__PURE__*/React.createElement(ModalActions, null, /*#__PURE__*/React.createElement(Button, _extends({
      isDisabled: submitting,
      onClick: onRequestClose,
      type: "button"
    }, cancelButtonProps), /*#__PURE__*/React.createElement(FormattedMessage, commonMessages.cancel)), /*#__PURE__*/React.createElement(PrimaryButton, _extends({
      isDisabled: submitting || disableSaveBtn,
      isLoading: submitting
    }, saveButtonProps), /*#__PURE__*/React.createElement(FormattedMessage, commonMessages.save)))));
  }
}
_defineProperty(SharedLinkSettingsModal, "propTypes", {
  /* Pass dateDisplayFormat to define INTL timezone for formatting date for utc format */
  dateDisplayFormat: PropTypes.object,
  /** The format of the expiration date value for form submit */
  dateFormat: PropTypes.string,
  hideVanityNameSection: PropTypes.bool,
  isOpen: PropTypes.bool,
  onRequestClose: PropTypes.func,
  submitting: PropTypes.bool,
  warnOnPublic: PropTypes.bool,
  /** Function called on form submission. Format is:
   * ({
   *      expirationTimestamp: number (in milliseconds),
   *      isDownloadEnabled: true,
   *      isExpirationEnabled: true,
   *      isPasswordEnabled: true,
   *      password: string,
   *      vanityName: string,
   * }) => void
   */
  onSubmit: PropTypes.func.isRequired,
  // access level props
  /** the access level used for the item being shared */
  accessLevel: PropTypes.string,
  // Custom URL props
  /** Whether or not user has permission to change/set vanity URL for this item */
  canChangeVanityName: PropTypes.bool.isRequired,
  /** Current vanity name for the item */
  vanityName: PropTypes.string.isRequired,
  /** Server URL prefix for vanity URL preview; should be something like http://company.box.com/v/ */
  serverURL: PropTypes.string.isRequired,
  vanityNameError: PropTypes.string,
  // Password props
  /** Whether or not user has permission to enable/disable/change password */
  canChangePassword: PropTypes.bool.isRequired,
  /** Whether or not the password section is visible to user */
  isPasswordAvailable: PropTypes.bool.isRequired,
  /** Whether or not password is currently enabled */
  isPasswordEnabled: PropTypes.bool.isRequired,
  passwordError: PropTypes.string,
  /** Information shown below password input box * */
  passwordInformationText: PropTypes.string,
  // Expiration props
  /** Whether or not user has permission to enable/disable/change expiration */
  canChangeExpiration: PropTypes.bool.isRequired,
  /** Current expiration timestamp, in milliseconds */
  expirationTimestamp: PropTypes.number,
  expirationError: PropTypes.string,
  // Allow download props
  /** Whether or not the download section is visible to user */
  isDownloadAvailable: PropTypes.bool.isRequired,
  /** Whether or not user has permission to enable/disable download */
  canChangeDownload: PropTypes.bool.isRequired,
  /** Whether or not download is currently enabled */
  isDownloadEnabled: PropTypes.bool.isRequired,
  // Direct link props
  /** URL for direct link */
  directLink: PropTypes.string.isRequired,
  /** Whether or not direct link is available */
  isDirectLinkAvailable: PropTypes.bool.isRequired,
  /** Whether or not direct link is unavailable only due to download setting */
  isDirectLinkUnavailableDueToDownloadSettings: PropTypes.bool.isRequired,
  /** Whether or not direct link is unavailable only due to access policy setting */
  isDirectLinkUnavailableDueToAccessPolicy: PropTypes.bool.isRequired,
  /** Whether or not direct link is unavailable only due to malicious content policy */
  isDirectLinkUnavailableDueToMaliciousContent: PropTypes.bool.isRequired,
  // Classification props
  item: PropTypes.object,
  // Hooks for resin
  cancelButtonProps: PropTypes.object,
  directLinkInputProps: PropTypes.object,
  downloadCheckboxProps: PropTypes.object,
  expirationCheckboxProps: PropTypes.object,
  expirationInputProps: PropTypes.object,
  modalProps: PropTypes.object,
  passwordCheckboxProps: PropTypes.object,
  passwordInputProps: PropTypes.object,
  saveButtonProps: PropTypes.object,
  vanityNameInputProps: PropTypes.object
});
_defineProperty(SharedLinkSettingsModal, "defaultProps", {
  cancelButtonProps: {},
  modalProps: {},
  saveButtonProps: {}
});
export default SharedLinkSettingsModal;
//# sourceMappingURL=SharedLinkSettingsModal.js.map