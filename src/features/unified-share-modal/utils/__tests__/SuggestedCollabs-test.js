import computeSuggestedCollabs from '../computeSuggestedCollabs';

const contacts = [
    {
        email: 'xxx@example.com',
        id: '1',
        text: 'X User',
        name: 'X User',
        type: 'group',
        value: 'xxx@example.com',
        isExternalUser: false,
    },
    {
        email: 'yyy@example.com',
        id: '2',
        text: 'Y User',
        name: 'Y User',
        type: 'user',
        value: 'yyy@example.com',
        isExternalUser: false,
    },
    {
        email: 'zzz@example.com',
        id: '3',
        text: 'Z User',
        name: 'Z User',
        type: 'user',
        value: 'zzz@example.com',
        isExternalUser: true,
    },
];
const suggestedCollabs = {
    '2': {
        id: '2',
        userScore: 0.5,
        email: 'yyy@example.com',
        name: 'Y User',
        type: 'user',
        isExternalUser: false,
    }, // contacts[1]
    '3': {
        id: '3',
        userScore: 0.1,
        email: 'zzz@example.com',
        name: 'Z User',
        type: 'user',
        isExternalUser: true,
    }, // contacts[2]
    '4': {
        id: '4',
        userScore: 0.2,
        email: 'aaa@example.com',
        name: 'Serious',
        type: 'user',
        isExternalUser: true,
    }, // not in contacts
};

describe('util/SuggestedCollabs', () => {
    describe('computeSuggestedContacts', () => {
        test('should sort suggestions by highest score', () => {
            const suggested = computeSuggestedCollabs(contacts, suggestedCollabs, 'User')[0];
            expect(suggested).toEqual([suggestedCollabs['2'], suggestedCollabs['3']]);
        });
        test('should return the rest of the contacts not suggested', () => {
            const rest = computeSuggestedCollabs(contacts, suggestedCollabs, 'User')[1];
            expect(rest).toEqual([contacts[0]]);
        });
        test('should prioritize contact matches over cached suggested matches', () => {
            const [suggested, rest] = computeSuggestedCollabs(contacts, suggestedCollabs, 'ser');
            expect(suggested).toEqual([suggestedCollabs['2'], suggestedCollabs['3'], suggestedCollabs['4']]);
            expect(rest).toEqual([contacts[0]]);
        });
        test('should limit suggestions to maxSuggestions', () => {
            const [suggested, rest] = computeSuggestedCollabs(contacts, suggestedCollabs, 'User', 1);
            expect(suggested).toEqual([suggestedCollabs['2']]);
            expect(rest).toEqual([contacts[0], contacts[2]]);
        });
        test('should match suggested collaborators even when options are empty if a search matches', () => {
            const result = computeSuggestedCollabs([], suggestedCollabs, 'User')[0];
            expect(result).toEqual([suggestedCollabs['2'], suggestedCollabs['3']]);
        });
        test('should match suggested collaborators by email address', () => {
            const result = computeSuggestedCollabs([], suggestedCollabs, 'zzz')[0];
            expect(result).toEqual([suggestedCollabs['3']]);
        });
        test('should not match suggested collaborators on email address domain', () => {
            const result = computeSuggestedCollabs([], suggestedCollabs, 'box')[0];
            expect(result).toEqual([]);
        });
        test('should not match suggested collaborators when search is less than minCharacters', () => {
            const result = computeSuggestedCollabs([], suggestedCollabs, 'User', 3, 5)[0];
            expect(result).toEqual([]);
        });
    });
});
