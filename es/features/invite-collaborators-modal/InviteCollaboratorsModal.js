const _excluded = ["collaborationRestrictionWarning", "intl", "inviteButtonProps", "isEligibleForReferAFriendProgram", "itemName", "itemType", "submissionError", "submitting"];
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import omit from 'lodash/omit';
import throttle from 'lodash/throttle';
import { FormattedMessage, injectIntl } from 'react-intl';
import { UpgradeBadge } from '../../components/badge';
import Button from '../../components/button';
import InlineNotice from '../../components/inline-notice';
import PrimaryButton from '../../components/primary-button';
import Select from '../../components/select';
import TextArea from '../../components/text-area';
import { Link } from '../../components/link';
import { Modal, ModalActions } from '../../components/modal';
import ContactDatalistItem from '../../components/contact-datalist-item';
import PillSelectorDropdown from '../../components/pill-selector-dropdown';
import parseEmails from '../../utils/parseEmails';
import { RESIN_TAG_TARGET } from '../../common/variables';
import PermissionFlyout from './PermissionFlyout';
import ReferAFriendAd from './ReferAFriendAd';
import messages from './messages';
import commonMessages from '../../common/messages';
import './InviteCollaboratorsModal.scss';
const COLLAB_ROLE_FOR_FILE = 'Editor';
const INPUT_DELAY = 250;

/**
 * Returns true if the given value is a substring of the searchString
 * @param {String} value
 * @param {String} searchString
 * @return {boolean}
 */
const isSubstring = (value, searchString) => value && value.toLowerCase().indexOf(searchString.toLowerCase()) !== -1;
class InviteCollaboratorsModal extends Component {
  constructor(props) {
    super(props);
    _defineProperty(this, "getSelectorOptions", () => {
      const {
        contacts
      } = this.props;
      const {
        pillSelectorInputValue,
        selectedOptions
      } = this.state;
      if (pillSelectorInputValue !== '') {
        return contacts.filter(
        // filter contacts whose name or email don't match input value
        ({
          name,
          email
        }) => isSubstring(name, pillSelectorInputValue) || isSubstring(email, pillSelectorInputValue)).filter(
        // filter contacts who have already been selected
        ({
          email,
          id
        }) => !selectedOptions.find(({
          value
        }) => value === email || value === id)).map(({
          email,
          id,
          name,
          type
        }) => ({
          // map to standardized DatalistItem format
          // TODO: refactor this so inline conversions aren't required at every usage
          email,
          id,
          text: name,
          type,
          value: email || id // if email doesn't exist, contact is a group, use id
        }));
      }

      // return empty selector options if input value is empty
      return [];
    });
    _defineProperty(this, "closeModal", () => {
      this.setState({
        pillSelectorError: '',
        pillSelectorInputValue: '',
        selectedOptions: []
      });
      this.props.onRequestClose();
    });
    _defineProperty(this, "sendInvites", () => {
      const {
        intl,
        sendInvites
      } = this.props;
      const {
        message,
        permission,
        pillSelectorError,
        selectedOptions
      } = this.state;
      if (pillSelectorError) {
        // Block submission if there's a validation error
        return;
      }
      if (selectedOptions.length === 0) {
        // Block submission if no pills are selected
        this.setState({
          pillSelectorError: intl.formatMessage(commonMessages.requiredFieldError)
        });
        return;
      }
      const emails = [];
      const groupIDs = [];
      selectedOptions.forEach(({
        type,
        value
      }) => {
        if (type === 'group') {
          groupIDs.push(value);
        } else {
          emails.push(value);
        }
      });
      const params = {
        emails: emails.join(','),
        groupIDs: groupIDs.join(','),
        emailMessage: message,
        permission: permission || COLLAB_ROLE_FOR_FILE,
        numsOfInvitees: emails.length,
        numOfInviteeGroups: groupIDs.length
      };
      sendInvites(params).catch(error => {
        // Remove invited emails from selected pills
        const invitedEmails = error.invitedEmails || [];
        this.filterInvitedEmails(invitedEmails);
      });
    });
    _defineProperty(this, "filterInvitedEmails", invitedEmails => {
      this.setState({
        selectedOptions: this.state.selectedOptions.filter(({
          value
        }) => !invitedEmails.includes(value))
      });
    });
    _defineProperty(this, "handlePillSelectorInput", throttle(value => {
      const {
        onUserInput
      } = this.props;
      if (onUserInput) {
        onUserInput(value);
      }

      // As user is typing, reset error
      this.setState({
        pillSelectorError: '',
        pillSelectorInputValue: value
      });
    }, INPUT_DELAY));
    _defineProperty(this, "handlePillSelect", pills => {
      this.setState({
        selectedOptions: [...this.state.selectedOptions, ...pills]
      });
    });
    _defineProperty(this, "handlePillRemove", (option, index) => {
      const selectedOptions = this.state.selectedOptions.slice();
      selectedOptions.splice(index, 1);
      this.setState({
        selectedOptions
      });
    });
    _defineProperty(this, "validateForError", text => {
      const {
        intl
      } = this.props;
      let pillSelectorError = '';
      if (text && !this.validator(text)) {
        pillSelectorError = intl.formatMessage(commonMessages.invalidEmailError);
      }
      this.setState({
        pillSelectorError
      });
    });
    _defineProperty(this, "validator", text => {
      // email input validation
      const pattern = /^[^\s<>@,]+@[^\s<>@,/\\]+\.[^\s<>@,]+$/i;
      return pattern.test(text);
    });
    _defineProperty(this, "handlePermissionChange", ({
      target
    }) => {
      const {
        value
      } = target;
      this.setState({
        permission: value
      });
    });
    _defineProperty(this, "handleMessageChange", ({
      target
    }) => {
      const {
        value
      } = target;
      this.setState({
        message: value
      });
    });
    const {
      defaultPersonalMessage,
      inviteePermissions
    } = props;
    this.state = {
      message: defaultPersonalMessage || '',
      permission: inviteePermissions ? inviteePermissions[0].value : COLLAB_ROLE_FOR_FILE,
      pillSelectorError: '',
      pillSelectorInputValue: '',
      selectedOptions: []
    };
  }
  renderFileCollabComponents() {
    return /*#__PURE__*/React.createElement("div", {
      className: "invite-file-editors"
    }, /*#__PURE__*/React.createElement(FormattedMessage, messages.inviteFileEditorsLabel));
  }
  renderPermissionsSection() {
    const {
      inviteePermissions
    } = this.props;
    return /*#__PURE__*/React.createElement("div", {
      className: "invite-permissions-container"
    }, /*#__PURE__*/React.createElement(Select, {
      className: "select-container-medium",
      "data-resin-target": "selectpermission",
      label: /*#__PURE__*/React.createElement(FormattedMessage, messages.inviteePermissionsFieldLabel),
      name: "invite-permission",
      onChange: this.handlePermissionChange
    }, inviteePermissions.map(({
      value,
      disabled = false,
      text
    }) => /*#__PURE__*/React.createElement("option", {
      key: value,
      "data-resin-option": value,
      disabled: disabled,
      value: value
    }, text))), /*#__PURE__*/React.createElement(PermissionFlyout, null));
  }
  renderFolderCollabComponents() {
    const {
      defaultPersonalMessage,
      inviteePermissions,
      showUpgradeOptions
    } = this.props;
    return /*#__PURE__*/React.createElement("div", null, inviteePermissions && this.renderPermissionsSection(), showUpgradeOptions && /*#__PURE__*/React.createElement(Link, {
      className: "upgrade-link",
      href: "/upgrade"
    }, /*#__PURE__*/React.createElement(UpgradeBadge, null), /*#__PURE__*/React.createElement(FormattedMessage, messages.upgradeGetMoreAccessControls)), defaultPersonalMessage && /*#__PURE__*/React.createElement(TextArea, {
      cols: "30",
      "data-resin-feature": "personalmessage",
      "data-resin-target": "message",
      defaultValue: defaultPersonalMessage,
      label: /*#__PURE__*/React.createElement(FormattedMessage, messages.personalMessageLabel),
      name: "collab-message",
      onChange: this.handleMessageChange,
      rows: "4"
    }));
  }
  render() {
    const _this$props = this.props,
      {
        collaborationRestrictionWarning,
        intl,
        inviteButtonProps,
        isEligibleForReferAFriendProgram,
        itemName,
        itemType,
        submissionError,
        submitting
      } = _this$props,
      rest = _objectWithoutProperties(_this$props, _excluded);
    const {
      pillSelectorError,
      selectedOptions
    } = this.state;
    const modalProps = omit(rest, ['contacts', 'defaultPersonalMessage', 'inviteePermissions', 'itemTypedID', 'onRequestClose', 'onUserInput', 'sendInvites', 'showUpgradeOptions']);
    const selectorOptions = this.getSelectorOptions();
    const title = /*#__PURE__*/React.createElement(FormattedMessage, _extends({}, messages.inviteCollaboratorsModalTitle, {
      values: {
        itemName
      }
    }));
    const groupLabel = /*#__PURE__*/React.createElement(FormattedMessage, messages.groupLabel);
    return /*#__PURE__*/React.createElement(Modal, _extends({
      className: "invite-collaborators-modal",
      closeButtonProps: {
        [RESIN_TAG_TARGET]: 'close'
      },
      "data-resin-component": "modal",
      "data-resin-feature": "invitecollaborators",
      onRequestClose: this.closeModal,
      title: title
    }, modalProps), submissionError && /*#__PURE__*/React.createElement(InlineNotice, {
      type: "error"
    }, submissionError), collaborationRestrictionWarning && /*#__PURE__*/React.createElement(InlineNotice, {
      type: "warning"
    }, collaborationRestrictionWarning), /*#__PURE__*/React.createElement(PillSelectorDropdown, {
      allowCustomPills: true,
      error: pillSelectorError,
      label: /*#__PURE__*/React.createElement(FormattedMessage, messages.inviteFieldLabel),
      onInput: this.handlePillSelectorInput,
      onRemove: this.handlePillRemove,
      onSelect: this.handlePillSelect,
      parseItems: parseEmails,
      placeholder: intl.formatMessage(commonMessages.pillSelectorPlaceholder),
      selectedOptions: selectedOptions,
      selectorOptions: selectorOptions,
      validateForError: this.validateForError,
      validator: this.validator
    }, selectorOptions.map(({
      email,
      text,
      value
    }) => /*#__PURE__*/React.createElement(ContactDatalistItem, {
      key: value,
      name: text,
      subtitle: email || groupLabel
    }))), itemType === 'file' ? this.renderFileCollabComponents() : this.renderFolderCollabComponents(), isEligibleForReferAFriendProgram && /*#__PURE__*/React.createElement(ReferAFriendAd, null), /*#__PURE__*/React.createElement(ModalActions, null, /*#__PURE__*/React.createElement(Button, {
      "data-resin-target": "cancel",
      isDisabled: submitting,
      onClick: this.closeModal,
      type: "button"
    }, /*#__PURE__*/React.createElement(FormattedMessage, messages.inviteCollaboratorsModalCancelButton)), /*#__PURE__*/React.createElement(PrimaryButton, _extends({}, inviteButtonProps, {
      isDisabled: submitting,
      isLoading: submitting,
      onClick: this.sendInvites
    }), /*#__PURE__*/React.createElement(FormattedMessage, messages.inviteCollaboratorsModalSendInvitesButton))));
  }
}
_defineProperty(InviteCollaboratorsModal, "propTypes", {
  /** Message warning about restrictions regarding inviting collaborators to the item */
  collaborationRestrictionWarning: PropTypes.node,
  /** An array of contacts for the pill selector dropdown */
  contacts: PropTypes.arrayOf(PropTypes.shape({
    email: PropTypes.string,
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isrequired,
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired
  })).isRequired,
  /**
   * Default personal message for inviting collaborators to the item.
   * Do not include if no personal message textarea should show up.
   * Only applicable to non-file item types.
   * */
  defaultPersonalMessage: PropTypes.node,
  intl: PropTypes.any,
  /** Props for the invite button */
  inviteButtonProps: PropTypes.object,
  /** An array of invitee permissions */
  inviteePermissions: PropTypes.arrayOf(PropTypes.shape({
    disabled: PropTypes.bool,
    text: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired
  })),
  /** If true, will render a link to the refer-a-friend reward center */
  isEligibleForReferAFriendProgram: PropTypes.bool,
  /** The name of the item to invite collaborators for */
  itemName: PropTypes.string.isRequired,
  /** The type of the item to invite collaborators for (e.g. "file", "folder") */
  itemType: PropTypes.string.isRequired,
  /** The typed id of the item to invite collaborators for */
  itemTypedID: PropTypes.string.isRequired,
  /** Handler function for closing the modal */
  onRequestClose: PropTypes.func.isRequired,
  /** Handler function whenever the user types, e.g. to fetch contacts. */
  onUserInput: PropTypes.func,
  /**
   * Function to send collab invitations based on the given parameters object.
   * This function should return a Promise.
   */
  sendInvites: PropTypes.func.isRequired,
  /**
   * Flag to show link to upgrade and get more access controls.
   * Only applicable to non-file item types.
   */
  showUpgradeOptions: PropTypes.bool,
  /** Message indicating an error occurred while sending the invites. */
  submissionError: PropTypes.node,
  /**
   * Flag indicating whether the send invites request is submitting.
   */
  submitting: PropTypes.bool
});
_defineProperty(InviteCollaboratorsModal, "defaultProps", {
  inviteButtonProps: {}
});
export { InviteCollaboratorsModal as InviteCollaboratorsModalBase };
export default injectIntl(InviteCollaboratorsModal);
//# sourceMappingURL=InviteCollaboratorsModal.js.map