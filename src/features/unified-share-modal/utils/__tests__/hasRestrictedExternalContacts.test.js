import hasRestrictedExternalContacts from '../hasRestrictedExternalContacts';

describe('features/unified-share-modal/utils/hasRestrictedExternalContacts', () => {
    const contacts = [
        {
            email: 'x@example.com',
            id: '12345',
            text: 'X User',
            type: 'group',
            value: 'x@example.com',
        },
        {
            email: 'y@example.com',
            id: '23456',
            text: 'Y User',
            type: 'user',
            value: 'y@example.com',
        },
        {
            email: 'z@example.com',
            id: '34567',
            text: 'Z User',
            type: 'user',
            value: 'z@example.com',
        },
    ];

    test('should return false when no restricted external emails are found within contacts', () => {
        let restrictedExternalEmails;

        restrictedExternalEmails = [];
        expect(hasRestrictedExternalContacts(contacts, restrictedExternalEmails)).toBe(false);

        restrictedExternalEmails = ['a@example.com', 'b@example.com'];
        expect(hasRestrictedExternalContacts(contacts, restrictedExternalEmails)).toBe(false);
    });

    test('should return true when at least one restricted external email is found within contacts', () => {
        let restrictedExternalEmails;

        restrictedExternalEmails = ['z@example.com'];
        expect(hasRestrictedExternalContacts(contacts, restrictedExternalEmails)).toBe(true);

        restrictedExternalEmails = ['x@example.com', 'y@example.com', 'z@example.com'];
        expect(hasRestrictedExternalContacts(contacts, restrictedExternalEmails)).toBe(true);
    });
});
