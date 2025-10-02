function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import * as React from 'react';
import isString from 'lodash/isString';
import partition from 'lodash/partition';
import classNames from 'classnames';
import { FormattedMessage, injectIntl } from 'react-intl';
import TextArea from '../../components/text-area';
import PrimaryButton from '../../components/primary-button';
import { ModalActions } from '../../components/modal';
import Button from '../../components/button';
import Tooltip from '../../components/tooltip';
import InlineNotice from '../../components/inline-notice';
import PillSelectorDropdown from '../../components/pill-selector-dropdown';
import commonMessages from '../../common/messages';
import { emailValidator } from '../../utils/validators';
import IconGlobe from '../../icons/general/IconGlobe';
import ContactRestrictionNotice from './ContactRestrictionNotice';
import ContactsField from './ContactsField';
import hasRestrictedContacts from './utils/hasRestrictedContacts';
import isRestrictedContact from './utils/isRestrictedContact';
import messages from './messages';
class EmailForm extends React.Component {
  constructor(props) {
    super(props);
    _defineProperty(this, "contactsFieldRef", /*#__PURE__*/React.createRef());
    _defineProperty(this, "handleContactAdd", contacts => {
      const {
        selectedContacts,
        onContactAdd,
        updateSelectedContacts
      } = this.props;
      const updatedContacts = [...selectedContacts, ...contacts];
      updateSelectedContacts(updatedContacts);
      this.validateContacts(updatedContacts);
      if (onContactAdd) {
        onContactAdd(contacts);
      }
    });
    _defineProperty(this, "handleContactRemove", (option, index) => {
      const {
        onContactRemove,
        updateSelectedContacts
      } = this.props;
      const selectedContacts = this.props.selectedContacts.slice();
      const removed = selectedContacts.splice(index, 1);
      updateSelectedContacts(selectedContacts);
      this.validateContacts(selectedContacts);
      if (onContactRemove) {
        onContactRemove(removed);
      }
    });
    _defineProperty(this, "handleRemoveRestrictedContacts", () => {
      const {
        onContactRemove,
        selectedContacts,
        updateSelectedContacts
      } = this.props;
      const [removedContacts, remainingContacts] = partition(selectedContacts, contact => this.isRestrictedContact(contact));
      updateSelectedContacts(remainingContacts);
      this.validateContacts(remainingContacts);
      if (onContactRemove) {
        removedContacts.forEach(removedContact => {
          onContactRemove(removedContact);
        });
      }
    });
    _defineProperty(this, "validateContacts", selectedContacts => {
      const {
        contactLimit,
        intl
      } = this.props;
      let contactsFieldError = '';
      if (contactLimit !== undefined && selectedContacts.length > contactLimit) {
        contactsFieldError = intl.formatMessage(messages.contactsExceedLimitError, {
          maxContacts: contactLimit
        });
      } else if (selectedContacts.length === 0) {
        contactsFieldError = intl.formatMessage(messages.enterAtLeastOneEmailError);
      }
      this.setState({
        contactsFieldError
      });
      return contactsFieldError;
    });
    _defineProperty(this, "validateContactsRestrictions", () => {
      let contactsRestrictionError = '';
      const {
        selectedJustificationReason
      } = this.state;
      const {
        intl,
        isRestrictionJustificationEnabled,
        selectedContacts,
        restrictedEmails,
        restrictedGroups
      } = this.props;
      const hasRestrictedCollabs = hasRestrictedContacts(selectedContacts, restrictedEmails, restrictedGroups);
      const isMissingRequiredJustification = isRestrictionJustificationEnabled && !selectedJustificationReason;
      if (isMissingRequiredJustification) {
        contactsRestrictionError = intl.formatMessage(messages.justificationRequiredError);
      } else if (hasRestrictedCollabs && !isRestrictionJustificationEnabled) {
        contactsRestrictionError = intl.formatMessage(messages.restrictedContactsError);
      }
      this.setState({
        contactsRestrictionError
      });
      return contactsRestrictionError;
    });
    _defineProperty(this, "handleContactInput", value => {
      const {
        onContactInput
      } = this.props;
      if (onContactInput) {
        onContactInput(value);
      }
    });
    _defineProperty(this, "handleMessageChange", event => {
      const {
        target
      } = event;
      if (target instanceof HTMLTextAreaElement) {
        this.setState({
          message: target.value
        });
      }
    });
    _defineProperty(this, "handleSelectJustificationReason", selectedJustificationReason => {
      this.setState({
        selectedJustificationReason
      }, this.validateContactsRestrictions);
    });
    _defineProperty(this, "handleClose", () => {
      this.setState({
        message: '',
        contactsFieldError: '',
        selectedJustificationReason: null
      });
      this.props.updateSelectedContacts([]);

      /* Need to reset text in contacts field upon cancelling
         because the field still shows if the field isn't unmounted
         but only collapsed (like in invite collabs usage).
         inputValue doesn't get passed down through props but is
         internal state in pill selector. */
      if (this.contactsFieldRef.current) {
        this.contactsFieldRef.current.setState({
          inputValue: ''
        });
      }
      this.props.onRequestClose();
    });
    _defineProperty(this, "handleSubmit", event => {
      event.preventDefault();
      const {
        onSubmit,
        selectedContacts
      } = this.props;
      const {
        message,
        contactsFieldError,
        selectedJustificationReason
      } = this.state;
      if (contactsFieldError !== '') {
        // Block submission if there's a validation error
        return;
      }
      const contactsError = this.validateContacts(selectedContacts);
      const contactsRestrictionError = this.validateContactsRestrictions();
      if (contactsError || contactsRestrictionError) {
        return;
      }
      const emails = [];
      const groupIDs = [];
      const restrictedGroups = [];
      const restrictedEmails = [];
      selectedContacts.forEach(contact => {
        const {
          id,
          type,
          value
        } = contact;
        if (type === 'group') {
          groupIDs.push(value);
          if (this.isRestrictedContact(contact)) {
            restrictedGroups.push(id);
          }
        } else {
          if (this.isRestrictedContact(contact)) {
            restrictedEmails.push(value);
          }
          emails.push(value);
        }
      });
      onSubmit({
        emails,
        groupIDs,
        justificationReason: selectedJustificationReason,
        message,
        restrictedEmails,
        restrictedGroups
      }).catch(error => {
        // Remove sent emails from selected pills
        const invitedEmails = error.invitedEmails || [];
        this.filterSentEmails(invitedEmails);
      });
    });
    _defineProperty(this, "filterSentEmails", sentEmails => {
      this.props.updateSelectedContacts(this.props.selectedContacts.filter(({
        value
      }) => !sentEmails.includes(value)));
    });
    _defineProperty(this, "validateContactField", text => {
      const {
        intl
      } = this.props;
      let contactsFieldError = '';
      if (text && !emailValidator(text)) {
        contactsFieldError = intl.formatMessage(commonMessages.invalidEmailError);
      }
      this.setState({
        contactsFieldError
      });
    });
    _defineProperty(this, "isValidContactPill", contactPill => {
      let isValid = true;
      const {
        selectedJustificationReason
      } = this.state;
      const {
        isRestrictionJustificationEnabled
      } = this.props;
      if (isString(contactPill)) {
        // If we receive a string it means we're validating unparsed
        // pill selector input. Check that we have a valid email
        isValid = emailValidator(contactPill);
      } else {
        const hasRequiredJustification = !!selectedJustificationReason && isRestrictionJustificationEnabled;
        // Invalid emails are filtered out by ContactsField when parsing
        // new pills, so parsed pills can currently only be invalid
        // when user is restricted by a security policy
        isValid = !this.isRestrictedContact(contactPill) || hasRequiredJustification;
      }
      return isValid;
    });
    _defineProperty(this, "getContactPillClassName", contactPill => {
      const {
        selectedJustificationReason
      } = this.state;
      const {
        isRestrictionJustificationEnabled
      } = this.props;
      const hasRequiredJustification = !!selectedJustificationReason && isRestrictionJustificationEnabled;
      const isWaivedPill = this.isRestrictedContact(contactPill) && hasRequiredJustification;
      return isWaivedPill ? 'is-waived' : '';
    });
    _defineProperty(this, "isRestrictedContact", contact => {
      const {
        restrictedEmails,
        restrictedGroups
      } = this.props;
      return isRestrictedContact(contact, restrictedEmails, restrictedGroups);
    });
    this.state = {
      contactsFieldError: '',
      contactsRestrictionError: '',
      message: '',
      selectedJustificationReason: null
    };
  }
  componentDidUpdate(prevProps, prevState) {
    const {
      isRestrictionJustificationEnabled
    } = this.props;
    const {
      isRestrictionJustificationEnabled: prevIsRestrictionJustificationEnabled
    } = prevProps;
    const {
      contactsFieldError,
      contactsRestrictionError
    } = this.state;
    const {
      contactsFieldError: prevContactsFieldError,
      contactsRestrictionError: prevContactsRestrictionError
    } = prevState;

    // Only display one type of error at a time and give preference
    // to the one triggered most recently
    if (!prevContactsFieldError && contactsFieldError) {
      this.setState({
        contactsRestrictionError: ''
      });
    }
    if (!prevContactsRestrictionError && contactsRestrictionError) {
      this.setState({
        contactsFieldError: ''
      });
    }
    const didJustificationRequirementChange = isRestrictionJustificationEnabled !== prevIsRestrictionJustificationEnabled;

    // Clear selected justification when form state is reset
    if (didJustificationRequirementChange && !isRestrictionJustificationEnabled) {
      this.setState({
        selectedJustificationReason: null
      });
    }
  }
  render() {
    const {
      contactsFieldError,
      contactsRestrictionError,
      message,
      selectedJustificationReason
    } = this.state;
    const {
      cancelButtonProps,
      children,
      collabRestrictionType,
      config,
      contactsFieldAvatars,
      contactsFieldDisabledTooltip,
      contactsFieldLabel,
      inlineNotice,
      isContactsFieldEnabled,
      isExternalUserSelected,
      getContactAvatarUrl,
      getContacts,
      intl,
      isExpanded,
      isFetchingJustificationReasons,
      isRestrictionJustificationEnabled,
      justificationReasons,
      messageProps,
      onPillCreate,
      recommendedSharingTooltipCalloutName,
      restrictedEmails,
      restrictedGroups,
      selectedContacts,
      sendButtonProps,
      showEnterEmailsCallout,
      submitting,
      suggestedCollaborators
    } = this.props;
    const ftuxTooltipProps = {
      className: 'usm-ftux-tooltip',
      isShown: showEnterEmailsCallout,
      position: 'middle-right',
      showCloseButton: true,
      text: /*#__PURE__*/React.createElement(FormattedMessage, messages.enterEmailAddressesCalloutText),
      theme: 'callout'
    };
    const recommendedSharingTooltipProps = {
      isShown: !!recommendedSharingTooltipCalloutName,
      position: 'middle-left',
      text: /*#__PURE__*/React.createElement(FormattedMessage, _extends({}, messages.recommendedSharingTooltipCalloutText, {
        values: {
          fullName: recommendedSharingTooltipCalloutName
        }
      })),
      theme: 'callout'
    };
    const tooltipPropsToRender = recommendedSharingTooltipCalloutName ? recommendedSharingTooltipProps : ftuxTooltipProps;
    const contactsField = /*#__PURE__*/React.createElement("div", {
      className: "tooltip-target"
    }, /*#__PURE__*/React.createElement(Tooltip, tooltipPropsToRender, /*#__PURE__*/React.createElement(ContactsField, {
      disabled: !isContactsFieldEnabled,
      error: contactsFieldError,
      fieldRef: this.contactsFieldRef,
      getContacts: getContacts,
      getContactAvatarUrl: getContactAvatarUrl,
      getPillClassName: this.getContactPillClassName,
      label: contactsFieldLabel,
      onContactAdd: this.handleContactAdd,
      onContactRemove: this.handleContactRemove,
      onInput: this.handleContactInput,
      onPillCreate: onPillCreate,
      selectedContacts: selectedContacts,
      suggestedCollaborators: suggestedCollaborators,
      validateForError: this.validateContactField,
      validator: this.isValidContactPill,
      showContactAvatars: true
    })));
    let contactsFieldWrap;
    if (isContactsFieldEnabled) {
      contactsFieldWrap = contactsField;
    } else {
      contactsFieldWrap = /*#__PURE__*/React.createElement(Tooltip, {
        position: "bottom-center",
        text: contactsFieldDisabledTooltip
      }, contactsField);
    }
    const hideMessageSection = config && config.showInviteCollaboratorMessageSection === false;
    const shouldRenderContactRestrictionNotice = isExpanded && hasRestrictedContacts(selectedContacts, restrictedEmails, restrictedGroups);
    return /*#__PURE__*/React.createElement("form", {
      className: classNames({
        'is-expanded': isExpanded
      }),
      onSubmit: this.handleSubmit
    }, inlineNotice.content && isExpanded && /*#__PURE__*/React.createElement(InlineNotice, {
      type: inlineNotice.type
    }, inlineNotice.content), shouldRenderContactRestrictionNotice && /*#__PURE__*/React.createElement(ContactRestrictionNotice, {
      collabRestrictionType: collabRestrictionType,
      error: contactsRestrictionError,
      isFetchingJustificationReasons: isFetchingJustificationReasons,
      isRestrictionJustificationEnabled: isRestrictionJustificationEnabled,
      justificationReasons: justificationReasons,
      onRemoveRestrictedContacts: this.handleRemoveRestrictedContacts,
      restrictedEmails: restrictedEmails,
      restrictedGroups: restrictedGroups,
      selectedContacts: selectedContacts,
      selectedJustificationReason: selectedJustificationReason,
      onSelectJustificationReason: this.handleSelectJustificationReason
    }), contactsFieldAvatars, contactsFieldWrap, children, isExpanded && !hideMessageSection && /*#__PURE__*/React.createElement(TextArea, _extends({
      "data-testid": "be-emailform-message",
      label: /*#__PURE__*/React.createElement(FormattedMessage, messages.messageTitle),
      onChange: this.handleMessageChange,
      placeholder: intl.formatMessage(commonMessages.messageSelectorPlaceholder),
      rows: 3,
      value: message
    }, messageProps)), isExpanded && isExternalUserSelected && /*#__PURE__*/React.createElement("div", {
      className: "security-indicator-note"
    }, /*#__PURE__*/React.createElement("span", {
      className: "security-indicator-icon-globe"
    }, /*#__PURE__*/React.createElement(IconGlobe, {
      height: 12,
      width: 12
    })), /*#__PURE__*/React.createElement(FormattedMessage, messages.contentSharedWithExternalCollaborators)), isExpanded && /*#__PURE__*/React.createElement(ModalActions, null, /*#__PURE__*/React.createElement(Button, _extends({
      isDisabled: submitting,
      onClick: this.handleClose,
      type: "button"
    }, cancelButtonProps), /*#__PURE__*/React.createElement(FormattedMessage, commonMessages.cancel)), /*#__PURE__*/React.createElement(PrimaryButton, _extends({
      isDisabled: submitting,
      isLoading: submitting,
      type: "submit"
    }, sendButtonProps), /*#__PURE__*/React.createElement(FormattedMessage, commonMessages.send))));
  }
}
_defineProperty(EmailForm, "defaultProps", {
  messageProps: {},
  contactsFieldDisabledTooltip: null,
  isRestrictionJustificationEnabled: false,
  justificationReasons: [],
  restrictedEmails: [],
  restrictedGroups: []
});
export { EmailForm as EmailFormBase };
export default injectIntl(EmailForm);
//# sourceMappingURL=EmailForm.js.map