import * as React from 'react';
import { shallow } from 'enzyme/build';
import openUrlInsideIframe from '../../../../utils/iframe';
import VersionsSidebar from '../VersionsSidebarContainer';
import { FILE_VERSION_FIELDS_TO_FETCH } from '../../../../utils/fields';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    withRouter: Component => Component,
}));

jest.mock('../../../common/api-context', () => ({
    withAPIContext: Component => Component,
}));

jest.mock('../../../../utils/iframe', () => ({
    __esModule: true,
    default: jest.fn(),
}));

const versions = [{ id: '123', name: 'Version 1' }, { id: '456', name: 'Version 2' }, { id: '789', name: 'Version 3' }];

describe('elements/content-sidebar/versions/VersionsSidebarContainer', () => {
    const defaultId = '12345';
    const fileAPI = {
        getDownloadUrl: jest.fn(),
        getFile: jest.fn(),
    };
    const versionsAPI = {
        addCurrentVersion: jest.fn(),
        addPermissions: jest.fn(),
        deleteVersion: jest.fn(),
        getVersions: jest.fn(),
        getCurrentVersion: jest.fn(),
        promoteVersion: jest.fn(),
        restoreVersion: jest.fn(),
        sortVersions: jest.fn(),
    };
    const api = {
        getFileAPI: () => fileAPI,
        getVersionsAPI: () => versionsAPI,
    };
    const getWrapper = ({ fileId = defaultId, ...rest } = {}) =>
        shallow(<VersionsSidebar api={api} fileId={fileId} {...rest} />);

    describe('componentDidMount', () => {
        test('should fetch file info', () => {
            const wrapper = getWrapper();

            expect(wrapper.state('versions')).toHaveLength(0);
            expect(fileAPI.getFile).toHaveBeenCalled();
        });
    });

    describe('componentDidUpdate', () => {
        test('should verify the selected version id exists when it changes', () => {
            const onVersionChange = jest.fn();
            const wrapper = getWrapper({ onVersionChange });
            const instance = wrapper.instance();
            const version = { id: '12345' };
            const currentVersion = { id: '54321' };

            instance.verifyVersion = jest.fn();

            wrapper.setState({
                versions: [currentVersion, version],
            });
            wrapper.setProps({ versionId: '12345' });

            expect(instance.verifyVersion).toHaveBeenCalled();
        });
    });

    describe('componentWillUnmount', () => {
        test('should forward verison id reset to the parent component', () => {
            const onVersionChange = jest.fn();
            const wrapper = getWrapper({ onVersionChange });

            wrapper.unmount();

            expect(onVersionChange).toBeCalledWith(null);
        });
    });

    describe('handleActionDelete', () => {
        test('should set state and call api endpoint helpers', () => {
            const wrapper = getWrapper({ versionId: '123' });
            const instance = wrapper.instance();
            const versionId = '456';

            instance.deleteVersion = jest.fn().mockResolvedValueOnce();
            instance.fetchData = jest.fn().mockResolvedValueOnce();
            instance.updateVersion = jest.fn();

            instance.handleActionDelete(versionId);

            expect(wrapper.state('isLoading')).toBe(true);
            expect(instance.deleteVersion).toHaveBeenCalledWith(versionId);
        });
    });

    describe('handleActionDownload', () => {
        test('should call api endpoint helpers', async () => {
            const downloadUrl = 'https://box.com/url';
            const wrapper = getWrapper({ versionId: '123' });
            const instance = wrapper.instance();
            const versionId = '456';

            instance.fetchDownloadUrl = jest.fn().mockResolvedValueOnce(downloadUrl);

            await instance.handleActionDownload(versionId);

            expect(instance.fetchDownloadUrl).toHaveBeenCalledWith(versionId);
            expect(openUrlInsideIframe).toHaveBeenCalledWith(downloadUrl);
        });
    });

    describe('handleActionPromote', () => {
        test('should set state and call api endpoint helpers', () => {
            const wrapper = getWrapper({ versionId: '123' });
            const instance = wrapper.instance();
            const versionId = '456';

            instance.promoteVersion = jest.fn().mockResolvedValueOnce();
            instance.fetchData = jest.fn().mockResolvedValueOnce();
            instance.updateVersion = jest.fn();

            instance.handleActionPromote(versionId);

            expect(wrapper.state('isLoading')).toBe(true);
            expect(instance.promoteVersion).toHaveBeenCalledWith(versionId);
        });
    });

    describe('handleActionRestore', () => {
        test('should set state and call api endpoint helpers', () => {
            const wrapper = getWrapper({ versionId: '123' });
            const instance = wrapper.instance();
            const versionId = '456';

            instance.restoreVersion = jest.fn().mockResolvedValueOnce();
            instance.fetchData = jest.fn().mockResolvedValueOnce();

            instance.handleActionRestore(versionId);

            expect(wrapper.state('isLoading')).toBe(true);
            expect(instance.restoreVersion).toHaveBeenCalledWith(versionId);
        });
    });

    describe('handleFetchError', () => {
        test('should set state to default values with error message', () => {
            const wrapper = getWrapper();
            const message = 'This is an error!';

            wrapper.instance().handleFetchError({ message });

            expect(wrapper.state()).toEqual({
                error: message,
                isLoading: false,
                versionCount: 0,
                versionLimit: Infinity,
                versions: [],
            });
        });
    });

    describe('handleFetchSuccess', () => {
        let file;
        let version;
        let currentVersion;
        let versionsWithCurrent;

        beforeEach(() => {
            file = { id: '12345', permissions: {}, version_limit: 10 };
            version = { id: '123', permissions: {} };
            currentVersion = { entries: [{ id: '321', permissions: {} }], total_count: 1 };
            versionsWithCurrent = { entries: [version, ...currentVersion.entries], total_count: 2 };

            versionsAPI.addPermissions.mockReturnValueOnce(versionsWithCurrent);
            versionsAPI.sortVersions.mockReturnValueOnce(versionsWithCurrent);
        });

        test('should set state with the updated versions', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();

            instance.verifyVersion = jest.fn();
            instance.handleFetchSuccess([file, versionsWithCurrent]);

            expect(instance.verifyVersion).toBeCalled();
            expect(versionsAPI.addPermissions).toBeCalledWith(versionsWithCurrent, file);
            expect(versionsAPI.sortVersions).toBeCalledWith(versionsWithCurrent);
            expect(wrapper.state()).toMatchObject({
                error: undefined,
                isLoading: false,
                versionCount: 2,
                versionLimit: 10,
            });
            expect(wrapper.state('versions')).toBe(versionsWithCurrent.entries);
        });
    });

    describe('fetchData', () => {
        test('should call getFile and getVersions', () => {
            const wrapper = getWrapper();
            const dataPromise = wrapper.instance().fetchData();

            expect(dataPromise).toBeInstanceOf(Promise);
            expect(fileAPI.getFile).toBeCalled();
            expect(versionsAPI.getVersions).toBeCalled();
        });
    });

    describe('fetchDownloadUrl', () => {
        test('should call getDownloadUrl', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();
            const versionId = '456';
            const version = { id: versionId };

            instance.findVersion = jest.fn().mockReturnValueOnce(version);

            const urlPromise = instance.fetchDownloadUrl(versionId);

            expect(urlPromise).toBeInstanceOf(Promise);
            expect(fileAPI.getDownloadUrl).toBeCalledWith(
                defaultId,
                version,
                expect.any(Function),
                expect.any(Function),
            );
        });
    });

    describe('fetchFile', () => {
        test('should call getFile', () => {
            const wrapper = getWrapper();
            const filePromise = wrapper.instance().fetchFile();

            expect(filePromise).toBeInstanceOf(Promise);
            expect(fileAPI.getFile).toBeCalledWith(defaultId, expect.any(Function), expect.any(Function), {
                fields: FILE_VERSION_FIELDS_TO_FETCH,
                forceFetch: true,
            });
        });
    });

    describe('fetchVersions', () => {
        test('should call getVersions', () => {
            const wrapper = getWrapper();
            const versionsPromise = wrapper.instance().fetchVersions();

            expect(versionsPromise).toBeInstanceOf(Promise);
            expect(versionsAPI.getVersions).toBeCalledWith(defaultId, expect.any(Function), expect.any(Function));
        });
    });

    describe('fetchVersionCurrent', () => {
        const fileVersionId = '1234';
        test('should get the current version and add it to the versions response', () => {
            const file = {
                id: defaultId,
                file_version: {
                    id: fileVersionId,
                },
            };

            versionsAPI.getCurrentVersion.mockResolvedValueOnce();

            const wrapper = getWrapper();
            const currentVersionsPromise = wrapper.instance().fetchVersionCurrent([file, versions]);

            expect(currentVersionsPromise).toBeInstanceOf(Promise);
            expect(versionsAPI.getCurrentVersion).toBeCalledWith(
                defaultId,
                fileVersionId,
                expect.any(Function),
                expect.any(Function),
            );
        });
    });

    describe('deleteVersion', () => {
        test('should call deleteVersion', () => {
            const wrapper = getWrapper();
            const permissions = { can_delete: true };
            const instance = wrapper.instance();

            instance.findVersion = jest.fn(() => ({ id: '123', permissions }));

            expect(instance.deleteVersion('123')).toBeInstanceOf(Promise);
            expect(versionsAPI.deleteVersion).toBeCalledWith({
                fileId: defaultId,
                permissions,
                errorCallback: expect.any(Function),
                successCallback: expect.any(Function),
                versionId: '123',
            });
        });
    });

    describe('findVersion', () => {
        test('should return the version stored in state if available', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();

            wrapper.setState({ versions });

            expect(instance.findVersion('456')).toEqual(versions[1]);
            expect(instance.findVersion('abc')).toEqual(undefined);
        });
    });

    describe('promoteVersion', () => {
        test('should call promoteVersion', () => {
            const wrapper = getWrapper();
            const permissions = { can_upload: true };
            const instance = wrapper.instance();

            instance.findVersion = jest.fn(() => ({ id: '123', permissions }));

            expect(instance.promoteVersion('123')).toBeInstanceOf(Promise);
            expect(versionsAPI.promoteVersion).toBeCalledWith({
                fileId: defaultId,
                permissions,
                errorCallback: expect.any(Function),
                successCallback: expect.any(Function),
                versionId: '123',
            });
        });
    });

    describe('restoreVersion', () => {
        test('should call restoreVersion', () => {
            const wrapper = getWrapper();
            const permissions = { can_upload: true };
            const instance = wrapper.instance();

            instance.findVersion = jest.fn(() => ({ id: '123', permissions }));

            expect(instance.restoreVersion('123')).toBeInstanceOf(Promise);
            expect(versionsAPI.restoreVersion).toBeCalledWith({
                fileId: defaultId,
                permissions,
                errorCallback: expect.any(Function),
                successCallback: expect.any(Function),
                versionId: '123',
            });
        });
    });

    describe('verifyVersion', () => {
        const onVersionChange = jest.fn();

        test('should emit an onVersionChange event if the passed version is available', () => {
            const wrapper = getWrapper({ onVersionChange, versionId: '456' });

            wrapper.setState({ versions });
            wrapper.instance().verifyVersion();

            expect(onVersionChange).toHaveBeenCalledWith(versions[1], {
                currentVersionId: versions[0].id,
                updateVersionToCurrent: wrapper.instance().updateVersionToCurrent,
            });
        });

        test('should reset the selected version if the passed version is not available', () => {
            const wrapper = getWrapper({ onVersionChange, versionId: '99999' });
            const instance = wrapper.instance();

            instance.updateVersionToCurrent = jest.fn();

            wrapper.setState({ versions });
            instance.verifyVersion();

            expect(onVersionChange).not.toHaveBeenCalled();
            expect(instance.updateVersionToCurrent).toHaveBeenCalled();
        });
    });

    describe('render', () => {
        test('should match its snapshot', () => {
            const wrapper = getWrapper({ parentName: 'activity' });
            expect(wrapper).toMatchSnapshot();
        });
    });
});
