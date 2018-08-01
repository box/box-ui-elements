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

    describe('successHandler()', () => {
        test('should return API response with properly formatted data', () => {
            const uploadVersion = {
                id: 123,
                trashed_at: null,
                modified_at: 1234567892,
                modified_by: { name: 'Jay-Z', id: 10 },
                version_number: '1'
            };
            const deleteVersion = {
                id: 456,
                trashed_at: 1234567891,
                modified_at: 1234567891,
                modified_by: { name: 'Akon', id: 11 },
                version_number: '2'
            };
            const response = {
                total_count: 2,
                entries: [uploadVersion, deleteVersion]
            };

            versions.successCallback = jest.fn();

            const formattedResponse = {
                total_count: 2,
                entries: [
                    {
                        ...uploadVersion,
                        action: 'upload'
                    },
                    {
                        ...deleteVersion,
                        action: 'delete'
                    }
                ]
            };

            versions.successHandler(response);
            expect(versions.successCallback).toBeCalledWith(formattedResponse);
        });
    });
});
