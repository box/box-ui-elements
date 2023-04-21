import hasRestrictedContacts from '../hasRestrictedContacts';

describe('features/unified-share-modal/utils/hasRestrictedContacts', () => {
    const contacts = [
        {
            id: 12345,
            text: 'X User',
            type: 'group',
        },
        {
            email: 'y@example.com',
            id: 23456,
            text: 'Y User',
            type: 'user',
            value: 'y@example.com',
        },
        {
            email: 'z@example.com',
            id: 34567,
            text: 'Z User',
            type: 'user',
            value: 'z@example.com',
        },
    ];

    test('should return false when no restricted emails are found within contacts', () => {
        let restrictedEmails;

        restrictedEmails = [];
        expect(hasRestrictedContacts(contacts, restrictedEmails, [])).toBe(false);

        restrictedEmails = ['a@example.com', 'b@example.com'];
        expect(hasRestrictedContacts(contacts, restrictedEmails, [])).toBe(false);
    });

    test('should return false when no restricted groups are found within contacts', () => {
        let restrictedGroups = [];

        restrictedGroups = [];
        expect(hasRestrictedContacts(contacts, [], restrictedGroups)).toBe(false);

        restrictedGroups = [1111];
        expect(hasRestrictedContacts(contacts, [], restrictedGroups)).toBe(false);
    });

    test('should return true when at least one restricted email is found within contacts', () => {
        let restrictedEmails;

        restrictedEmails = ['z@example.com'];
        expect(hasRestrictedContacts(contacts, restrictedEmails, [])).toBe(true);

        restrictedEmails = ['y@example.com', 'z@example.com'];
        expect(hasRestrictedContacts(contacts, restrictedEmails, [])).toBe(true);
    });

    test('should return true when at least one restricted group is found within contacts', () => {
        const restrictedGroups = [12345];

        expect(hasRestrictedContacts(contacts, [], restrictedGroups)).toBe(true);
    });
});
