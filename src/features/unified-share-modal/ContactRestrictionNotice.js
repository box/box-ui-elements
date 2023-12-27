// @flow

import * as React from 'react';
import noop from 'lodash/noop';
import getProp from 'lodash/get';
import { FormattedMessage, injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';

import Tooltip from '../../components/tooltip';
import PlainButton from '../../components/plain-button';
import InlineNotice from '../../components/inline-notice';
import LoadingIndicator from '../../components/loading-indicator/LoadingIndicator';
import SingleSelectField from '../../components/select-field/SingleSelectField';
import isRestrictedContact from './utils/isRestrictedContact';
import { COLLAB_RESTRICTION_TYPE_ACCESS_POLICY, COLLAB_RESTRICTION_TYPE_INFORMATION_BARRIER } from './constants';

import messages from './messages';

import type { SelectOptionProp } from '../../components/select-field/props';
import type { CollabRestrictionType, contactType as Contact } from './flowTypes';

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
            [MULTIPLE_CONTACTS]: messages.justifiableContactRestrictionNotice,
        },
        [RESTRICTION_JUSTIFICATION_DISABLED]: {
            [SINGLE_CONTACT]: messages.contactRestrictionNoticeSingular,
            [MULTIPLE_CONTACTS]: messages.contactRestrictionNotice,
        },
    },
    [COLLAB_RESTRICTION_TYPE_INFORMATION_BARRIER]: {
        [SINGLE_CONTACT]: {
            [EMAIL_CONTACT]: messages.contactRestrictionNoticeInformationBarrierSingular,
            [GROUP_CONTACT]: messages.contactRestrictionNoticeInformationBarrierSingularGroup,
        },
        [MULTIPLE_CONTACTS]: messages.contactRestrictionNoticeInformationBarrier,
    },
};

type Props = {
    collabRestrictionType?: CollabRestrictionType,
    error?: React.Node,
    intl: IntlShape,
    isFetchingJustificationReasons?: boolean,
    isRestrictionJustificationEnabled?: boolean,
    justificationReasons: Array<SelectOptionProp>,
    onRemoveRestrictedContacts: () => void,
    onSelectJustificationReason: (justificationReasonOption: SelectOptionProp) => void,
    restrictedEmails: Array<string>,
    restrictedGroups: Array<number>,
    selectedContacts: Array<Contact>,
    selectedJustificationReason: ?SelectOptionProp,
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
    selectedJustificationReason,
}: Props) => {
    const restrictedContacts = selectedContacts.filter(contact =>
        isRestrictedContact(contact, restrictedEmails, restrictedGroups),
    );
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

    const justificationStatus = isRestrictionJustificationEnabled
        ? RESTRICTION_JUSTIFICATION_ENABLED
        : RESTRICTION_JUSTIFICATION_DISABLED;
    const restrictedContactCountType = restrictedContactCount === 1 ? SINGLE_CONTACT : MULTIPLE_CONTACTS;

    const removeButtonLabelMessage = isRestrictionJustificationEnabled
        ? messages.justifiableContactRestrictionRemoveButtonLabel
        : messages.contactRestrictionRemoveButtonLabel;

    let restrictionNoticeMessage;
    // Information Barrier restrictions do not allow justifications
    if (collabRestrictionType === COLLAB_RESTRICTION_TYPE_INFORMATION_BARRIER) {
        if (restrictedContactCountType === SINGLE_CONTACT) {
            const contactType = isFirstContactAGroup ? GROUP_CONTACT : EMAIL_CONTACT;

            // Group names are displayed in quotes, which need to be localized, hence why
            // we need to use different messages for groups and emails
            restrictionNoticeMessage =
                restrictionNoticeMessageMap[COLLAB_RESTRICTION_TYPE_INFORMATION_BARRIER][SINGLE_CONTACT][contactType];
        } else {
            restrictionNoticeMessage =
                restrictionNoticeMessageMap[COLLAB_RESTRICTION_TYPE_INFORMATION_BARRIER][MULTIPLE_CONTACTS];
        }
    } else {
        restrictionNoticeMessage =
            restrictionNoticeMessageMap[collabRestrictionType][justificationStatus][restrictedContactCountType];
    }

    const justificationSelectSection = isFetchingJustificationReasons ? (
        <LoadingIndicator className="bdl-ContactRestrictionNotice-loadingIndicator" />
    ) : (
        <SingleSelectField
            data-resin-target="justificationReasonsSelect"
            options={justificationReasons}
            onChange={onSelectJustificationReason}
            placeholder={intl.formatMessage(messages.justificationSelectPlaceholder)}
            selectedValue={selectedValue}
        />
    );

    return (
        <Tooltip text={error} isShown={isErrorTooltipShown} position="middle-right" theme="error">
            <InlineNotice
                className="bdl-ContactRestrictionNotice"
                data-resin-component="contactRestrictionNotice"
                type="error"
            >
                <FormattedMessage
                    {...restrictionNoticeMessage}
                    values={{
                        count: restrictedContactCount,
                        // We use the first contact because email address and
                        // group name are only displayed for single contact messages
                        email: firstContactEmail,
                        groupName: firstContactGroupName,
                    }}
                />
                &nbsp;
                {isRestrictionJustificationEnabled && justificationSelectSection}
                <PlainButton
                    className="bdl-ContactRestrictionNotice-removeBtn"
                    data-resin-target="removeBtn"
                    onClick={onRemoveRestrictedContacts}
                >
                    {/* TODO: count was removed but need to keep it while translations are updated otherwise non-English messages will break */}
                    <FormattedMessage {...removeButtonLabelMessage} values={{ count: restrictedContactCount }} />
                </PlainButton>
            </InlineNotice>
        </Tooltip>
    );
};

ContactRestrictionNotice.displayName = 'ContactRestrictionNotice';

ContactRestrictionNotice.defaultProps = {
    justificationReasons: [],
    onRemoveRestrictedContacts: noop,
    onSelectJustificationReason: noop,
};

export { ContactRestrictionNotice as ContactRestrictionNoticeComponent };
export default injectIntl(ContactRestrictionNotice);
