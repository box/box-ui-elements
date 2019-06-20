// @flow

import type { contactType as Contact } from '../flowTypes';

const mergeContacts = (existingContacts: Array<Contact>, fetchedContacts: Object): Array<Contact> => {
    const contactsMap = Object.keys(fetchedContacts).reduce((map, email) => {
        const contact = fetchedContacts[email];
        map[email] = { ...contact, text: contact.name, value: contact.email || contact.id };
        return map;
    }, {});

    return existingContacts.map(contact => {
        if (contact.id) {
            return contact;
        }
        return (
            (contact.value && contactsMap[contact.value]) || {
                email: String(contact.value),
                id: String(contact.value),
                isExternalUser: true,
                text: String(contact.value),
                type: 'user',
                value: contact.value,
            }
        );
    });
};

export default mergeContacts;
