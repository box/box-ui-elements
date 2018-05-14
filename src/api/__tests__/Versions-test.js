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
                modified_at: 1234567891,
                modified_by: { name: 'Jay-Z', id: 10 }
            };
            const deleteVersion = {
                id: 123,
                trashed_at: 1234567891,
                modified_at: 1234567891,
                modified_by: { name: 'Akon', id: 11 }
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
                        id: 123,
                        action: 'delete',
                        versionNumber: 1,
                        modifiedAt: 1234567891,
                        modifiedBy: { name: 'Akon', id: 11 },
                        trashedAt: 1234567891
                    },
                    {
                        id: 123,
                        action: 'upload',
                        versionNumber: 2,
                        modifiedAt: 1234567891,
                        modifiedBy: { name: 'Jay-Z', id: 10 },
                        trashedAt: null
                    }
                ]
            };

            versions.successHandler(response);
            expect(versions.successCallback).toBeCalledWith(formattedResponse);
        });
    });
});
