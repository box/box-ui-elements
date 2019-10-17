import VersionsSidebarAPI from '../VersionsSidebarAPI';
import { FILE_VERSION_FIELDS_TO_FETCH } from '../../../../utils/fields';

describe('VersionsSidebarAPI', () => {
    const defaultFileId = '123';
    const defaultVersionId = '4567';
    const fileAPI = {
        getDownloadUrl: jest.fn(),
        getFile: jest.fn(),
    };
    const versionsAPI = {
        addCurrentVersion: jest.fn(),
        addPermissions: jest.fn(),
        deleteVersion: jest.fn(),
        getVersions: jest.fn(),
        getVersion: jest.fn(),
        promoteVersion: jest.fn(),
        restoreVersion: jest.fn(),
        sortVersions: jest.fn(),
    };
    const mockAPI = {
        getFileAPI: () => fileAPI,
        getVersionsAPI: () => versionsAPI,
    };
    const mockPermissons = { can_delete: true, can_download: true, can_upload: true };
    const mockVersion = { id: defaultVersionId, permissions: mockPermissons };
    const getInstance = (options = {}) => new VersionsSidebarAPI({ api: mockAPI, fileId: defaultFileId, ...options });

    describe('deleteVersion', () => {
        test('should call deleteVersion', () => {
            const instance = getInstance();

            expect(instance.deleteVersion(mockVersion)).toBeInstanceOf(Promise);
            expect(versionsAPI.deleteVersion).toBeCalledWith({
                fileId: defaultFileId,
                permissions: mockVersion.permissions,
                errorCallback: expect.any(Function),
                successCallback: expect.any(Function),
                versionId: defaultVersionId,
            });
        });
    });

    describe('fetchData', () => {
        test('should call getFile and getVersions', () => {
            const instance = getInstance();

            instance.fetchData().then(() => {
                expect(fileAPI.getFile).toBeCalled();
                expect(versionsAPI.getVersions).toBeCalled();
            });
        });
    });

    describe('fetchDownloadUrl', () => {
        test('should call getDownloadUrl', () => {
            const instance = getInstance();
            const urlPromise = instance.fetchDownloadUrl(mockVersion);

            expect(urlPromise).toBeInstanceOf(Promise);
            expect(fileAPI.getDownloadUrl).toBeCalledWith(
                defaultFileId,
                mockVersion,
                expect.any(Function),
                expect.any(Function),
            );
        });
    });

    describe('fetchFile', () => {
        test('should call getFile', () => {
            const instance = getInstance();

            expect(instance.fetchFile()).toBeInstanceOf(Promise);
            expect(fileAPI.getFile).toBeCalledWith(defaultFileId, expect.any(Function), expect.any(Function), {
                fields: FILE_VERSION_FIELDS_TO_FETCH,
                forceFetch: true,
            });
        });
    });

    describe('fetchVersions', () => {
        test('should call getVersions', () => {
            const instance = getInstance();

            expect(instance.fetchVersions()).toBeInstanceOf(Promise);
            expect(versionsAPI.getVersions).toBeCalledWith(defaultFileId, expect.any(Function), expect.any(Function));
        });
    });

    describe('fetchVersionCurrent', () => {
        test('should get the current version and add it to the versions response', () => {
            const file = {
                id: defaultFileId,
                file_version: {
                    id: defaultVersionId,
                },
            };
            const instance = getInstance();
            const versions = { entries: [mockVersion], total_count: 1 };

            expect(instance.fetchVersionCurrent([file, versions])).toBeInstanceOf(Promise);
            expect(versionsAPI.getVersion).toBeCalledWith(
                defaultFileId,
                defaultVersionId,
                expect.any(Function),
                expect.any(Function),
            );
        });
    });

    describe('fetchVersion', () => {
        test('should call getVersion', () => {
            const instance = getInstance();

            expect(instance.fetchVersion(defaultVersionId)).toBeInstanceOf(Promise);
            expect(versionsAPI.getVersion).toBeCalledWith(
                defaultFileId,
                defaultVersionId,
                expect.any(Function),
                expect.any(Function),
            );
        });
    });

    describe('promoteVersion', () => {
        test('should call promoteVersion', () => {
            const instance = getInstance();

            expect(instance.promoteVersion(mockVersion)).toBeInstanceOf(Promise);
            expect(versionsAPI.promoteVersion).toBeCalledWith({
                fileId: defaultFileId,
                permissions: mockVersion.permissions,
                errorCallback: expect.any(Function),
                successCallback: expect.any(Function),
                versionId: defaultVersionId,
            });
        });
    });

    describe('restoreVersion', () => {
        test('should call restoreVersion', () => {
            const instance = getInstance();

            expect(instance.restoreVersion(mockVersion)).toBeInstanceOf(Promise);
            expect(versionsAPI.restoreVersion).toBeCalledWith({
                fileId: defaultFileId,
                permissions: mockVersion.permissions,
                errorCallback: expect.any(Function),
                successCallback: expect.any(Function),
                versionId: defaultVersionId,
            });
        });
    });
});
