import * as React from 'react';
import { shallow } from 'enzyme/build';
import VersionsSidebar from '../VersionsSidebarContainer';

jest.mock('../../../common/api-context', () => ({
    withAPIContext: Component => Component,
}));

describe('elements/content-sidebar/versions/VersionsSidebarContainer', () => {
    const defaultId = '12345';
    const fileAPI = {
        getFile: jest.fn(),
    };
    const versionsAPI = {
        addCurrentVersion: jest.fn(),
        getVersions: jest.fn(),
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
        test('should forward version id changes to the parent component', () => {
            const onVersionChange = jest.fn();
            const wrapper = getWrapper({ onVersionChange });

            wrapper.setProps({ versionId: '12345' });

            expect(onVersionChange).toHaveBeenCalledWith('12345');
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

    describe('fetchFile', () => {
        test('should call getFile', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();

            instance.fetchVersions = jest.fn();
            instance.handleFetchError = jest.fn();
            instance.fetchFile();

            expect(fileAPI.getFile).toHaveBeenCalledWith(defaultId, instance.fetchVersions, instance.handleFetchError);
        });
    });

    describe('fetchVersion', () => {
        test('should call getVersions', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();

            instance.handleFetchError = jest.fn();
            instance.handleFetchSuccess = jest.fn();
            instance.fetchVersions();

            expect(versionsAPI.getVersions).toHaveBeenCalledWith(
                defaultId,
                expect.any(Function),
                instance.handleFetchError,
            );
        });
    });

    describe('render', () => {
        test('should match its snapshot', () => {
            const wrapper = getWrapper({ parentName: 'activity' });
            expect(wrapper).toMatchSnapshot();
        });
    });
});
