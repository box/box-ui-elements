function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import * as React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import debounce from 'lodash/debounce';
import noop from 'lodash/noop';
import classNames from 'classnames';
import PillSelectorDropdown from '../../components/pill-selector-dropdown';
import ContactDatalistItem from '../../components/contact-datalist-item';
import computeSuggestedCollabs from './utils/computeSuggestedCollabs';
import parseEmails from '../../utils/parseEmails';
import commonMessages from '../../common/messages';
import messages from './messages';
const isSubstring = (value, searchString) => {
  return value && value.toLowerCase().indexOf(searchString.toLowerCase()) !== -1;
};
class ContactsField extends React.Component {
  constructor(props) {
    super(props);
    _defineProperty(this, "addSuggestedContacts", contacts => {
      const {
        suggestedCollaborators = {}
      } = this.props;
      const {
        pillSelectorInputValue
      } = this.state;
      const [suggestedOptions, otherOptions] = computeSuggestedCollabs(contacts, suggestedCollaborators, pillSelectorInputValue);
      this.setState({
        numSuggestedShowing: suggestedOptions.length
      });
      return [...suggestedOptions, ...otherOptions];
    });
    _defineProperty(this, "filterContacts", contacts => {
      const {
        pillSelectorInputValue
      } = this.state;
      const {
        selectedContacts,
        suggestedCollaborators
      } = this.props;
      if (pillSelectorInputValue && contacts) {
        let fullContacts = contacts.filter(
        // filter contacts whose name or email don't match input value
        ({
          name,
          email
        }) => isSubstring(name, pillSelectorInputValue) || isSubstring(email, pillSelectorInputValue)).filter(
        // filter contacts who have already been selected
        ({
          email,
          id
        }) => !selectedContacts.find(({
          value
        }) => value === email || value === id));
        if (suggestedCollaborators) {
          fullContacts = this.addSuggestedContacts(fullContacts);
        }
        return fullContacts.map(({
          email,
          id,
          isExternalUser,
          name,
          type
        }) => ({
          // map to standardized DatalistItem format
          // TODO: refactor this so inline conversions aren't required at every usage
          email,
          id,
          isExternalUser,
          text: name,
          type,
          value: email || id // if email doesn't exist, contact is a group, use id
        }));
      }

      // return empty selector options if input value is empty
      return [];
    });
    _defineProperty(this, "getContactsPromise", query => {
      return this.props.getContacts(query).then(contacts => {
        const filteredContacts = this.filterContacts(contacts);
        this.setState({
          contacts: filteredContacts
        });
      }).catch(error => {
        if (error.isCanceled) {
          // silently fail - this happens often when requests get cancelled
          // due to overlapping requests
          return;
        }
        throw error;
      });
    });
    _defineProperty(this, "debouncedGetContacts", debounce(this.getContactsPromise, 200));
    _defineProperty(this, "handleParseItems", inputValue => {
      const {
        validator
      } = this.props;

      // ContactField allows invalid pills to be displayed in
      // in some cases (e.g., when user is external and external
      // collab is restricted). We don't allow, however, invalid
      // emails from the pill selector input to be turned into pills.
      const emails = parseEmails(inputValue);
      const validEmails = emails.filter(email => validator(email));
      return validEmails;
    });
    _defineProperty(this, "handlePillSelectorInput", value => {
      const {
        onInput
      } = this.props;
      const trimmedValue = value.trim();
      this.setState({
        pillSelectorInputValue: trimmedValue
      });
      if (onInput) {
        onInput(value);
      }
      if (!trimmedValue) {
        this.setState({
          contacts: []
        });
        return;
      }
      this.debouncedGetContacts(trimmedValue);
    });
    this.state = {
      contacts: [],
      numSuggestedShowing: 0,
      pillSelectorInputValue: ''
    };
  }
  render() {
    const {
      disabled,
      error,
      fieldRef,
      getContactAvatarUrl,
      getPillClassName,
      intl,
      label,
      onContactAdd,
      onContactRemove,
      onPillCreate,
      selectedContacts,
      showContactAvatars,
      validateForError,
      validator
    } = this.props;
    const {
      contacts,
      numSuggestedShowing
    } = this.state;
    const groupLabel = /*#__PURE__*/React.createElement(FormattedMessage, messages.groupLabel);
    const shouldShowSuggested = numSuggestedShowing > 0;
    const pillSelectorOverlayClasses = classNames({
      scrollable: contacts.length > 5
    });
    return /*#__PURE__*/React.createElement(PillSelectorDropdown, {
      allowCustomPills: true,
      allowInvalidPills: true,
      className: pillSelectorOverlayClasses,
      dividerIndex: shouldShowSuggested ? numSuggestedShowing : undefined,
      disabled: disabled,
      error: error,
      getPillClassName: getPillClassName,
      getPillImageUrl: getContactAvatarUrl,
      inputProps: {
        autoFocus: true,
        'data-target-id': 'PillSelectorDropdown-AddNamesOrEmailAddresses',
        onChange: noop
      },
      label: label,
      onInput: this.handlePillSelectorInput,
      onRemove: onContactRemove,
      onSelect: onContactAdd,
      onPillCreate: onPillCreate,
      overlayTitle: shouldShowSuggested ? intl.formatMessage(messages.suggestedCollabsTitle) : undefined,
      parseItems: this.handleParseItems,
      placeholder: intl.formatMessage(commonMessages.pillSelectorPlaceholder),
      ref: fieldRef,
      selectedOptions: selectedContacts,
      showAvatars: true,
      showRoundedPills: true,
      selectorOptions: contacts,
      validateForError: validateForError,
      validator: validator
    }, contacts.map(({
      email,
      isExternalUser,
      text = null,
      id,
      type
    }) => /*#__PURE__*/React.createElement(ContactDatalistItem, {
      getContactAvatarUrl: getContactAvatarUrl,
      key: id,
      id: id,
      type: type,
      isExternal: isExternalUser,
      name: text,
      subtitle: email || groupLabel,
      title: text,
      showAvatar: showContactAvatars
    })));
  }
}
_defineProperty(ContactsField, "defaultProps", {
  showContactAvatars: false
});
export { ContactsField as ContactsFieldBase };
export default injectIntl(ContactsField);
//# sourceMappingURL=ContactsField.js.map