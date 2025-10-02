// @flow

import type { contactType as Contact } from '../flowTypes';

const mergeContacts = (existingContacts: Array<Contact>, fetchedContacts: Object): Array<Contact> => {
    const contactsMap = Object.keys(fetchedContacts).reduce((map, email) => {
        const contact = fetchedContacts[email];
        // Since objects are case-sensitive, normalize the key to lowercase.
        map[email.toLowerCase()] = { ...contact, text: contact.name, value: contact.email || contact.id };
        return map;
    }, {});

    return existingContacts.map(contact => {
        if (contact.id) {
            return contact;
        }
        return (
            // Normalize the getter in contactsMap so that matching existing contacts will be case-insensitive
            (contact.value && contactsMap[contact.value.toLowerCase()]) || {
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
