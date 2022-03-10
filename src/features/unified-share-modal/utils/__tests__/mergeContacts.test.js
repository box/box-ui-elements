import mergeContacts from '../mergeContacts';

describe('features/unified-share-modal/utils/mergeContacts', () => {
    const email = 'dev@box.com';
    const displayText = email;
    const id = email;
    const isExternalUser = true;
    const name = 'dev';
    const text = email;
    const type = 'user';
    const value = email;
    const contact = { displayText, text, value };
    const existingContacts = [contact];

    test('should take existing contacts and merge with new contacts', () => {
        const fetchedContacts = { [email]: { email, id, isExternalUser, name, type } };
        const expectedMergedContacts = [
            {
                email,
                id,
                isExternalUser,
                name,
                text: name,
                type,
                value,
            },
        ];

        const mergedContacts = mergeContacts(existingContacts, fetchedContacts);

        expect(mergedContacts).toEqual(expectedMergedContacts);
    });

    test('should return existing contact information if there is no new contact information in fetched contacts', () => {
        const fetchedContacts = {};
        const expectedMergedContacts = [{ email, id, isExternalUser, text, type, value }];

        const mergedContacts = mergeContacts(existingContacts, fetchedContacts);

        expect(mergedContacts).toEqual(expectedMergedContacts);
    });

    test('should return existing contact information if value matches but case does not match', () => {
        const caseSensitiveEmail = 'DeV@Box.COM';
        const fetchedContacts = { [email]: { email, id, isExternalUser, name, type } };
        const existingContactWithCaseChanges = [
            { displayText: caseSensitiveEmail, text: caseSensitiveEmail, value: caseSensitiveEmail },
        ];

        const expectedMergedContacts = [{ email, id, isExternalUser, text: name, name, type, value }];
        const mergedContacts = mergeContacts(existingContactWithCaseChanges, fetchedContacts);

        expect(mergedContacts).toEqual(expectedMergedContacts);
    });

    test('should return external user if not matched to internal user record', () => {
        const newEmail = 'dev+test@box.com';
        const newContact = [{ displayText: newEmail, text: newEmail, value: newEmail }];
        const expected = [
            { email: newEmail, id: newEmail, isExternalUser, text: newEmail, type: 'user', value: newEmail },
        ];

        expect(mergeContacts(newContact, {})).toEqual(expected);
    });
});
