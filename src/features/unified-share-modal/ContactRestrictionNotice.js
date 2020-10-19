// @flow

import * as React from 'react';
import noop from 'lodash/noop';
import getProp from 'lodash/get';
import uniqueId from 'lodash/uniqueId';
import { FormattedMessage, injectIntl } from 'react-intl';
import type { InjectIntlProvidedProps } from 'react-intl';

import FormattedCompMessage from '../../components/i18n/FormattedCompMessage';
import Param from '../../components/i18n/Param';
import Label from '../../components/label';
import PlainButton from '../../components/plain-button';
import InlineNotice from '../../components/inline-notice';
import LoadingIndicator from '../../components/loading-indicator/LoadingIndicator';
import SingleSelectField from '../../components/select-field/SingleSelectField';

import ContactsEmailsTooltip from './ContactsEmailsTooltip';
import messages from './messages';

import type { SelectOptionProp } from '../../components/select-field/props';
import type { contactType as Contact } from './flowTypes';

import './ContactRestrictionNotice.scss';

type Props = {
    error?: React.Node,
    isLoading?: boolean,
    justificationReasons: Array<SelectOptionProp>,
    onRemoveRestrictedExternalContacts: () => void,
    onSelectJustificationReason: (justificationReasonOption: SelectOptionProp) => void,
    restrictedExternalEmails: Array<string>,
    selectedContacts: Array<Contact>,
    selectedJustificationReason: ?SelectOptionProp,
} & InjectIntlProvidedProps;

const ContactRestrictionNotice = ({
    error,
    intl,
    isLoading,
    justificationReasons,
    onRemoveRestrictedExternalContacts,
    onSelectJustificationReason,
    restrictedExternalEmails,
    selectedContacts,
    selectedJustificationReason,
}: Props) => {
    const compMessageId = uniqueId('compMessage');
    const restrictedExternalContacts = selectedContacts.filter(({ value }) => restrictedExternalEmails.includes(value));
    const restrictedExternalContactCount = restrictedExternalContacts.length;

    if (!restrictedExternalContactCount) {
        return null;
    }

    const RemoveButton = ({ children }: { children: React.Node }) => (
        <PlainButton
            className="bdl-ContactRestrictionNotice-removeBtn"
            data-resin-target="removeBtn"
            onClick={onRemoveRestrictedExternalContacts}
        >
            {children}
        </PlainButton>
    );

    // TODO:
    // Switch to react-intl v3+ api once migration is complete. FormattedCompMessage is now
    // deprecated and has some issues with components nested within <Plural/>, hence why we
    // use two messages and use unique keys as a workaround.

    const noticeDescriptionSingular = (
        <FormattedCompMessage
            key={compMessageId}
            description="Notice to display when sharing a file with external collaborators requires a business justification to be provided."
            id="boxui.unifiedShare.businessJustificationRequiredSingular"
        >
            This classified content requires business justification to collaborate with{' '}
            <ContactsEmailsTooltip contacts={restrictedExternalContacts}>1 person</ContactsEmailsTooltip>. Select a
            business justification below or <RemoveButton>remove them</RemoveButton> to continue.
        </FormattedCompMessage>
    );

    const noticeDescriptionPlural = (
        <FormattedCompMessage
            key={compMessageId}
            description="Notice to display when sharing a file with external collaborators requires a business justification to be provided."
            id="boxui.unifiedShare.businessJustificationRequiredPlural"
        >
            This classified content requires business justification to collaborate with{' '}
            <ContactsEmailsTooltip contacts={restrictedExternalContacts}>
                <Param
                    value={restrictedExternalContactCount}
                    description="Number of external collborators currently selected"
                />{' '}
                people
            </ContactsEmailsTooltip>
            . Select a business justification below or <RemoveButton>remove them</RemoveButton> to continue.
        </FormattedCompMessage>
    );

    const selectedValue = getProp(selectedJustificationReason, 'value', null);
    const noticeDescription =
        restrictedExternalContactCount === 1 ? noticeDescriptionSingular : noticeDescriptionPlural;

    return (
        <InlineNotice
            className="bdl-ContactRestrictionNotice"
            data-resin-component="contactRestrictionNotice"
            type="error"
        >
            <p className="bdl-ContactRestrictionNotice-description">{noticeDescription}</p>
            <Label text={<FormattedMessage {...messages.justificationSelectLabel} />}>
                {isLoading ? (
                    <LoadingIndicator className="bdl-ContactRestrictionNotice-loadingIndicator" />
                ) : (
                    <SingleSelectField
                        data-resin-target="justificationReasonsSelect"
                        error={error}
                        options={justificationReasons}
                        onChange={onSelectJustificationReason}
                        placeholder={intl.formatMessage(messages.justificationSelectPlaceholder)}
                        selectedValue={selectedValue}
                    />
                )}
            </Label>
        </InlineNotice>
    );
};

ContactRestrictionNotice.displayName = 'ContactRestrictionNotice';

ContactRestrictionNotice.defaultProps = {
    justificationReasons: [],
    onRemoveRestrictedExternalContacts: noop,
    onSelectJustificationReason: noop,
};

export { ContactRestrictionNotice as ContactRestrictionNoticeComponent };
export default injectIntl(ContactRestrictionNotice);
