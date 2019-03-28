import Versions from '../Versions';

let versions;

describe('api/Versions', () => {
    const uploadVersion = {
        id: 123,
        modified_at: 1234567892,
        modified_by: { name: 'Jay-Z', id: 10 },
        trashed_at: null,
        version_number: '1',
    };
    const deleteVersion = {
        id: 456,
        modified_at: 1234567891,
        modified_by: { name: 'Akon', id: 11 },
        trashed_at: 1234567891,
        version_number: '2',
    };
    const file = {
        id: '12345',
        modified_at: 1234567891,
        file_version: {
            id: 987,
        },
        permissions: {
            can_comment: true,
        },
        restored_from: {
            id: uploadVersion.id,
            type: uploadVersion.type,
        },
    };
    const response = {
        entries: [uploadVersion, deleteVersion],
        total_count: 2,
    };

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
            versions.successCallback = jest.fn();

            const formattedResponse = {
                total_count: 2,
                entries: [
                    {
                        ...uploadVersion,
                        action: 'upload',
                    },
                    {
                        ...deleteVersion,
                        action: 'delete',
                    },
                ],
            };

            versions.successHandler(response);
            expect(versions.successCallback).toBeCalledWith(formattedResponse);
        });
    });

    describe('addCurrentVersion()', () => {
        test('should append the current version', () => {
            const fileWithoutRestoredVersion = {
                ...file,
                restored_from: null,
            };
            const versionsWithCurrent = versions.addCurrentVersion(response, fileWithoutRestoredVersion);

            expect(versionsWithCurrent.entries.length).toBe(response.entries.length + 1);
            expect(versionsWithCurrent.entries.pop().id).toBe(file.file_version.id);
        });

        test('should append the current version as restored type', () => {
            const versionsWithRestore = versions.addCurrentVersion(response, file);
            expect(versionsWithRestore.entries.length).toBe(response.entries.length + 1);

            const restoredVersion = versionsWithRestore.entries.pop();
            expect(restoredVersion.action).toBe('restore');
            expect(restoredVersion.created_at).toBe(file.modified_at);
        });
    });
});
