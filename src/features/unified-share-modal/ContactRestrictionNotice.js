// @flow

import * as React from 'react';
import noop from 'lodash/noop';
import getProp from 'lodash/get';
import { FormattedMessage, injectIntl } from 'react-intl';
import type { InjectIntlProvidedProps } from 'react-intl';

import Tooltip from '../../components/tooltip';
import PlainButton from '../../components/plain-button';
import InlineNotice from '../../components/inline-notice';
import LoadingIndicator from '../../components/loading-indicator/LoadingIndicator';
import SingleSelectField from '../../components/select-field/SingleSelectField';
import { COLLAB_RESTRICTION_TYPE_ACCESS_POLICY, COLLAB_RESTRICTION_TYPE_INFORMATION_BARRIER } from './constants';

import messages from './messages';

import type { SelectOptionProp } from '../../components/select-field/props';
import type { CollabRestrictionType, contactType as Contact } from './flowTypes';

import './ContactRestrictionNotice.scss';

const SINGLE_CONTACT = 'singleContact';
const MULTIPLE_CONTACTS = 'multipleContacts';
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
        [SINGLE_CONTACT]: messages.contactRestrictionNoticeInformationBarrierSingular,
        [MULTIPLE_CONTACTS]: messages.contactRestrictionNoticeInformationBarrier,
    },
};

type Props = {
    collabRestrictionType?: CollabRestrictionType,
    error?: React.Node,
    isFetchingJustificationReasons?: boolean,
    isRestrictionJustificationEnabled?: boolean,
    justificationReasons: Array<SelectOptionProp>,
    onRemoveRestrictedContacts: () => void,
    onSelectJustificationReason: (justificationReasonOption: SelectOptionProp) => void,
    restrictedEmails: Array<string>,
    selectedContacts: Array<Contact>,
    selectedJustificationReason: ?SelectOptionProp,
} & InjectIntlProvidedProps;

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
    selectedContacts,
    selectedJustificationReason,
}: Props) => {
    const restrictedContacts = selectedContacts.filter(({ value }) => restrictedEmails.includes(value));
    const restrictedContactCount = restrictedContacts.length;

    if (!restrictedContactCount) {
        return null;
    }

    const firstEmail = restrictedContacts[0].value;
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
        restrictionNoticeMessage =
            restrictionNoticeMessageMap[COLLAB_RESTRICTION_TYPE_INFORMATION_BARRIER][restrictedContactCountType];
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
                    values={{ count: restrictedContactCount, email: firstEmail }}
                />
                &nbsp;
                {isRestrictionJustificationEnabled && justificationSelectSection}
                <PlainButton
                    className="bdl-ContactRestrictionNotice-removeBtn"
                    data-resin-target="removeBtn"
                    onClick={onRemoveRestrictedContacts}
                >
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
