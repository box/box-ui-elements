import * as React from 'react';
import { shallow } from 'enzyme/build';
import messages from '../messages';
import openUrlInsideIframe from '../../../../utils/iframe';
import VersionsSidebar from '../VersionsSidebarContainer';

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
    const versionsAPI = {
        addPermissions: jest.fn(),
        sortVersions: jest.fn(),
    };
    const api = {
        getVersionsAPI: () => versionsAPI,
    };
    const getWrapper = ({ ...props } = {}) => shallow(<VersionsSidebar api={api} fileId="12345" {...props} />);

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

        test('should refetch data when refreshIdentity changes', () => {
            const fetchData = jest.fn();
            instance.fetchData = fetchData;

            wrapper.setProps({ refreshIdentity: true });

            expect(fetchData).toHaveBeenCalled();
        });

        test('should not refetch data when refreshIdentity changes', () => {
            const fetchData = jest.fn();
            instance.fetchData = fetchData;

            wrapper.setProps({ refreshIdentity: false });

            expect(fetchData).not.toHaveBeenCalled();
        });
    });

    describe('componentWillUnmount', () => {
        test('should forward verison id reset to the parent component', () => {
            const onVersionChange = jest.fn();
            const wrapper = getWrapper({ onVersionChange });

            wrapper.instance().componentWillUnmount();

            expect(onVersionChange).toBeCalledWith(null);
        });
    });

    describe('handleActionDelete', () => {
        test('should call api endpoint helpers', () => {
            const handleDelete = jest.fn();
            const wrapper = getWrapper({ onVersionDelete: handleDelete, versionId: '123' });
            const instance = wrapper.instance();
            const version = { id: '456' };

            instance.api.deleteVersion = jest.fn().mockResolvedValueOnce();
            instance.api.fetchData = jest.fn().mockResolvedValueOnce();
            instance.findVersion = jest.fn(() => version);
            instance.handleFetchSuccess = jest.fn();
            instance.handleDeleteSuccess = jest.fn();

            instance.handleActionDelete(version.id).then(() => {
                expect(instance.api.deleteVersion).toHaveBeenCalledWith(version);
                expect(instance.api.fetchData).toHaveBeenCalled();
                expect(instance.handleFetchSuccess).toHaveBeenCalled();
                expect(instance.handleDeleteSuccess).toHaveBeenCalledWith(version.id);
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

            instance.api.fetchData = jest.fn().mockResolvedValueOnce();
            instance.api.restoreVersion = jest.fn().mockResolvedValueOnce();
            instance.findVersion = jest.fn(() => version);
            instance.handleFetchSuccess = jest.fn();

            instance.handleActionRestore(version.id).then(() => {
                expect(instance.api.restoreVersion).toHaveBeenCalledWith(version);
                expect(instance.api.fetchData).toHaveBeenCalled();
                expect(instance.handleFetchSuccess).toHaveBeenCalled();
                expect(handleRestore).toHaveBeenCalledWith(version.id);
            });
        });
    });

    describe('handleFetchError', () => {
        test('should set state to default values with error message', () => {
            const wrapper = getWrapper();

            wrapper.instance().handleFetchError();

            expect(wrapper.state()).toEqual({
                error: messages.versionFetchError,
                isLoading: false,
                isWatermarked: false,
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
