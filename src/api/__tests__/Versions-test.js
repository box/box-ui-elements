import Versions from '../Versions';

let versions;

describe('api/Versions', () => {
    beforeEach(() => {
        versions = new Versions({});
    });

    describe('getUrl()', () => {
        test('should throw when version api url without id', () => {
            expect(() => {
                versions.getUrl();
            }).toThrow();
        });
        test('should return correct version api url with id', () => {
            expect(versions.getUrl('foo')).toBe('https://api.box.com/2.0/files/foo/versions');
        });
    });

    describe('formatResponse()', () => {
        test('should return API response with properly formatted data', () => {
            const uploadVersion = {
                id: 123,
                trashed_at: false,
                modified_at: 1234567891,
                modified_by: { name: 'JayZ', id: 10 }
            };
            const deleteVersion = {
                id: 123,
                trashed_at: true,
                modified_at: 1234567891,
                modified_by: { name: 'Akon', id: 11 }
            };
            const response = {
                total_count: 2,
                entries: [uploadVersion, deleteVersion]
            };

            expect(versions.formatResponse(response)).toEqual({
                ...response,
                entries: [
                    {
                        ...deleteVersion,
                        action: 'delete',
                        versionNumber: 1,
                        modifiedAt: 1234567891,
                        modifiedBy: { name: 'Akon', id: 11 }
                    },
                    {
                        ...uploadVersion,
                        action: 'upload',
                        versionNumber: 2,
                        modifiedAt: 1234567891,
                        modifiedBy: { name: 'JayZ', id: 10 }
                    }
                ]
            });
        });
    });
});
