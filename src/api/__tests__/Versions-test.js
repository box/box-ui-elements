import Versions from '../Versions';
import { PERMISSION_CAN_DELETE, PERMISSION_CAN_UPLOAD } from '../../constants';
import { FILE_VERSIONS_FIELDS_TO_FETCH } from '../../utils/fields';

let versions;

describe('api/Versions', () => {
    const currentVersion = {
        id: 123,
        created_at: '2018-10-02T13:00:24-07:00',
        modified_at: '2018-10-02T13:00:24-07:00',
        modified_by: { name: 'FooBar', id: 11 },
        version_number: '4',
    };

    const firstVersion = {
        id: 123,
        created_at: '2018-10-02T13:01:24-07:00',
        modified_at: '2018-10-02T13:01:24-07:00',
        modified_by: { name: 'Foo', id: 10 },
        version_number: '2',
    };
    const deleteVersion = {
        id: 456,
        created_at: '2018-10-02T13:01:41-07:00',
        modified_at: '2018-10-02T13:01:41-07:00',
        modified_by: { name: 'Bar', id: 11 },
        permissions: { can_delete: true },
        trashed_at: '2018-10-02T13:01:41-07:00',
        version_number: '2',
    };
    const restoreVersion = {
        id: 789,
        created_at: '2018-11-29T17:47:57-08:00',
        modified_at: '2018-11-29T17:47:57-08:00',
        modified_by: { name: 'Baz', id: 12 },
        permissions: { can_delete: true },
        restored_at: '2018-11-30T17:47:57-08:00',
        trashed_at: null,
        version_number: '3',
    };

    const nonCurrentVersions = { entries: [firstVersion, deleteVersion, restoreVersion], total_count: 3 };

    const file = {
        id: '12345',
        modified_at: 1111111111,
        file_version: {
            id: 987,
        },
        permissions: {
            can_comment: true,
        },
        restored_from: {
            id: firstVersion.id,
            type: firstVersion.type,
        },
    };
    const { id: fileId } = file;
    const response = {
        entries: [firstVersion, deleteVersion, restoreVersion],
        total_count: 3,
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
        test('should return API response data', () => {
            versions.successCallback = jest.fn();

            versions.successHandler(response);
            expect(versions.successCallback).toBeCalledWith(response);
        });
    });

    describe('addPermissions()', () => {
        test.each([true, false])('should decorate versions with can_upload permission from parent file', canUpload => {
            const fileWithPermissions = {
                ...file,
                permissions: {
                    can_upload: canUpload,
                },
            };
            const { entries, total_count } = versions.addPermissions(response, fileWithPermissions);
            const versionDeleteMatcher = version => version.permissions.can_delete === true;
            const versionUploadMatcher = version => version.permissions.can_upload === canUpload;

            expect(entries.find(versionDeleteMatcher)).toMatchObject(deleteVersion);
            expect(entries.every(versionUploadMatcher)).toBe(true);
            expect(total_count).toEqual(response.total_count);
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
            versions.offsetGet = jest.fn();
            versions.post = jest.fn();
            versions.put = jest.fn();
        });

        describe('deleteVersion()', () => {
            const permissions = {
                [PERMISSION_CAN_DELETE]: true,
            };

            test('should delete a version from the versions endpoint', () => {
                versions.deleteVersion({
                    fileId,
                    versionId,
                    permissions,
                    successCallback,
                    errorCallback,
                });

                expect(versions.checkApiCallValidity).toBeCalledWith(PERMISSION_CAN_DELETE, permissions, fileId);
                expect(versions.delete).toBeCalledWith({
                    id: fileId,
                    url: `https://api.box.com/2.0/files/${fileId}/versions/${versionId}`,
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

        describe('getVersion()', () => {
            test('should return the version information', () => {
                const url = 'https://box.com/api/file/fileID/versions';
                versions.getVersionUrl = jest.fn().mockReturnValue(url);

                versions.getVersion(fileId, file.file_version.id, successCallback, errorCallback);

                expect(versions.get).toBeCalledWith({
                    id: fileId,
                    successCallback,
                    errorCallback,
                    url,
                    requestData: {
                        params: {
                            fields: FILE_VERSIONS_FIELDS_TO_FETCH.toString(),
                        },
                    },
                });
            });
        });

        describe('addCurrentVersion()', () => {
            test('should return the other versions if no current version is provided', () => {
                const result = versions.addCurrentVersion(null, nonCurrentVersions, file);
                expect(result).toEqual(nonCurrentVersions);
            });
            test('should return the current version if no other versions are provided', () => {
                const result = versions.addCurrentVersion(currentVersion, null, file);
                expect(result).toEqual({ entries: [currentVersion], total_count: 1 });
            });
            test('should return all versions with restored info added to the current version', () => {
                const result = versions.addCurrentVersion(currentVersion, nonCurrentVersions, file);
                expect(result.total_count).toEqual(nonCurrentVersions.entries.length + 1);

                const resultCurrentVersion = result.entries.pop();
                expect(resultCurrentVersion.version_promoted).toEqual(firstVersion.version_number);
            });
        });

        describe('promoteVersion()', () => {
            const permissions = {
                [PERMISSION_CAN_UPLOAD]: true,
            };

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

                expect(versions.checkApiCallValidity).toBeCalledWith(PERMISSION_CAN_UPLOAD, permissions, fileId);
                expect(versions.post).toBeCalledWith({
                    id: fileId,
                    url: `https://api.box.com/2.0/files/${fileId}/versions/current`,
                    data: requestData,
                    successCallback,
                    errorCallback,
                });
            });
        });

        describe('restoreVersion()', () => {
            const permissions = {
                [PERMISSION_CAN_DELETE]: true,
            };

            test('should post a well formed version restore request to the versions endpoint', () => {
                const requestData = {
                    data: {
                        trashed_at: null,
                    },
                };

                versions.restoreVersion({
                    fileId,
                    versionId,
                    permissions,
                    successCallback,
                    errorCallback,
                });

                expect(versions.checkApiCallValidity).toBeCalledWith(PERMISSION_CAN_DELETE, permissions, fileId);
                expect(versions.put).toBeCalledWith({
                    id: fileId,
                    url: `https://api.box.com/2.0/files/${fileId}/versions/${versionId}`,
                    data: requestData,
                    successCallback,
                    errorCallback,
                });
            });
        });
    });
});
