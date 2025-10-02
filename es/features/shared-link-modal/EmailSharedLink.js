function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage, injectIntl } from 'react-intl';
import PillSelectorDropdown from '../../components/pill-selector-dropdown';
import ContactDatalistItem from '../../components/contact-datalist-item';
import TextArea from '../../components/text-area';
import PrimaryButton from '../../components/primary-button';
import { ModalActions } from '../../components/modal';
import Button from '../../components/button';
import parseEmails from '../../utils/parseEmails';
import commonMessages from '../../common/messages';
import messages from './messages';
import './EmailSharedLink.scss';
class EmailSharedLink extends Component {
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
    _defineProperty(this, "handlePillSelectorInput", value => {
      const {
        getContacts
      } = this.props;
      const trimmedValue = value.trim();
      getContacts(trimmedValue);

      // As user is typing, reset error
      this.setState({
        pillSelectorError: '',
        pillSelectorInputValue: trimmedValue
      });
    });
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
        intl: {
          formatMessage
        }
      } = this.props;
      let pillSelectorError = '';
      if (text && !this.validator(text)) {
        pillSelectorError = formatMessage(commonMessages.invalidEmailError);
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
    _defineProperty(this, "sendEmail", event => {
      event.preventDefault();
      const {
        intl: {
          formatMessage
        },
        sendEmail
      } = this.props;
      const {
        selectedOptions,
        emailMessage,
        pillSelectorError
      } = this.state;
      if (pillSelectorError !== '') {
        return;
      }
      if (selectedOptions.length === 0) {
        // Block submission if no pills are selected
        this.setState({
          pillSelectorError: formatMessage(messages.enterAtLeastOneEmailError)
        });
        return;
      }
      sendEmail({
        emails: selectedOptions.map(({
          value
        }) => value),
        emailMessage
      });
    });
    _defineProperty(this, "handleMessageChange", event => {
      this.setState({
        emailMessage: event.target.value
      });
    });
    const {
      defaultEmailMessage
    } = props;
    this.state = {
      pillSelectorError: '',
      pillSelectorInputValue: '',
      emailMessage: defaultEmailMessage || '',
      selectedOptions: []
    };
  }
  render() {
    const {
      pillSelectorError,
      selectedOptions,
      emailMessage
    } = this.state;
    const {
      emailMessageProps,
      intl: {
        formatMessage
      },
      isExpanded,
      onExpand,
      onRequestClose,
      submitting
    } = this.props;
    const selectorOptions = this.getSelectorOptions();
    return /*#__PURE__*/React.createElement("form", {
      onSubmit: this.sendEmail,
      className: classNames('email-shared-link', {
        'is-expanded': isExpanded
      })
    }, /*#__PURE__*/React.createElement(PillSelectorDropdown, {
      allowCustomPills: true,
      error: pillSelectorError,
      label: /*#__PURE__*/React.createElement(FormattedMessage, messages.emailSharedLink),
      inputProps: _objectSpread({
        onFocus: onExpand
      }, emailMessageProps),
      onInput: this.handlePillSelectorInput,
      onRemove: this.handlePillRemove,
      onSelect: this.handlePillSelect,
      parseItems: parseEmails,
      placeholder: formatMessage(commonMessages.pillSelectorPlaceholder),
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
      subtitle: email
    }))), /*#__PURE__*/React.createElement(TextArea, {
      isRequired: true,
      label: /*#__PURE__*/React.createElement(FormattedMessage, messages.messageTitle),
      onChange: this.handleMessageChange,
      rows: 3,
      value: emailMessage
    }), isExpanded && /*#__PURE__*/React.createElement(ModalActions, null, /*#__PURE__*/React.createElement(Button, {
      isDisabled: submitting,
      onClick: onRequestClose,
      type: "button"
    }, /*#__PURE__*/React.createElement(FormattedMessage, commonMessages.cancel)), /*#__PURE__*/React.createElement(PrimaryButton, {
      isDisabled: submitting,
      isLoading: submitting,
      type: "submit"
    }, /*#__PURE__*/React.createElement(FormattedMessage, commonMessages.send))));
  }
}
_defineProperty(EmailSharedLink, "propTypes", {
  contacts: PropTypes.arrayOf(PropTypes.shape({
    email: PropTypes.string,
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isrequired,
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired
  })).isRequired,
  defaultEmailMessage: PropTypes.string,
  emailMessageProps: PropTypes.object,
  intl: PropTypes.any,
  getContacts: PropTypes.func.isRequired,
  isExpanded: PropTypes.bool,
  onExpand: PropTypes.func.isRequired,
  onRequestClose: PropTypes.func.isRequired,
  sendEmail: PropTypes.func.isRequired,
  submitting: PropTypes.bool
});
_defineProperty(EmailSharedLink, "defaultProps", {
  emailMessageProps: {}
});
export { EmailSharedLink as EmailSharedLinkBase };
export default injectIntl(EmailSharedLink);
//# sourceMappingURL=EmailSharedLink.js.map