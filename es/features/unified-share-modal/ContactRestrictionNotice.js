function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import * as React from 'react';
import noop from 'lodash/noop';
import getProp from 'lodash/get';
import { FormattedMessage, injectIntl } from 'react-intl';
import Tooltip from '../../components/tooltip';
import PlainButton from '../../components/plain-button';
import InlineNotice from '../../components/inline-notice';
import LoadingIndicator from '../../components/loading-indicator/LoadingIndicator';
import SingleSelectField from '../../components/select-field/SingleSelectField';
import isRestrictedContact from './utils/isRestrictedContact';
import { COLLAB_RESTRICTION_TYPE_ACCESS_POLICY, COLLAB_RESTRICTION_TYPE_INFORMATION_BARRIER } from './constants';
import messages from './messages';
import './ContactRestrictionNotice.scss';
const SINGLE_CONTACT = 'singleContact';
const MULTIPLE_CONTACTS = 'multipleContacts';
const EMAIL_CONTACT = 'email';
const GROUP_CONTACT = 'group';
const RESTRICTION_JUSTIFICATION_ENABLED = 'restrictionJustificationEnabled';
const RESTRICTION_JUSTIFICATION_DISABLED = 'restrictionJustificationDisabled';
const restrictionNoticeMessageMap = {
  [COLLAB_RESTRICTION_TYPE_ACCESS_POLICY]: {
    [RESTRICTION_JUSTIFICATION_ENABLED]: {
      [SINGLE_CONTACT]: messages.justifiableContactRestrictionNoticeSingular,
      [MULTIPLE_CONTACTS]: messages.justifiableContactRestrictionNotice
    },
    [RESTRICTION_JUSTIFICATION_DISABLED]: {
      [SINGLE_CONTACT]: messages.contactRestrictionNoticeSingular,
      [MULTIPLE_CONTACTS]: messages.contactRestrictionNotice
    }
  },
  [COLLAB_RESTRICTION_TYPE_INFORMATION_BARRIER]: {
    [SINGLE_CONTACT]: {
      [EMAIL_CONTACT]: messages.contactRestrictionNoticeInformationBarrierSingular,
      [GROUP_CONTACT]: messages.contactRestrictionNoticeInformationBarrierSingularGroup
    },
    [MULTIPLE_CONTACTS]: messages.contactRestrictionNoticeInformationBarrier
  }
};
const ContactRestrictionNotice = ({
  collabRestrictionType = COLLAB_RESTRICTION_TYPE_ACCESS_POLICY,
  error,
  intl,
  isFetchingJustificationReasons,
  isRestrictionJustificationEnabled,
  justificationReasons,
  onRemoveRestrictedContacts,
  onSelectJustificationReason,
  restrictedEmails,
  restrictedGroups,
  selectedContacts,
  selectedJustificationReason
}) => {
  const restrictedContacts = selectedContacts.filter(contact => isRestrictedContact(contact, restrictedEmails, restrictedGroups));
  const restrictedContactCount = restrictedContacts.length;
  if (!restrictedContactCount) {
    return null;
  }
  const [firstContact] = restrictedContacts;
  const isFirstContactAGroup = firstContact.type === 'group';
  const firstContactEmail = isFirstContactAGroup ? undefined : firstContact.value;
  const firstContactGroupName = isFirstContactAGroup ? firstContact.text : undefined;
  const selectedValue = getProp(selectedJustificationReason, 'value', null);
  const isErrorTooltipShown = !!error;
  const justificationStatus = isRestrictionJustificationEnabled ? RESTRICTION_JUSTIFICATION_ENABLED : RESTRICTION_JUSTIFICATION_DISABLED;
  const restrictedContactCountType = restrictedContactCount === 1 ? SINGLE_CONTACT : MULTIPLE_CONTACTS;
  const removeButtonLabelMessage = isRestrictionJustificationEnabled ? messages.justifiableContactRestrictionRemoveButtonLabel : messages.contactRestrictionRemoveButtonLabel;
  let restrictionNoticeMessage;
  // Information Barrier restrictions do not allow justifications
  if (collabRestrictionType === COLLAB_RESTRICTION_TYPE_INFORMATION_BARRIER) {
    if (restrictedContactCountType === SINGLE_CONTACT) {
      const contactType = isFirstContactAGroup ? GROUP_CONTACT : EMAIL_CONTACT;

      // Group names are displayed in quotes, which need to be localized, hence why
      // we need to use different messages for groups and emails
      restrictionNoticeMessage = restrictionNoticeMessageMap[COLLAB_RESTRICTION_TYPE_INFORMATION_BARRIER][SINGLE_CONTACT][contactType];
    } else {
      restrictionNoticeMessage = restrictionNoticeMessageMap[COLLAB_RESTRICTION_TYPE_INFORMATION_BARRIER][MULTIPLE_CONTACTS];
    }
  } else {
    restrictionNoticeMessage = restrictionNoticeMessageMap[collabRestrictionType][justificationStatus][restrictedContactCountType];
  }
  const justificationSelectSection = isFetchingJustificationReasons ? /*#__PURE__*/React.createElement(LoadingIndicator, {
    className: "bdl-ContactRestrictionNotice-loadingIndicator"
  }) : /*#__PURE__*/React.createElement(SingleSelectField, {
    "data-resin-target": "justificationReasonsSelect",
    options: justificationReasons,
    onChange: onSelectJustificationReason,
    placeholder: intl.formatMessage(messages.justificationSelectPlaceholder),
    selectedValue: selectedValue
  });
  return /*#__PURE__*/React.createElement(Tooltip, {
    text: error,
    isShown: isErrorTooltipShown,
    position: "middle-right",
    theme: "error"
  }, /*#__PURE__*/React.createElement(InlineNotice, {
    className: "bdl-ContactRestrictionNotice",
    "data-resin-component": "contactRestrictionNotice",
    type: "error"
  }, /*#__PURE__*/React.createElement(FormattedMessage, _extends({}, restrictionNoticeMessage, {
    values: {
      count: restrictedContactCount,
      // We use the first contact because email address and
      // group name are only displayed for single contact messages
      email: firstContactEmail,
      groupName: firstContactGroupName
    }
  })), "\xA0", isRestrictionJustificationEnabled && justificationSelectSection, /*#__PURE__*/React.createElement(PlainButton, {
    className: "bdl-ContactRestrictionNotice-removeBtn",
    "data-resin-target": "removeBtn",
    onClick: onRemoveRestrictedContacts
  }, /*#__PURE__*/React.createElement(FormattedMessage, _extends({}, removeButtonLabelMessage, {
    values: {
      count: restrictedContactCount
    }
  })))));
};
ContactRestrictionNotice.displayName = 'ContactRestrictionNotice';
ContactRestrictionNotice.defaultProps = {
  justificationReasons: [],
  onRemoveRestrictedContacts: noop,
  onSelectJustificationReason: noop
};
export { ContactRestrictionNotice as ContactRestrictionNoticeComponent };
export default injectIntl(ContactRestrictionNotice);
//# sourceMappingURL=ContactRestrictionNotice.js.map