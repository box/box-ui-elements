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

import messages from './messages';

import type { SelectOptionProp } from '../../components/select-field/props';
import type { contactType as Contact } from './flowTypes';

import './ContactRestrictionNotice.scss';

type Props = {
    error?: React.Node,
    isFetchingJustificationReasons?: boolean,
    isRestrictionJustificationEnabled?: boolean,
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
    isFetchingJustificationReasons,
    isRestrictionJustificationEnabled,
    justificationReasons,
    onRemoveRestrictedExternalContacts,
    onSelectJustificationReason,
    restrictedExternalEmails,
    selectedContacts,
    selectedJustificationReason,
}: Props) => {
    const restrictedExternalContacts = selectedContacts.filter(({ value }) => restrictedExternalEmails.includes(value));
    const restrictedExternalContactCount = restrictedExternalContacts.length;

    if (!restrictedExternalContactCount) {
        return null;
    }

    const firstEmail = restrictedExternalContacts[0].value;
    const selectedValue = getProp(selectedJustificationReason, 'value', null);
    const isErrorTooltipShown = !!error;

    const restrictionNoticeMessage = isRestrictionJustificationEnabled
        ? messages.justifiableContactRestrictionNotice
        : messages.contactRestrictionNotice;
    const removeButtonLabelMessage = isRestrictionJustificationEnabled
        ? messages.justifiableContactRestrictionRemoveButtonLabel
        : messages.contactRestrictionRemoveButtonLabel;

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
                    values={{ count: restrictedExternalContactCount, email: firstEmail }}
                />
                {isRestrictionJustificationEnabled && justificationSelectSection}
                <PlainButton
                    className="bdl-ContactRestrictionNotice-removeBtn"
                    data-resin-target="removeBtn"
                    onClick={onRemoveRestrictedExternalContacts}
                >
                    <FormattedMessage
                        {...removeButtonLabelMessage}
                        values={{ count: restrictedExternalContactCount }}
                    />
                </PlainButton>
            </InlineNotice>
        </Tooltip>
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
