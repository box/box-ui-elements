import Tokenservice from '../TokenService';

const tokenMapGenerator = (id) => Promise.resolve({ [id]: 'token' });
const tokenGenerator = () => Promise.resolve('token');
const junkTokenGenerator = () => Promise.resolve(123);
const nullTokenGenerator = () => Promise.resolve(null);
const undefinedTokenGenerator = () => Promise.resolve();

const tokensMapGenerator = (ids) => Promise.resolve({ [ids[0]]: 'token1', [ids[1]]: 'token2' });
const tokensGenerator = (ids) => Promise.resolve({ [ids[0]]: 'token1', [ids[1]]: 'token2' });
const nullTokensGenerator = (ids) => Promise.resolve({ [ids[0]]: null, [ids[1]]: null });
const undefinedTokensGenerator = (ids) => Promise.resolve({ [ids[0]]: undefined, [ids[1]]: undefined });

describe('util/Tokenservice', () => {
    describe('getToken()', () => {
        test('should return null for a null token', () => {
            expect(Tokenservice.getToken('file_123', null)).resolves.toBeNull();
        });

        test('should return undefined for a undefined token', () => {
            expect(Tokenservice.getToken('file_123')).resolves.toBeUndefined();
        });

        test('should return null for a null token generator', () =>
            expect(Tokenservice.getToken('file_123', nullTokenGenerator)).resolves.toBeNull());

        test('should return undefined for a undefined token generator', () =>
            expect(Tokenservice.getToken('file_123', undefinedTokenGenerator)).resolves.toBeUndefined());

        test('should return proper token with generator function that returns a string token', () =>
            expect(Tokenservice.getToken('file_123', tokenGenerator)).resolves.toBe('token'));

        test('should return proper token with generator function that returns a token map', () =>
            expect(Tokenservice.getToken('file_123', tokenMapGenerator)).resolves.toBe('token'));

        test('should reject when not given a typed id', () =>
            expect(Tokenservice.getToken('123')).rejects.toThrow(/Bad id or auth token/));

        test('should reject when not given proper token function', () =>
            expect(Tokenservice.getToken('file_123', {})).rejects.toThrow(/Bad id or auth token/));

        test('should reject when token generator returns junk', () =>
            expect(Tokenservice.getToken('file_123', junkTokenGenerator)).rejects.toThrow(/Bad id or auth token/));
    });

    describe('getTokens()', () => {
        test('should return null for a null token', () => {
            expect(Tokenservice.getTokens(['file_123', 'folder_123'], null)).resolves.toEqual({
                file_123: null,
                folder_123: null
            });
        });

        test('should return undefined for a undefined token', () => {
            expect(Tokenservice.getTokens(['file_123', 'folder_123'])).resolves.toEqual({
                file_123: undefined,
                folder_123: undefined
            });
        });

        test('should return null for a null token generator', () =>
            expect(Tokenservice.getTokens(['file_123', 'folder_123'], nullTokenGenerator)).resolves.toEqual({
                file_123: null,
                folder_123: null
            }));

        test('should return undefined for a undefined token generator', () =>
            expect(Tokenservice.getTokens(['file_123', 'folder_123'], undefinedTokenGenerator)).resolves.toEqual({
                file_123: undefined,
                folder_123: undefined
            }));

        test('should return null for a null tokens generator', () =>
            expect(Tokenservice.getTokens(['file_123', 'folder_123'], nullTokensGenerator)).resolves.toEqual({
                file_123: null,
                folder_123: null
            }));

        test('should return undefined for a undefined tokens generator', () =>
            expect(Tokenservice.getTokens(['file_123', 'folder_123'], undefinedTokensGenerator)).resolves.toEqual({
                file_123: undefined,
                folder_123: undefined
            }));

        test('should return proper token with generator function that returns a string token', () =>
            expect(Tokenservice.getTokens(['file_123', 'folder_123'], tokenGenerator)).resolves.toEqual({
                file_123: 'token',
                folder_123: 'token'
            }));

        test('should return proper token with generator function that returns a string tokens', () =>
            expect(Tokenservice.getTokens(['file_123', 'folder_123'], tokensGenerator)).resolves.toEqual({
                file_123: 'token1',
                folder_123: 'token2'
            }));

        test('should return proper token with generator function that returns a token map', () =>
            expect(Tokenservice.getTokens(['file_123', 'folder_123'], tokensMapGenerator)).resolves.toEqual({
                file_123: 'token1',
                folder_123: 'token2'
            }));

        test('should reject when not given a typed id', () =>
            expect(Tokenservice.getTokens(['123', 'folder_123'])).rejects.toThrow(/Bad id or auth token/));

        test('should reject when not given proper token function', () =>
            expect(Tokenservice.getTokens(['file_123', 'folder_123'], {})).rejects.toThrow(/Bad id or auth token/));

        test('should reject when token generator returns junk', () =>
            expect(Tokenservice.getTokens(['file_123', 'folder_123'], junkTokenGenerator)).rejects.toThrow(
                /Bad id or auth token/
            ));
    });
});
