import React from 'react';
import { mount } from 'enzyme';
import { ContentSidebarComponent as ContentSidebar } from '../ContentSidebar';
import SidebarUtils from '../SidebarUtils';
import { SIDEBAR_FIELDS_TO_FETCH } from '../../../util/fields';

jest.mock('../SidebarUtils');
jest.mock('../Sidebar', () => 'sidebar');

const file = {
    id: 'I_AM_A_FILE',
};

const editors = ['foo'];

describe('components/ContentSidebar/ContentSidebar', () => {
    let rootElement;
    const getWrapper = props => mount(<ContentSidebar {...props} />, { attachTo: rootElement });

    beforeEach(() => {
        SidebarUtils.canHaveSidebar = jest.fn().mockReturnValueOnce(true);
        rootElement = document.createElement('div');
        document.body.appendChild(rootElement);
    });

    afterEach(() => {
        document.body.removeChild(rootElement);
    });

    describe('componentWillReceiveProps()', () => {
        test('should fetch data when file id has changed', () => {
            const props = {
                fileId: '123456',
            };
            const wrapper = getWrapper(props);
            const instance = wrapper.instance();
            const newProps = {
                fileId: 'abcdefg',
            };
            instance.fetchData = jest.fn();
            instance.componentWillReceiveProps(newProps);

            expect(instance.fetchData).toBeCalledWith(newProps);
        });

        test('should set new view when viewport width may have changed', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();
            const newProps = {
                isLarge: false,
            };
            instance.setState({ file });

            instance.setState = jest.fn();
            instance.getDefaultSidebarView = jest.fn().mockReturnValueOnce('view');
            instance.componentWillReceiveProps(newProps);

            expect(instance.getDefaultSidebarView).toBeCalledWith(newProps, file, undefined);
            expect(instance.setState).toBeCalledWith({ view: 'view' });
        });

        test('should not set new view when viewport width may have changed but was manually toggled', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();
            const newProps = {
                isLarge: false,
            };
            instance.setState({ file, hasBeenToggled: true });
            instance.setState = jest.fn();
            instance.getDefaultSidebarView = jest.fn().mockReturnValueOnce('view');
            instance.componentWillReceiveProps(newProps);

            expect(instance.getDefaultSidebarView).not.toBeCalled();
            expect(instance.setState).not.toBeCalled();
        });
    });

    describe('onToggle()', () => {
        test('should set new view state but not toggle state', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();

            wrapper.setState({ view: 'activity' });
            instance.setState = jest.fn();
            instance.onToggle('skills');

            expect(instance.setState).toBeCalledWith({
                hasBeenToggled: false,
                view: 'skills',
            });
        });

        test('should set new view state and toggle state', () => {
            const wrapper = getWrapper({ isCollapsed: true });
            const instance = wrapper.instance();

            instance.setState = jest.fn();
            instance.onToggle('skills');

            expect(instance.setState).toBeCalledWith({
                hasBeenToggled: true,
                view: 'skills',
            });
        });

        test('should remove view state', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();

            wrapper.setState({ view: 'activity' });
            instance.setState = jest.fn();
            instance.onToggle('activity');

            expect(instance.setState).toBeCalledWith({
                hasBeenToggled: true,
                view: undefined,
            });
        });
    });

    describe('getDefaultSidebarView()', () => {
        test('should return undefined when no file', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();
            expect(instance.getDefaultSidebarView({}, null, null)).toBeUndefined();
        });

        test('should return default view when provided', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();
            expect(instance.getDefaultSidebarView({ defaultView: 'default' }, {})).toBe('default');
        });

        test('should return undefined when small viewport and not toggled manually', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();
            SidebarUtils.canHaveDetailsSidebar = jest.fn().mockReturnValueOnce(true);
            expect(instance.getDefaultSidebarView({ isLarge: false }, {})).toBeUndefined();
        });

        test('should return some view when large viewport and not toggled manually', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();
            SidebarUtils.canHaveDetailsSidebar = jest.fn().mockReturnValueOnce(true);
            expect(instance.getDefaultSidebarView({ isLarge: true }, {})).toBe('details');
        });

        test('should return skills when no current view is skills and skills exist', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();

            instance.setState({ view: 'skills' });

            SidebarUtils.canHaveDetailsSidebar = jest.fn().mockReturnValueOnce(true);
            SidebarUtils.shouldRenderSkillsSidebar = jest.fn().mockReturnValueOnce(true);
            SidebarUtils.canHaveActivitySidebar = jest.fn().mockReturnValueOnce(true);
            SidebarUtils.shouldRenderMetadataSidebar = jest.fn().mockReturnValueOnce(true);

            expect(instance.getDefaultSidebarView({ isLarge: true }, file)).toBe('skills');
        });

        test('should return activity when current view is activity and skills exist', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();

            instance.setState({ view: 'activity' });

            SidebarUtils.canHaveDetailsSidebar = jest.fn().mockReturnValueOnce(true);
            SidebarUtils.shouldRenderSkillsSidebar = jest.fn().mockReturnValueOnce(true);
            SidebarUtils.canHaveActivitySidebar = jest.fn().mockReturnValueOnce(true);
            SidebarUtils.shouldRenderMetadataSidebar = jest.fn().mockReturnValueOnce(true);

            expect(instance.getDefaultSidebarView({ isLarge: true }, file)).toBe('activity');
        });

        test('should return details when current view is details and skills or activity both exist', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();

            instance.setState({ view: 'details' });

            SidebarUtils.canHaveDetailsSidebar = jest.fn().mockReturnValueOnce(true);
            SidebarUtils.shouldRenderSkillsSidebar = jest.fn().mockReturnValueOnce(true);
            SidebarUtils.canHaveActivitySidebar = jest.fn().mockReturnValueOnce(true);
            SidebarUtils.shouldRenderMetadataSidebar = jest.fn().mockReturnValueOnce(true);

            expect(instance.getDefaultSidebarView({ isLarge: true }, file)).toBe('details');
        });

        test('should return metadata when current view is metadata and skills or activity both exist', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();

            instance.setState({ view: 'metadata' });

            SidebarUtils.canHaveDetailsSidebar = jest.fn().mockReturnValueOnce(true);
            SidebarUtils.shouldRenderSkillsSidebar = jest.fn().mockReturnValueOnce(true);
            SidebarUtils.canHaveActivitySidebar = jest.fn().mockReturnValueOnce(true);
            SidebarUtils.shouldRenderMetadataSidebar = jest.fn().mockReturnValueOnce(true);

            expect(instance.getDefaultSidebarView({ isLarge: true }, file)).toBe('metadata');
        });

        test('should default to skills when no current view and skills exist', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();

            SidebarUtils.canHaveDetailsSidebar = jest.fn().mockReturnValueOnce(true);
            SidebarUtils.shouldRenderSkillsSidebar = jest.fn().mockReturnValueOnce(true);
            SidebarUtils.canHaveActivitySidebar = jest.fn().mockReturnValueOnce(true);
            SidebarUtils.shouldRenderMetadataSidebar = jest.fn().mockReturnValueOnce(true);

            expect(instance.getDefaultSidebarView({ isLarge: true }, file)).toBe('skills');
        });

        test('should default to activity when no current view and skills dont exist', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();

            SidebarUtils.canHaveDetailsSidebar = jest.fn().mockReturnValueOnce(true);
            SidebarUtils.shouldRenderSkillsSidebar = jest.fn().mockReturnValueOnce(false);
            SidebarUtils.canHaveActivitySidebar = jest.fn().mockReturnValueOnce(true);
            SidebarUtils.shouldRenderMetadataSidebar = jest.fn().mockReturnValueOnce(true);

            expect(instance.getDefaultSidebarView({ isLarge: true }, file)).toBe('activity');
        });

        test('should default to details when no current view and skills or activity dont exist', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();

            SidebarUtils.canHaveDetailsSidebar = jest.fn().mockReturnValueOnce(true);
            SidebarUtils.shouldRenderSkillsSidebar = jest.fn().mockReturnValueOnce(false);
            SidebarUtils.canHaveActivitySidebar = jest.fn().mockReturnValueOnce(false);
            SidebarUtils.shouldRenderMetadataSidebar = jest.fn().mockReturnValueOnce(true);

            expect(instance.getDefaultSidebarView({ isLarge: true }, file)).toBe('details');
        });

        test('should default to metadata when no current view and skills or activity or details dont exist', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();

            SidebarUtils.canHaveDetailsSidebar = jest.fn().mockReturnValueOnce(false);
            SidebarUtils.shouldRenderSkillsSidebar = jest.fn().mockReturnValueOnce(false);
            SidebarUtils.canHaveActivitySidebar = jest.fn().mockReturnValueOnce(false);
            SidebarUtils.shouldRenderMetadataSidebar = jest.fn().mockReturnValueOnce(true);

            expect(instance.getDefaultSidebarView({ isLarge: true }, file)).toBe('metadata');
        });

        test('should default to activity when current view is skills but new view has no skills', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();

            instance.setState({ view: 'skills' });

            SidebarUtils.canHaveDetailsSidebar = jest.fn().mockReturnValueOnce(true);
            SidebarUtils.shouldRenderSkillsSidebar = jest.fn().mockReturnValueOnce(false);
            SidebarUtils.canHaveActivitySidebar = jest.fn().mockReturnValueOnce(true);
            SidebarUtils.canHaveMetadataSidebar = jest.fn().mockReturnValueOnce(true);

            expect(instance.getDefaultSidebarView({ isLarge: true }, file)).toBe('activity');
        });

        test('should default to details when current view is skills but new view has no skills or activity', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();

            instance.setState({ view: 'skills' });

            SidebarUtils.canHaveDetailsSidebar = jest.fn().mockReturnValueOnce(true);
            SidebarUtils.shouldRenderSkillsSidebar = jest.fn().mockReturnValueOnce(false);
            SidebarUtils.canHaveActivitySidebar = jest.fn().mockReturnValueOnce(false);
            SidebarUtils.shouldRenderMetadataSidebar = jest.fn().mockReturnValueOnce(true);

            expect(instance.getDefaultSidebarView({ isLarge: true }, file)).toBe('details');
        });

        test('should default to skills when current view is details but new view has no details', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();

            instance.setState({ view: 'details' });

            SidebarUtils.canHaveDetailsSidebar = jest.fn().mockReturnValueOnce(false);
            SidebarUtils.shouldRenderSkillsSidebar = jest.fn().mockReturnValueOnce(true);
            SidebarUtils.canHaveActivitySidebar = jest.fn().mockReturnValueOnce(true);
            SidebarUtils.shouldRenderMetadataSidebar = jest.fn().mockReturnValueOnce(true);

            expect(instance.getDefaultSidebarView({ isLarge: true }, file)).toBe('skills');
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
        });

        test('should not fetch the file when sidebar is not configured to show anything', () => {
            SidebarUtils.canHaveSidebar = jest.fn().mockReturnValueOnce(false);
            instance.fetchFile(file.id);
            expect(SidebarUtils.canHaveSidebar).toBeCalledWith(instance.props);
            expect(fileStub).not.toBeCalled();
        });

        test('should fetch the file with forceFetch', () => {
            SidebarUtils.canHaveSidebar = jest.fn().mockReturnValueOnce(true);
            instance.fetchFile(file.id, {
                forceFetch: true,
            });
            expect(SidebarUtils.canHaveSidebar).toBeCalledWith(instance.props);
            expect(fileStub).toBeCalledWith(file.id, fetchFileSuccessCallback, instance.errorCallback, {
                forceFetch: true,
                fields: SIDEBAR_FIELDS_TO_FETCH,
            });
        });

        test('should fetch the file without forceFetch', () => {
            SidebarUtils.canHaveSidebar = jest.fn().mockReturnValueOnce(true);
            instance.fetchFile(file.id);
            expect(SidebarUtils.canHaveSidebar).toBeCalledWith(instance.props);
            expect(fileStub).toBeCalledWith(file.id, fetchFileSuccessCallback, instance.errorCallback, {
                fields: SIDEBAR_FIELDS_TO_FETCH,
            });
        });
    });

    describe('fetchMetadataSuccessCallback()', () => {
        let setState;
        let getDefaultSidebarView;
        let wrapper;
        let instance;

        beforeEach(() => {
            setState = jest.fn();
            getDefaultSidebarView = jest.fn().mockReturnValueOnce('view');
            wrapper = getWrapper({
                file,
            });
            instance = wrapper.instance();
            instance.getDefaultSidebarView = getDefaultSidebarView;
            instance.setState = setState;
        });

        test('should set visibility to false when no data to show', () => {
            SidebarUtils.shouldRenderSidebar = jest.fn().mockReturnValueOnce(false);
            instance.fetchMetadataSuccessCallback(file);

            expect(getDefaultSidebarView).not.toBeCalled();
            expect(SidebarUtils.shouldRenderSidebar).toBeCalledWith(instance.props, file, undefined);
            expect(setState).toBeCalledWith({
                isVisible: false,
            });
        });

        test('should set the file and metadata state from responses', () => {
            SidebarUtils.shouldRenderSidebar = jest.fn().mockReturnValueOnce(true);
            instance.fetchMetadataSuccessCallback(file, editors);

            expect(getDefaultSidebarView).toBeCalledWith(instance.props, file, editors);
            expect(SidebarUtils.shouldRenderSidebar).toBeCalledWith(instance.props, file, editors);
            expect(setState).toBeCalledWith({
                file,
                editors,
                view: 'view',
                isVisible: true,
            });
        });
    });

    describe('fetchFileSuccessCallback()', () => {
        let setState;
        let getDefaultSidebarView;
        let wrapper;
        let instance;
        const getMetadata = jest.fn();

        beforeEach(() => {
            setState = jest.fn();
            getDefaultSidebarView = jest.fn().mockReturnValueOnce('view');
            wrapper = getWrapper({
                file,
                metadataSidebarProps: {
                    getMetadata,
                    isFeatureEnabled: false,
                },
            });
            instance = wrapper.instance();
            instance.getDefaultSidebarView = getDefaultSidebarView;
            instance.setState = setState;
        });

        test('should just call metadata success callback when metadata feature is enabled', () => {
            wrapper = getWrapper({
                file,
                metadataSidebarProps: {
                    getMetadata,
                    isFeatureEnabled: true,
                },
            });
            instance = wrapper.instance();
            instance.getDefaultSidebarView = getDefaultSidebarView;
            instance.setState = setState;

            SidebarUtils.canHaveMetadataSidebar = jest.fn().mockReturnValueOnce(true);
            instance.fetchMetadataSuccessCallback = jest.fn();
            instance.fetchFileSuccessCallback(file);

            expect(getDefaultSidebarView).not.toBeCalled();
            expect(SidebarUtils.canHaveMetadataSidebar).not.toBeCalled();
            expect(instance.fetchMetadataSuccessCallback).toBeCalledWith(file);
        });

        test('should call metadata success callback when no metadata sidebar', () => {
            SidebarUtils.canHaveMetadataSidebar = jest.fn().mockReturnValueOnce(false);
            instance.fetchMetadataSuccessCallback = jest.fn();
            instance.fetchFileSuccessCallback(file);

            expect(getDefaultSidebarView).not.toBeCalled();
            expect(SidebarUtils.canHaveMetadataSidebar).toBeCalledWith(instance.props);
            expect(instance.fetchMetadataSuccessCallback).toBeCalledWith(file);
        });

        test('should call the fetch metadata when metadata sidebar is allowed', () => {
            const getEditors = jest.fn();
            const getMetadataAPI = jest.fn().mockReturnValueOnce({
                getEditors,
            });

            SidebarUtils.canHaveMetadataSidebar = jest.fn().mockReturnValueOnce(true);

            instance.api = {
                getMetadataAPI,
            };

            instance.fetchFileSuccessCallback(file);

            expect(getEditors).toBeCalledWith(file, expect.any(Function), expect.any(Function), getMetadata, false);
            expect(SidebarUtils.canHaveMetadataSidebar).toBeCalledWith(instance.props);
            expect(getMetadataAPI).toBeCalledWith(true);
        });
    });
});
