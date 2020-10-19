// @flow

import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import take from 'lodash/take';

import Tooltip from '../../components/tooltip';
import messages from './messages';

import type { contactType as Contact } from './flowTypes';

import './ContactsEmailsTooltip.scss';

type Props = {
    children: React.Node,
    contacts: Array<Contact>,
    maxContacts: number,
};

const ContactsEmailsTooltip = ({ children, contacts, maxContacts }: Props) => {
    const contactsToDisplay = take(contacts, maxContacts);
    const remainingContactCount = contacts.length - contactsToDisplay.length;
    const emailsToDisplay = contactsToDisplay.map(({ email }) => email).join(', ');
    const isDisabled = !emailsToDisplay.length;

    const tooltipText = remainingContactCount ? (
        <FormattedMessage
            {...messages.contactEmailsTooltipText}
            values={{ emails: emailsToDisplay, remainingEmailsCount: remainingContactCount }}
        />
    ) : (
        emailsToDisplay
    );

    return (
        <Tooltip className="bdl-ContactsEmailsTooltip" text={tooltipText} isDisabled={isDisabled}>
            <span className="bdl-ContactsEmailsTooltip-target">{children}</span>
        </Tooltip>
    );
};

ContactsEmailsTooltip.displayName = 'ContactsEmailsTooltip';

ContactsEmailsTooltip.defaultProps = {
    contacts: [],
    maxContacts: 10,
};

export default ContactsEmailsTooltip;
