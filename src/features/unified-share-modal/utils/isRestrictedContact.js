// @flow
import type { SelectOptionProp } from '../../../components/select-field/props';
import type { contactType as Contact } from '../flowTypes';

const isRestrictedContact = (
    contact: Contact | SelectOptionProp,
    restrictedEmails: Array<string>,
    restrictedGroups: Array<number>,
) => {
    let isRestrictedEmail = false;
    let isRestrictedGroup = false;

    if (contact.id && contact.type === 'group') {
        isRestrictedGroup = restrictedGroups.includes(Number(contact.id));
    } else {
        isRestrictedEmail = restrictedEmails.includes(String(contact.value));
    }
    return isRestrictedEmail || isRestrictedGroup;
};

export default isRestrictedContact;
