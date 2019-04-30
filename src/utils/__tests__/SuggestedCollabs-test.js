import { convertSuggestedCollabToContact, computeSuggestedContacts } from '../SuggestedCollabs';

const contacts = [
    {
        email: 'xxx@example.com',
        id: '12345',
        text: 'X User',
        name: 'X User',
        type: 'group',
        value: 'xxx@example.com',
    },
    {
        email: 'yyy@example.com',
        id: '23456',
        text: 'Y User',
        name: 'Y User',
        type: 'user',
        value: 'yyy@example.com',
    },
    {
        email: 'zzz@example.com',
        id: '34567',
        text: 'Z User',
        name: 'Z User',
        type: 'user',
        value: 'zzz@example.com',
    },
];
const convertedContact = {
    email: 'aaa@example.com',
    id: '98765',
    text: 'Serious',
    name: 'Serious',
    type: 'user',
    value: 'aaa@example.com',
};
const suggestedCollabs = {
    '23456': {
        id: '23456',
        userScore: 0.5,
        email: 'yyy@example.com',
        name: 'Y User',
    }, // contacts[1]
    '34567': {
        id: '34567',
        userScore: 0.1,
        email: 'zzz@example.com',
        name: 'Z User',
    }, // contacts[2]
    '98765': {
        id: '98765',
        userScore: 0.2,
        email: 'aaa@example.com',
        name: 'Serious',
    }, // not in contacts
};

describe('util/SuggestedCollabs', () => {
    describe('convertSuggestedCollaboratorToContact', () => {
        test('should convert from SuggestedCollab to Contact', () => {
            expect(convertSuggestedCollabToContact(suggestedCollabs['98765'])).toEqual(convertedContact);
        });
    });
    describe('computeSuggestedContacts', () => {
        test('should sort suggestions by highest score', () => {
            const result = computeSuggestedContacts(contacts, suggestedCollabs, 'User');
            expect(result).toEqual([contacts[1], contacts[2]]);
        });
        test('should prioritize contact matches over cached suggested matches', () => {
            const result = computeSuggestedContacts(contacts, suggestedCollabs, 'ser');
            expect(result).toEqual([contacts[1], contacts[2], convertedContact]);
        });
        test('should limit suggestions to maxSuggestions', () => {
            const result = computeSuggestedContacts(contacts, suggestedCollabs, 'User', 1);
            expect(result).toEqual([contacts[1]]);
        });
        test('should match suggested collaborators even when options are empty if a search matches', () => {
            const result = computeSuggestedContacts([], suggestedCollabs, 'User');
            expect(result).toEqual([contacts[1], contacts[2]]);
        });
        test('should match suggested collaborators by email address', () => {
            const result = computeSuggestedContacts([], suggestedCollabs, 'zzz');
            expect(result).toEqual([contacts[2]]);
        });
        test('should not match suggested collaborators on email address domain', () => {
            const result = computeSuggestedContacts([], suggestedCollabs, 'box');
            expect(result).toEqual([]);
        });
        test('should not match suggested collaborators when search is less than minCharacters', () => {
            const result = computeSuggestedContacts([], suggestedCollabs, 'User', 3, 5);
            expect(result).toEqual([]);
        });
    });
});
