// @flow
import type { contactType as Contact } from '../flowTypes';

const hasRestrictedExternalContacts = (contacts: Array<Contact>, restrictedExternalEmails: Array<string>): boolean => {
    if (!restrictedExternalEmails.length) {
        return false;
    }
    return contacts.some(({ value }) => restrictedExternalEmails.includes(value));
};

export default hasRestrictedExternalContacts;
