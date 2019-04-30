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

describe('elements/content-sidebar/versions/VersionsSidebarContainer', () => {
    const defaultId = '12345';
    const fileAPI = {
        getDownloadUrl: jest.fn(),
        getFile: jest.fn(),
    };
    const versionsAPI = {
        addCurrentVersion: jest.fn(),
        deleteVersion: jest.fn(),
        getVersions: jest.fn(),
        promoteVersion: jest.fn(),
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
        test('should forward version changes to the parent component', () => {
            const onVersionChange = jest.fn();
            const wrapper = getWrapper({ onVersionChange });
            const version = { id: '12345' };

            wrapper.setState({
                versions: [{ id: '54321' }, version],
            });

            wrapper.setProps({ versionId: '12345' });

            expect(onVersionChange).toHaveBeenCalledWith(version, {
                updateVersionToCurrent: expect.any(Function),
            });
        });
    });

    describe('componentWillUnmount', () => {
        test('should forward verison id reset to the parent component', () => {
            const onVersionChange = jest.fn();
            const wrapper = getWrapper({ onVersionChange });

            wrapper.unmount();

            expect(onVersionChange).toBeCalledWith();
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

    describe('handleActionPRomote', () => {
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

    describe('handleFetchError', () => {
        test('should set state to default values with error message', () => {
            const wrapper = getWrapper();
            const message = 'This is an error!';

            wrapper.instance().handleFetchError({ message });

            expect(wrapper.state()).toEqual({
                error: message,
                isLoading: false,
                permissions: {},
                versions: [],
            });
        });
    });

    describe('handleFetchSuccess', () => {
        test('should set state with the updated versions', () => {
            const wrapper = getWrapper();
            const file = { id: '12345', permissions: {} };
            const versions = { entries: [], total_count: 0 };

            versionsAPI.addCurrentVersion.mockReturnValueOnce({ entries: [file], total_count: 1 });

            wrapper.instance().handleFetchSuccess([file, versions]);

            expect(versionsAPI.addCurrentVersion).toBeCalledWith(versions, file);
            expect(wrapper.state('error')).toBeUndefined();
            expect(wrapper.state('isLoading')).toBe(false);
            expect(wrapper.state('permissions')).toBe(file.permissions);
            expect(wrapper.state('versions')).toBeInstanceOf(Array);
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

    describe('fetchVersion', () => {
        test('should call getVersions', () => {
            const wrapper = getWrapper();
            const versionsPromise = wrapper.instance().fetchVersions();

            expect(versionsPromise).toBeInstanceOf(Promise);
            expect(versionsAPI.getVersions).toBeCalledWith(defaultId, expect.any(Function), expect.any(Function));
        });
    });

    describe('deleteVersion', () => {
        test('should call deleteVersion', () => {
            const wrapper = getWrapper();
            const permissions = { can_delete: true };

            wrapper.setState({ permissions });

            const deletePromise = wrapper.instance().deleteVersion('123');

            expect(deletePromise).toBeInstanceOf(Promise);
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
            const versions = [
                { id: '123', name: 'Version 1' },
                { id: '456', name: 'Version 2' },
                { id: '789', name: 'Version 3' },
            ];

            wrapper.setState({ versions });

            expect(instance.findVersion('456')).toEqual(versions[1]);
            expect(instance.findVersion('abc')).toEqual(undefined);
        });
    });

    describe('promoteVersion', () => {
        test('should call promoteVersion', () => {
            const wrapper = getWrapper();
            const permissions = { can_upload: true };

            wrapper.setState({ permissions });

            const promotePromise = wrapper.instance().promoteVersion('123');

            expect(promotePromise).toBeInstanceOf(Promise);
            expect(versionsAPI.promoteVersion).toBeCalledWith({
                fileId: defaultId,
                permissions,
                errorCallback: expect.any(Function),
                successCallback: expect.any(Function),
                versionId: '123',
            });
        });
    });

    describe('render', () => {
        test('should match its snapshot', () => {
            const wrapper = getWrapper({ parentName: 'activity' });
            expect(wrapper).toMatchSnapshot();
        });
    });
});
