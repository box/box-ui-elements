import isRestrictedContact from '../isRestrictedContact';

describe('features/unified-share-modal/utils/isRestrictedContact', () => {
    const groupContact = {
        id: 12345,
        text: 'X User',
        type: 'group',
    };
    const userContact = {
        email: 'y@example.com',
        id: 23456,
        text: 'Y User',
        type: 'user',
        value: 'y@example.com',
    };

    test.each`
        contact         | restrictedEmails     | restrictedGroups | description                                                                      | expectedResult
        ${groupContact} | ${[]}                | ${[]}            | ${'is group contact and restrictedEmails and restrictedGroups are empty'}        | ${false}
        ${userContact}  | ${[]}                | ${[]}            | ${'is user contact and restrictedEmails and restrictedGroups are empty'}         | ${false}
        ${groupContact} | ${[]}                | ${[1111]}        | ${'group contact id is not in restrictedGroups'}                                 | ${false}
        ${userContact}  | ${['a@example.com']} | ${[]}            | ${'user contact email is not in restrictedEmails'}                               | ${false}
        ${groupContact} | ${[]}                | ${[12345]}       | ${'group contact id is in restrictedGroups'}                                     | ${true}
        ${userContact}  | ${['y@example.com']} | ${[]}            | ${'user contact email is in restrictedEmails'}                                   | ${true}
        ${groupContact} | ${['y@example.com']} | ${[12345]}       | ${'group contact id is in restrictedGroups and restrictedEmails is not empty'}   | ${true}
        ${userContact}  | ${['y@example.com']} | ${[12345]}       | ${'user contact email is in restrictedEmails and restrictedGroups is not empty'} | ${true}
    `(
        'should return $expectedResult when $description',
        ({ contact, restrictedEmails, restrictedGroups, expectedResult }) => {
            expect(isRestrictedContact(contact, restrictedEmails, restrictedGroups)).toBe(expectedResult);
        },
    );
});
