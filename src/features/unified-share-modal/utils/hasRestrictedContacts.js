// @flow
import type { contactType as Contact } from '../flowTypes';

const hasRestrictedContacts = (
    contacts: Array<Contact>,
    restrictedEmails: Array<string>,
    restrictedGroups: Array<number>,
): boolean => {
    if (!restrictedEmails.length && !restrictedGroups.length) {
        return false;
    }
    const hasRestrictedGroups = contacts.some(({ id }) => restrictedGroups.includes(id));
    const hasRestrictedEmails = contacts.some(({ value }) => restrictedEmails.includes(value));

    return hasRestrictedGroups || hasRestrictedEmails;
};

export default hasRestrictedContacts;
