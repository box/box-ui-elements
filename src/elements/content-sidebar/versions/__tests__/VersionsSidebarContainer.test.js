import * as React from 'react';
import { shallow } from 'enzyme/build';
import messages from '../messages';
import openUrlInsideIframe from '../../../../utils/iframe';
import { VersionsSidebarContainerComponent } from '../VersionsSidebarContainer';

jest.mock('../../../common/api-context', () => ({
    withAPIContext: Component => Component,
}));

jest.mock('../../../../utils/iframe', () => ({
    __esModule: true,
    default: jest.fn(),
}));

const versions = [
    { id: '123', name: 'Version 1' },
    { id: '456', name: 'Version 2' },
    { id: '789', name: 'Version 3' },
];

describe('elements/content-sidebar/versions/VersionsSidebarContainer', () => {
    const versionsAPI = {
        addPermissions: jest.fn(),
        sortVersions: jest.fn(),
    };
    const api = {
        getVersionsAPI: () => versionsAPI,
    };
    const getWrapper = ({ ...props } = {}) =>
        shallow(<VersionsSidebarContainerComponent api={api} fileId="12345" {...props} />);

    describe('componentDidUpdate', () => {
        let onVersionChange;
        let wrapper;
        let instance;

        beforeEach(() => {
            onVersionChange = jest.fn();
            wrapper = getWrapper({ onVersionChange, refreshIdentity: false });
            instance = wrapper.instance();
        });

        test('should verify the selected version id exists when it changes', () => {
            const version = { id: '45678' };
            const currentVersion = { id: '54321' };

            instance.verifyVersion = jest.fn();

            wrapper.setState({ versions: [currentVersion, version] });
            wrapper.setProps({ versionId: '45678' });

            expect(instance.verifyVersion).toHaveBeenCalled();
        });
    });

    describe('componentDidMount', () => {
        test('should call onLoad after a successful fetchData() call', async () => {
            const onLoad = jest.fn();
            const fetchData = jest.fn(() => Promise.resolve());
            const instance = getWrapper({ onLoad }).instance();

            instance.fetchData = fetchData;

            await instance.componentDidMount();
            expect(onLoad).toHaveBeenCalled();
        });
    });

    describe('handleActionDelete', () => {
        test('should call api endpoint helpers', () => {
            const handleDelete = jest.fn();
            const wrapper = getWrapper({ onVersionDelete: handleDelete, versionId: '123' });
            const instance = wrapper.instance();
            const version = { id: '456' };
            const newVersion = { id: '456', trash_at: '' };

            instance.api.deleteVersion = jest.fn().mockResolvedValueOnce();
            instance.api.fetchVersion = jest.fn().mockResolvedValueOnce(newVersion);
            instance.findVersion = jest.fn(() => version);
            instance.handleDeleteSuccess = jest.fn();

            instance.handleActionDelete(version.id).then(() => {
                expect(instance.api.deleteVersion).toHaveBeenCalledWith(version);
                expect(instance.api.fetchVersion).toHaveBeenCalled();
                expect(instance.handleDeleteSuccess).toHaveBeenCalledWith(newVersion);
                expect(handleDelete).toHaveBeenCalledWith(version.id);
            });
        });
    });

    describe('handleActionDownload', () => {
        test('should call api endpoint helpers', () => {
            const downloadUrl = 'https://box.com/url';
            const handleDownload = jest.fn();
            const wrapper = getWrapper({ onVersionDownload: handleDownload, versionId: '123' });
            const instance = wrapper.instance();
            const version = { id: '456' };

            instance.api.fetchDownloadUrl = jest.fn().mockResolvedValueOnce(downloadUrl);
            instance.findVersion = jest.fn(() => version);

            instance.handleActionDownload(version.id).then(() => {
                expect(instance.api.fetchDownloadUrl).toHaveBeenCalledWith(version);
                expect(openUrlInsideIframe).toHaveBeenCalledWith(downloadUrl);
                expect(handleDownload).toHaveBeenCalledWith(version.id);
            });
        });
    });

    describe('handleActionPromote', () => {
        test('should call api endpoint helpers', () => {
            const handlePromote = jest.fn();
            const wrapper = getWrapper({ onVersionPromote: handlePromote, versionId: '123' });
            const instance = wrapper.instance();
            const version = { id: '456' };

            instance.api.fetchData = jest.fn().mockResolvedValueOnce();
            instance.api.promoteVersion = jest.fn().mockResolvedValueOnce();
            instance.findVersion = jest.fn(() => version);
            instance.handleFetchSuccess = jest.fn();
            instance.handlePromoteSuccess = jest.fn();

            instance.handleActionPromote(version.id).then(() => {
                expect(instance.api.promoteVersion).toHaveBeenCalledWith(version);
                expect(instance.api.fetchData).toHaveBeenCalled();
                expect(instance.handleFetchSuccess).toHaveBeenCalled();
                expect(instance.handlePromoteSuccess).toHaveBeenCalled();
                expect(handlePromote).toHaveBeenCalledWith(version.id);
            });
        });
    });

    describe('handleActionRestore', () => {
        test('should call api endpoint helpers', () => {
            const handleRestore = jest.fn();
            const wrapper = getWrapper({ onVersionRestore: handleRestore, versionId: '123' });
            const instance = wrapper.instance();
            const version = { id: '456' };
            const newVersion = { id: '456', restored_by: '' };

            instance.api.restoreVersion = jest.fn().mockResolvedValueOnce();
            instance.api.fetchVersion = jest.fn().mockResolvedValueOnce(newVersion);
            instance.findVersion = jest.fn(() => version);
            instance.handleRestoreSuccess = jest.fn();

            instance.handleActionRestore(version.id).then(() => {
                expect(instance.api.restoreVersion).toHaveBeenCalledWith(version);
                expect(instance.api.fetchVersion).toHaveBeenCalled();
                expect(instance.handleRestoreSuccess).toHaveBeenCalledWith(newVersion);
                expect(handleRestore).toHaveBeenCalledWith(version.id);
            });
        });
    });

    describe('handleDeleteSuccess', () => {
        test('should update version if the same id', () => {
            const wrapper = getWrapper({
                versionId: '123',
            });
            const instance = wrapper.instance();
            const version = { id: '123' };

            instance.updateVersionToCurrent = jest.fn();
            instance.mergeResponse = jest.fn();

            instance.handleDeleteSuccess(version);

            expect(instance.updateVersionToCurrent).toHaveBeenCalled();
            expect(instance.mergeResponse).toHaveBeenCalledWith(version);
        });
    });

    describe('handleRestoreSuccess', () => {
        test('should call mergeResponse', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();
            const version = { id: '123' };

            instance.mergeResponse = jest.fn();

            instance.handleRestoreSuccess(version);

            expect(instance.mergeResponse).toHaveBeenCalledWith(version);
        });
    });

    describe('handleFetchError', () => {
        test('should set state to default values with error message', () => {
            const wrapper = getWrapper();

            wrapper.instance().handleFetchError({ status: 500 });

            expect(wrapper.state()).toMatchObject({
                error: messages.versionFetchError,
                isLoading: false,
                isWatermarked: false,
                versionCount: 0,
                versionLimit: Infinity,
                versions: [],
            });

            expect(wrapper).toMatchSnapshot();
        });

        test('should create StaticVersionSidebar if onUpgradeClick is present', () => {
            const wrapper = getWrapper({
                onUpgradeClick: () => {},
            });
            wrapper.instance().handleFetchError({ status: 403 });

            expect(wrapper).toMatchSnapshot();
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
        });

        test('should set state with the updated versions', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();

            instance.sortVersions = jest.fn().mockReturnValue(versionsWithCurrent.entries);
            instance.verifyVersion = jest.fn();
            instance.handleFetchSuccess([file, versionsWithCurrent]);

            expect(versionsAPI.addPermissions).toBeCalledWith(versionsWithCurrent, file);
            expect(instance.verifyVersion).toBeCalled();
            expect(instance.sortVersions).toBeCalledWith(versionsWithCurrent.entries);
            expect(wrapper.state()).toMatchObject({
                error: undefined,
                isArchived: false,
                isLoading: false,
                isWatermarked: false,
                versionCount: 2,
                versionLimit: 10,
            });
            expect(wrapper.state('versions')).toBe(versionsWithCurrent.entries);
        });

        test('should set state with isWatermarked if file is watermarked', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();
            const testFile = { ...file, watermark_info: { is_watermarked: true } };

            instance.verifyVersion = jest.fn();
            instance.handleFetchSuccess([testFile, versionsWithCurrent]);

            expect(wrapper.state('isWatermarked')).toBe(true);
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

    describe('mergeVersions', () => {
        test('should update state', () => {
            const wrapper = getWrapper();
            wrapper.setState({
                versions,
            });
            const instance = wrapper.instance();
            const newVersion = { id: versions[1].id, trashed_at: null };

            const newVersions = instance.mergeVersions(newVersion);

            expect(newVersions[0]).toEqual(versions[0]);
            expect(newVersions[1]).toEqual(Object.assign(versions[1], newVersion));
        });
    });

    describe('mergeResponse', () => {
        test('should update state', () => {
            const wrapper = getWrapper();
            wrapper.setState({
                error: 'error',
                isLoading: true,
                versions,
            });
            const instance = wrapper.instance();
            const response = { id: '000', name: 'Version 0' };
            const newVersions = [response];
            instance.mergeVersions = jest.fn().mockReturnValue(newVersions);

            instance.mergeResponse(response);

            expect(wrapper.state('error')).toBe(undefined);
            expect(wrapper.state('isLoading')).toBe(false);
            expect(wrapper.state('versions')).toEqual(newVersions);
            expect(instance.mergeVersions).toHaveBeenCalledWith(response);
        });
    });

    describe('refresh', () => {
        test('should refetch data when refresh is called', () => {
            const instance = getWrapper().instance();
            const fetchData = jest.fn();
            instance.fetchData = fetchData;

            instance.refresh();

            expect(fetchData).toHaveBeenCalled();
        });
    });

    describe('sortVersions', () => {
        test('should sort versions by their created date', () => {
            const instance = getWrapper().instance();
            const unsortedVersions = [
                { id: '123', created_at: '2018-10-02T13:01:24-07:00' },
                { id: '456', created_at: '2018-10-02T13:01:41-07:00' },
                { id: '789', created_at: '2018-11-29T17:47:57-08:00' },
            ];
            const sortedVersions = instance.sortVersions(unsortedVersions);

            expect(unsortedVersions).not.toBe(sortedVersions); // Sort call should create a new array
            expect(sortedVersions).toEqual([unsortedVersions[2], unsortedVersions[1], unsortedVersions[0]]);
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
