import React, { act } from 'react';
import noop from 'lodash/noop';
import { mount } from 'enzyme';
import { ContentSidebarComponent as ContentSidebar } from '../ContentSidebar';
import { isFeatureEnabled } from '../../common/feature-checking';
import { SIDEBAR_FIELDS_TO_FETCH, SIDEBAR_FIELDS_TO_FETCH_ARCHIVE } from '../../../utils/fields';
import SidebarUtils from '../SidebarUtils';

jest.mock('../SidebarUtils');
jest.mock('../Sidebar', () => 'sidebar');
jest.mock('../../common/feature-checking');

const file = {
    id: 'I_AM_A_FILE',
};

describe('elements/content-sidebar/ContentSidebar', () => {
    let rootElement;

    const getWrapper = (props = {}) =>
        mount(<ContentSidebar logger={{ onReadyMetric: jest.fn() }} {...props} />, {
            attachTo: rootElement,
        });

    beforeEach(() => {
        SidebarUtils.canHaveSidebar = jest.fn().mockReturnValueOnce(true);
        rootElement = document.createElement('div');
        document.body.appendChild(rootElement);

        // Prevent componentDidMount from triggering API calls
        ContentSidebar.prototype.componentDidMount = jest.fn();
    });

    afterEach(() => {
        document.body.removeChild(rootElement);
    });

    describe('constructor()', () => {
        let onReadyMetric;
        beforeEach(() => {
            const wrapper = getWrapper();
            ({ onReadyMetric } = wrapper.instance().props.logger);
        });

        test('should emit when js loaded', () => {
            expect(onReadyMetric).toHaveBeenCalledWith({
                endMarkName: expect.any(String),
            });
        });
    });

    describe('componentDidUpdate', () => {
        test('should fetch the file data when the id changes', () => {
            const wrapper = getWrapper({ fileId: '123' });
            const instance = wrapper.instance();
            const newProps = { fileId: '456' };

            instance.setState = jest.fn();
            instance.fetchFile = jest.fn();

            instance.componentDidUpdate(newProps);

            expect(instance.fetchFile).toBeCalled();
            expect(instance.setState).not.toBeCalled();
        });

        test('should not fetch the file data if the id has not changed', () => {
            const wrapper = getWrapper({ fileId: '123' });
            const instance = wrapper.instance();
            const newProps = { fileId: '123' };

            instance.fetchFile = jest.fn();
            instance.setState({ view: 'activityFeed' });
            instance.setState = jest.fn();

            instance.componentDidUpdate(newProps);

            expect(instance.fetchFile).not.toBeCalled();
            expect(instance.setState).not.toBeCalled();
        });
    });

    describe('fetchFile()', () => {
        let fileStub;
        let wrapper;
        let instance;
        let fetchFileSuccessCallback;

        beforeEach(() => {
            wrapper = getWrapper({
                file,
                fileId: file.id,
            });
            instance = wrapper.instance();
            fileStub = jest.fn();
            fetchFileSuccessCallback = jest.fn();
            instance.api = {
                getFileAPI: () => ({
                    getFile: fileStub,
                }),
            };
            instance.fetchFileSuccessCallback = fetchFileSuccessCallback;
            instance.setState = jest.fn();
        });

        test('should not fetch the file when sidebar is not configured to show anything', () => {
            SidebarUtils.canHaveSidebar = jest.fn().mockReturnValueOnce(false);
            instance.fetchFile();
            expect(SidebarUtils.canHaveSidebar).toBeCalledWith(instance.props);
            expect(fileStub).not.toBeCalled();
            expect(instance.setState).toBeCalled();
        });

        test('should fetch the file with forceFetch', () => {
            SidebarUtils.canHaveSidebar = jest.fn().mockReturnValueOnce(true);
            instance.fetchFile({
                forceFetch: true,
            });
            expect(SidebarUtils.canHaveSidebar).toBeCalledWith(instance.props);
            expect(fileStub).toBeCalledWith(file.id, fetchFileSuccessCallback, instance.errorCallback, {
                forceFetch: true,
                fields: SIDEBAR_FIELDS_TO_FETCH,
            });
            expect(instance.setState).toBeCalled();
        });

        test('should fetch the file without forceFetch', () => {
            SidebarUtils.canHaveSidebar = jest.fn().mockReturnValueOnce(true);
            instance.fetchFile();
            expect(SidebarUtils.canHaveSidebar).toBeCalledWith(instance.props);
            expect(fileStub).toBeCalledWith(file.id, fetchFileSuccessCallback, instance.errorCallback, {
                fields: SIDEBAR_FIELDS_TO_FETCH,
            });
            expect(instance.setState).toBeCalled();
        });

        test('should fetch the file with archive metadata field when feature is enabled', () => {
            SidebarUtils.canHaveSidebar = jest.fn().mockReturnValueOnce(true);
            isFeatureEnabled.mockReturnValueOnce(true);
            instance.fetchFile();
            expect(SidebarUtils.canHaveSidebar).toBeCalledWith(instance.props);
            expect(fileStub).toBeCalledWith(file.id, fetchFileSuccessCallback, instance.errorCallback, {
                fields: SIDEBAR_FIELDS_TO_FETCH_ARCHIVE,
            });
            expect(instance.setState).toBeCalled();
        });
    });

    describe('fetchMetadataSuccessCallback()', () => {
        let setState;
        let wrapper;
        let instance;

        beforeEach(() => {
            setState = jest.fn();
            wrapper = getWrapper();
            instance = wrapper.instance();
            instance.setState = setState;
        });

        test('should set metadataEditors', () => {
            const editorsData = { editors: 'editors' };
            instance.fetchMetadataSuccessCallback(editorsData);

            expect(setState).toBeCalledWith({
                metadataEditors: 'editors',
            });
        });
    });

    describe('fetchFileSuccessCallback()', () => {
        let setState;
        let wrapper;
        let instance;

        test('should set the state with the file and view and then call fetchMetadata', () => {
            setState = jest.fn();
            wrapper = getWrapper();
            instance = wrapper.instance();
            instance.setState = setState;
            instance.fetchMetadata = jest.fn();

            instance.fetchFileSuccessCallback(file);

            expect(instance.setState).toBeCalledWith(
                {
                    file,
                    isLoading: false,
                },
                instance.fetchMetadata,
            );
        });

        test(`should call onFetchFileSuccess when it's provided`, () => {
            const onFetchFileSuccess = jest.fn();
            wrapper = getWrapper({ onFetchFileSuccess });
            instance = wrapper.instance();
            instance.setState = setState;
            instance.fetchMetadata = jest.fn();

            instance.fetchFileSuccessCallback(file);

            expect(instance.setState).toBeCalledWith(
                {
                    file,
                    isLoading: false,
                },
                instance.fetchMetadata,
            );
            expect(onFetchFileSuccess).toBeCalled();
        });
    });

    describe('fetchMetadata()', () => {
        let wrapper;
        let instance;

        test('should fetch metadata if the feature is enabled and can have the sidebar', () => {
            const getMetadata = jest.fn();
            const getMetadataAPI = jest.fn().mockReturnValueOnce({
                getMetadata,
            });

            wrapper = getWrapper({ metadataSidebarProps: { isFeatureEnabled: false } });
            act(() => {
                wrapper.setState({ file });
            });
            instance = wrapper.instance();
            instance.api = { getMetadataAPI };

            SidebarUtils.canHaveMetadataSidebar = jest.fn().mockReturnValueOnce(true);

            instance.fetchMetadata();

            expect(SidebarUtils.canHaveMetadataSidebar).toBeCalledWith(instance.props);
            expect(getMetadataAPI).toBeCalledWith(false);
            expect(getMetadata).toBeCalledWith(file, instance.fetchMetadataSuccessCallback, noop, false);
        });

        test('should not fetch metadata if the feature is enabled', () => {
            const getMetadata = jest.fn();
            const getMetadataAPI = jest.fn().mockReturnValueOnce({
                getMetadata,
            });

            wrapper = getWrapper({ metadataSidebarProps: { isFeatureEnabled: true } });
            instance = wrapper.instance();
            instance.api = { getMetadataAPI };

            SidebarUtils.canHaveMetadataSidebar = jest.fn().mockReturnValueOnce(true);

            instance.fetchMetadata();

            expect(SidebarUtils.canHaveMetadataSidebar).not.toBeCalled();
            expect(getMetadataAPI).not.toBeCalled();
            expect(getMetadata).not.toBeCalled();
        });

        test('should not fetch the metadata if we cannot have the sidebar', () => {
            const getMetadata = jest.fn();
            const getMetadataAPI = jest.fn().mockReturnValueOnce({
                getMetadata,
            });

            wrapper = getWrapper({ metadataSidebarProps: { isFeatureEnabled: false } });
            instance = wrapper.instance();
            instance.api = { getMetadataAPI };

            SidebarUtils.canHaveMetadataSidebar = jest.fn().mockReturnValueOnce(false);

            instance.fetchMetadata();

            expect(SidebarUtils.canHaveMetadataSidebar).toBeCalledWith(instance.props);
            expect(getMetadataAPI).not.toBeCalled();
            expect(getMetadata).not.toBeCalled();
        });
    });

    describe('refresh()', () => {
        let wrapper;
        let instance;

        beforeEach(() => {
            wrapper = getWrapper();
            instance = wrapper.instance();
        });

        test('should call sidebarRef refresh method when refresh is called', () => {
            const refresh = jest.fn();
            instance.sidebarRef = { refresh };

            instance.refresh();

            expect(refresh).toHaveBeenCalled();
        });
    });

    describe('render() with minimalFile', () => {
        const minimalFile = {
            id: 'minimal_file_id',
            type: 'file',
            name: 'test.pdf',
            permissions: { can_preview: true },
        };

        beforeEach(() => {
            SidebarUtils.shouldRenderSidebar = jest.fn().mockReturnValue(true);
        });

        test('should render sidebar with minimalFile when file state is not available', () => {
            const wrapper = getWrapper({
                fileId: 'test_id',
                minimalFile,
            });

            wrapper.setState({ file: undefined, isLoading: true });

            expect(wrapper.find('sidebar').exists()).toBe(true);
            expect(wrapper.find('sidebar').prop('file')).toEqual(minimalFile);
            expect(wrapper.find('sidebar').prop('isLoading')).toBe(true);
        });

        test('should render sidebar with file when both file and minimalFile are available', () => {
            const wrapper = getWrapper({
                fileId: file.id,
                minimalFile,
            });

            wrapper.setState({ file, isLoading: false });

            expect(wrapper.find('sidebar').exists()).toBe(true);
            expect(wrapper.find('sidebar').prop('file')).toEqual(file);
            expect(wrapper.find('sidebar').prop('isLoading')).toBe(false);
        });

        test('should return null when neither file nor minimalFile is available', () => {
            SidebarUtils.shouldRenderSidebar = jest.fn().mockReturnValue(true);
            const wrapper = getWrapper({
                fileId: 'test_id',
            });

            wrapper.setState({ file: undefined, isLoading: true });

            expect(wrapper.find('sidebar').exists()).toBe(false);
        });

        test('should pass isLoading as true when using minimalFile without full file data', () => {
            const wrapper = getWrapper({
                fileId: 'test_id',
                minimalFile,
            });

            wrapper.setState({ file: undefined, isLoading: true });

            expect(wrapper.find('sidebar').prop('isLoading')).toBe(true);
        });

        test('should pass isLoading as true when file is loading even with minimalFile', () => {
            const wrapper = getWrapper({
                fileId: 'test_id',
                minimalFile,
            });

            wrapper.setState({ file: undefined, isLoading: true });

            expect(wrapper.find('sidebar').prop('isLoading')).toBe(true);
        });
    });
});
