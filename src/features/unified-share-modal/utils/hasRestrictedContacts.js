// @flow
import type { contactType as Contact } from '../flowTypes';

const hasRestrictedContacts = (contacts: Array<Contact>, restrictedEmails: Array<string>): boolean => {
    if (!restrictedEmails.length) {
        return false;
    }
    return contacts.some(({ value }) => restrictedEmails.includes(value));
};

export default hasRestrictedContacts;
