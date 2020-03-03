import Tokenservice from '../TokenService';

const readWriteTokenGenerator = () => Promise.resolve({ read: 'read_token', write: 'write_token' });
const readTokenGenerator = () => Promise.resolve({ read: 'read_token' });
const writeTokenGenerator = () => Promise.resolve({ write: 'write_token' });
const tokenGenerator = () => Promise.resolve('token');
const junkTokenGenerator = () => Promise.resolve(123);
const nullTokenGenerator = () => Promise.resolve(null);
const undefinedTokenGenerator = () => Promise.resolve();

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
            expect(Tokenservice.getToken('file_123', readWriteTokenGenerator)).resolves.toEqual({
                read: 'read_token',
                write: 'write_token',
            }));

        test('should reject when not given a typed id', () =>
            expect(Tokenservice.getToken('123')).rejects.toThrow(/Bad id or auth token/));

        test('should reject when not given proper token function', () =>
            expect(Tokenservice.getToken('file_123', {})).rejects.toThrow(/Bad id or auth token/));

        test('should reject when token generator returns junk', () =>
            expect(Tokenservice.getToken('file_123', junkTokenGenerator)).rejects.toThrow(/Bad id or auth token/));
    });

    describe('getWriteToken()', () => {
        test('should return null for a null token', () => {
            expect(Tokenservice.getWriteToken('file_123', null)).resolves.toBeNull();
        });

        test('should return undefined for a undefined token', () => {
            expect(Tokenservice.getWriteToken('file_123')).resolves.toBeUndefined();
        });

        test('should return a string token', () => {
            expect(Tokenservice.getWriteToken('file_123', 'string_token')).resolves.toBe('string_token');
        });

        test('should return null for a null token generator', () =>
            expect(Tokenservice.getWriteToken('file_123', nullTokenGenerator)).resolves.toBeNull());

        test('should return undefined for a undefined token generator', () =>
            expect(Tokenservice.getWriteToken('file_123', undefinedTokenGenerator)).resolves.toBeUndefined());

        test('should return proper token with generator function that returns a string token', () =>
            expect(Tokenservice.getWriteToken('file_123', tokenGenerator)).resolves.toBe('token'));

        test('should return read token with generator function that returns a token map without write token', () =>
            expect(Tokenservice.getWriteToken('file_123', readTokenGenerator)).resolves.toBe('read_token'));

        test('should return write token with generator function that returns a token map', () =>
            expect(Tokenservice.getWriteToken('file_123', writeTokenGenerator)).resolves.toBe('write_token'));

        test('should return write token with generator function that returns a both read and write tokens', () =>
            expect(Tokenservice.getWriteToken('file_123', readWriteTokenGenerator)).resolves.toBe('write_token'));

        test('should reject when not given a typed id', () =>
            expect(Tokenservice.getWriteToken('123')).rejects.toThrow(/Bad id or auth token/));

        test('should reject when not given proper token function', () =>
            expect(Tokenservice.getWriteToken('file_123', {})).rejects.toThrow(/Bad id or auth token/));

        test('should reject when token generator returns junk', () =>
            expect(Tokenservice.getWriteToken('file_123', junkTokenGenerator)).rejects.toThrow(/Bad id or auth token/));
    });

    describe('getReadToken()', () => {
        test('should return null for a null token', () => {
            expect(Tokenservice.getReadToken('file_123', null)).resolves.toBeNull();
        });

        test('should return undefined for a undefined token', () => {
            expect(Tokenservice.getReadToken('file_123')).resolves.toBeUndefined();
        });

        test('should return null for a null token generator', () =>
            expect(Tokenservice.getReadToken('file_123', nullTokenGenerator)).resolves.toBeNull());

        test('should return a string token', () => {
            expect(Tokenservice.getReadToken('file_123', 'string_token')).resolves.toBe('string_token');
        });

        test('should return undefined for a undefined token generator', () =>
            expect(Tokenservice.getReadToken('file_123', undefinedTokenGenerator)).resolves.toBeUndefined());

        test('should return proper token with generator function that returns a string token', () =>
            expect(Tokenservice.getReadToken('file_123', tokenGenerator)).resolves.toBe('token'));

        test('should return read token with generator function that returns a token map without write token', () =>
            expect(Tokenservice.getReadToken('file_123', readTokenGenerator)).resolves.toBe('read_token'));

        test('should return undefined with generator function that returns a token map without read token', () =>
            expect(Tokenservice.getReadToken('file_123', writeTokenGenerator)).resolves.toBeUndefined());

        test('should return read token with generator function that returns a both read and write tokens', () =>
            expect(Tokenservice.getReadToken('file_123', readWriteTokenGenerator)).resolves.toBe('read_token'));

        test('should reject when not given a typed id', () =>
            expect(Tokenservice.getReadToken('123')).rejects.toThrow(/Bad id or auth token/));

        test('should reject when not given proper token function', () =>
            expect(Tokenservice.getReadToken('file_123', {})).rejects.toThrow(/Bad id or auth token/));

        test('should reject when token generator returns junk', () =>
            expect(Tokenservice.getReadToken('file_123', junkTokenGenerator)).rejects.toThrow(/Bad id or auth token/));
    });

    describe('getReadTokens()', () => {
        test('should call Tokenservice.getReadToken', () => {
            const origGetReadToken = Tokenservice.getReadToken;
            Tokenservice.getReadToken = jest.fn();
            return Tokenservice.getReadTokens('file_123', readTokenGenerator).then(() => {
                expect(Tokenservice.getReadToken).toHaveBeenCalledWith('file_123', readTokenGenerator);
                Tokenservice.getReadToken = origGetReadToken;
            });
        });
        test('should return a token map', () => {
            expect(Tokenservice.getReadTokens(['file_123', 'file_456'], readTokenGenerator)).resolves.toEqual({
                file_123: 'read_token',
                file_456: 'read_token',
            });
        });
    });

    describe('cacheTokens()', () => {
        test('should call the token generator function', async () => {
            const generator = jest.fn();
            await Tokenservice.cacheTokens(['file_123', 'folder_123'], generator);
            expect(generator).toHaveBeenCalledWith(['file_123', 'folder_123']);
        });

        test('should reject when not given a typed id', () =>
            expect(Tokenservice.cacheTokens(['123', 'folder_123'])).rejects.toThrow(/Bad id or auth token/));

        test('should reject when not given proper token function', () =>
            expect(Tokenservice.cacheTokens(['file_123', 'folder_123'], {})).rejects.toThrow(/Bad id or auth token/));
    });
});
