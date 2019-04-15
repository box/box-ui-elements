import Versions from '../Versions';
import { PERMISSION_CAN_DELETE, PERMISSION_CAN_UPLOAD } from '../../constants';
import { FILE_VERSIONS_FIELDS_TO_FETCH } from '../../utils/fields';

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
    const { id: fileId } = file;
    const response = {
        entries: [uploadVersion, deleteVersion],
        total_count: 2,
    };

    beforeEach(() => {
        versions = new Versions({});
    });

    describe('getUrl()', () => {
        test('should throw when called without a file id', () => {
            expect(() => {
                versions.getUrl();
            }).toThrow();
        });
        test('should return correct versions base endpoint url', () => {
            expect(versions.getUrl('foo')).toBe('https://api.box.com/2.0/files/foo/versions');
        });
    });

    describe('getVersionUrl()', () => {
        test('should throw when called without a file id and version id', () => {
            expect(() => {
                versions.getVersionUrl();
            }).toThrow();
            expect(() => {
                versions.getVersionUrl('foo');
            }).toThrow();
        });
        test('should return correct version info endpoint url', () => {
            expect(versions.getVersionUrl('foo', '123')).toBe('https://api.box.com/2.0/files/foo/versions/123');
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

    describe('CRUD operations', () => {
        const successCallback = jest.fn();
        const errorCallback = jest.fn();
        const versionId = '123';

        beforeEach(() => {
            versions.checkApiCallValidity = jest.fn(() => true);
            versions.delete = jest.fn();
            versions.get = jest.fn();
            versions.getUrl = jest.fn(() => 'https://www.foo.com/versions');
            versions.offsetGet = jest.fn();
            versions.post = jest.fn();
        });

        describe('promoteVersion()', () => {
            const permissions = {
                [PERMISSION_CAN_UPLOAD]: true,
            };

            test('should check for valid version promote permissions', () => {
                versions.promoteVersion({
                    fileId,
                    versionId,
                    permissions,
                    successCallback,
                    errorCallback,
                });

                expect(versions.checkApiCallValidity).toBeCalledWith(PERMISSION_CAN_UPLOAD, permissions, fileId);
            });

            test('should post a well formed version promote request to the versions endpoint', () => {
                const requestData = {
                    data: {
                        id: versionId,
                        type: 'file_version',
                    },
                };

                versions.promoteVersion({
                    fileId,
                    versionId,
                    permissions,
                    successCallback,
                    errorCallback,
                });

                expect(versions.post).toBeCalledWith({
                    id: fileId,
                    url: versions.getVersionUrl(versionId, 'current'),
                    data: requestData,
                    successCallback,
                    errorCallback,
                });
            });
        });

        describe('deleteVersion()', () => {
            const permissions = {
                [PERMISSION_CAN_DELETE]: true,
            };

            test('should check for valid version delete permissions', () => {
                versions.deleteVersion({
                    fileId,
                    versionId,
                    permissions,
                    successCallback,
                    errorCallback,
                });

                expect(versions.checkApiCallValidity).toBeCalledWith(PERMISSION_CAN_DELETE, permissions, fileId);
            });

            test('should delete a version from the versions endpoint', () => {
                versions.deleteVersion({
                    fileId,
                    versionId,
                    permissions,
                    successCallback,
                    errorCallback,
                });

                expect(versions.delete).toBeCalledWith({
                    id: fileId,
                    url: versions.getVersionUrl(fileId, versionId),
                    successCallback,
                    errorCallback,
                });
            });
        });

        describe('getVersions()', () => {
            test('should return a list of versions from the versions endpoint', () => {
                versions.getVersions(fileId, successCallback, errorCallback);

                expect(versions.offsetGet).toBeCalledWith(
                    fileId,
                    successCallback,
                    errorCallback,
                    0,
                    1000,
                    FILE_VERSIONS_FIELDS_TO_FETCH,
                    true,
                );
            });
        });
    });
});
