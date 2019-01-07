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

        test('should set isOpen if view is unset and isLarge prop has changed', () => {
            const wrapper = getWrapper({ fileId: '123' });
            const instance = wrapper.instance();
            const newProps = { fileId: '123', isLarge: false };

            instance.setState = jest.fn();
            instance.fetchFile = jest.fn();

            instance.componentDidUpdate(newProps);

            expect(instance.fetchFile).not.toBeCalled();
            expect(instance.setState).toBeCalled();
        });

        test('should do nothing if fileId is the same and view is already set', () => {
            const wrapper = getWrapper({ fileId: '123' });
            const instance = wrapper.instance();
            const newProps = { fileId: '123' };

            instance.setState({ view: 'activityFeed' });
            instance.setState = jest.fn();
            instance.fetchFile = jest.fn();

            instance.componentDidUpdate(newProps);

            expect(instance.fetchFile).not.toBeCalled();
            expect(instance.setState).not.toBeCalled();
        });
    });

    describe('onToggle()', () => {
        test('should set new view state but not toggle isOpen state', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();

            wrapper.setState({ view: 'activity', isOpen: true });
            instance.setState = jest.fn();
            instance.onToggle('skills');

            expect(instance.setState).toBeCalledWith({
                isOpen: true,
                view: 'skills',
            });
        });

        test('should set new view state and toggle state', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();

            wrapper.setState({ view: 'skills' });
            instance.setState = jest.fn();
            instance.onToggle('skills');

            expect(instance.setState).toBeCalledWith({
                isOpen: false,
                view: 'skills',
            });
        });
    });

    describe('getSidebarView()', () => {
        test('should return undefined when sidebar is not open', () => {
            const wrapper = getWrapper();
            wrapper.setState({ isOpen: false });
            const instance = wrapper.instance();
            expect(instance.getSidebarView()).toBeUndefined();
        });

        test('should return default view when provided', () => {
            const wrapper = getWrapper({ defaultView: 'default' });
            const instance = wrapper.instance();
            expect(instance.getSidebarView()).toBe('default');
        });

        test('should return skills when no current view is skills and skills exist', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();

            instance.setState({ view: 'skills' });

            SidebarUtils.canHaveDetailsSidebar = jest.fn().mockReturnValueOnce(true);
            SidebarUtils.shouldRenderSkillsSidebar = jest.fn().mockReturnValueOnce(true);
            SidebarUtils.canHaveActivitySidebar = jest.fn().mockReturnValueOnce(true);
            SidebarUtils.shouldRenderMetadataSidebar = jest.fn().mockReturnValueOnce(true);

            expect(instance.getSidebarView()).toBe('skills');
        });

        test('should return activity when current view is activity and skills exist', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();

            instance.setState({ view: 'activity' });

            SidebarUtils.canHaveDetailsSidebar = jest.fn().mockReturnValueOnce(true);
            SidebarUtils.shouldRenderSkillsSidebar = jest.fn().mockReturnValueOnce(true);
            SidebarUtils.canHaveActivitySidebar = jest.fn().mockReturnValueOnce(true);
            SidebarUtils.shouldRenderMetadataSidebar = jest.fn().mockReturnValueOnce(true);

            expect(instance.getSidebarView()).toBe('activity');
        });

        test('should return details when current view is details and skills or activity both exist', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();

            instance.setState({ view: 'details' });

            SidebarUtils.canHaveDetailsSidebar = jest.fn().mockReturnValueOnce(true);
            SidebarUtils.shouldRenderSkillsSidebar = jest.fn().mockReturnValueOnce(true);
            SidebarUtils.canHaveActivitySidebar = jest.fn().mockReturnValueOnce(true);
            SidebarUtils.shouldRenderMetadataSidebar = jest.fn().mockReturnValueOnce(true);

            expect(instance.getSidebarView()).toBe('details');
        });

        test('should return metadata when current view is metadata and skills or activity both exist', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();

            instance.setState({ view: 'metadata' });

            SidebarUtils.canHaveDetailsSidebar = jest.fn().mockReturnValueOnce(true);
            SidebarUtils.shouldRenderSkillsSidebar = jest.fn().mockReturnValueOnce(true);
            SidebarUtils.canHaveActivitySidebar = jest.fn().mockReturnValueOnce(true);
            SidebarUtils.shouldRenderMetadataSidebar = jest.fn().mockReturnValueOnce(true);

            expect(instance.getSidebarView()).toBe('metadata');
        });

        test('should default to skills when no current view and skills exist', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();

            SidebarUtils.canHaveDetailsSidebar = jest.fn().mockReturnValueOnce(true);
            SidebarUtils.shouldRenderSkillsSidebar = jest.fn().mockReturnValueOnce(true);
            SidebarUtils.canHaveActivitySidebar = jest.fn().mockReturnValueOnce(true);
            SidebarUtils.shouldRenderMetadataSidebar = jest.fn().mockReturnValueOnce(true);

            expect(instance.getSidebarView()).toBe('skills');
        });

        test('should default to activity when no current view and skills dont exist', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();

            SidebarUtils.canHaveDetailsSidebar = jest.fn().mockReturnValueOnce(true);
            SidebarUtils.shouldRenderSkillsSidebar = jest.fn().mockReturnValueOnce(false);
            SidebarUtils.canHaveActivitySidebar = jest.fn().mockReturnValueOnce(true);
            SidebarUtils.shouldRenderMetadataSidebar = jest.fn().mockReturnValueOnce(true);

            expect(instance.getSidebarView()).toBe('activity');
        });

        test('should default to details when no current view and skills or activity dont exist', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();

            SidebarUtils.canHaveDetailsSidebar = jest.fn().mockReturnValueOnce(true);
            SidebarUtils.shouldRenderSkillsSidebar = jest.fn().mockReturnValueOnce(false);
            SidebarUtils.canHaveActivitySidebar = jest.fn().mockReturnValueOnce(false);
            SidebarUtils.shouldRenderMetadataSidebar = jest.fn().mockReturnValueOnce(true);

            expect(instance.getSidebarView()).toBe('details');
        });

        test('should default to metadata when no current view and skills or activity or details dont exist', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();

            SidebarUtils.canHaveDetailsSidebar = jest.fn().mockReturnValueOnce(false);
            SidebarUtils.shouldRenderSkillsSidebar = jest.fn().mockReturnValueOnce(false);
            SidebarUtils.canHaveActivitySidebar = jest.fn().mockReturnValueOnce(false);
            SidebarUtils.shouldRenderMetadataSidebar = jest.fn().mockReturnValueOnce(true);

            expect(instance.getSidebarView()).toBe('metadata');
        });

        test('should default to activity when current view is skills but new view has no skills', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();

            instance.setState({ view: 'skills' });

            SidebarUtils.canHaveDetailsSidebar = jest.fn().mockReturnValueOnce(true);
            SidebarUtils.shouldRenderSkillsSidebar = jest.fn().mockReturnValueOnce(false);
            SidebarUtils.canHaveActivitySidebar = jest.fn().mockReturnValueOnce(true);
            SidebarUtils.canHaveMetadataSidebar = jest.fn().mockReturnValueOnce(true);

            expect(instance.getSidebarView()).toBe('activity');
        });

        test('should default to details when current view is skills but new view has no skills or activity', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();

            instance.setState({ view: 'skills' });

            SidebarUtils.canHaveDetailsSidebar = jest.fn().mockReturnValueOnce(true);
            SidebarUtils.shouldRenderSkillsSidebar = jest.fn().mockReturnValueOnce(false);
            SidebarUtils.canHaveActivitySidebar = jest.fn().mockReturnValueOnce(false);
            SidebarUtils.shouldRenderMetadataSidebar = jest.fn().mockReturnValueOnce(true);

            expect(instance.getSidebarView()).toBe('details');
        });

        test('should default to skills when current view is details but new view has no details', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();

            instance.setState({ view: 'details' });

            SidebarUtils.canHaveDetailsSidebar = jest.fn().mockReturnValueOnce(false);
            SidebarUtils.shouldRenderSkillsSidebar = jest.fn().mockReturnValueOnce(true);
            SidebarUtils.canHaveActivitySidebar = jest.fn().mockReturnValueOnce(true);
            SidebarUtils.shouldRenderMetadataSidebar = jest.fn().mockReturnValueOnce(true);

            expect(instance.getSidebarView()).toBe('skills');
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

        beforeEach(() => {
            setState = jest.fn();
            wrapper = getWrapper();
            instance = wrapper.instance();
            instance.setState = setState;
        });

        test('should set the state with the file and view and then call fetchMetadata', () => {
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
    });

    describe('fetchMetadata()', () => {
        let wrapper;
        let instance;
        let getEditorsStub;

        test('should fetch metadata if the feature is enabled and can have the sidebar', () => {
            wrapper = getWrapper({ metadataSidebarProps: { isFeatureEnabled: false } });
            instance = wrapper.instance();
            getEditorsStub = jest.fn();
            instance.api = {
                getMetadataAPI: () => ({
                    getEditors: getEditorsStub,
                }),
                destroy: jest.fn(),
            };

            SidebarUtils.canHaveMetadataSidebar = jest.fn().mockReturnValueOnce(true);

            instance.fetchMetadata();

            expect(getEditorsStub).toBeCalled();
        });

        test('should not fetch metadata if the feature is enabled', () => {
            wrapper = getWrapper({ metadataSidebarProps: { isFeatureEnabled: true } });
            instance = wrapper.instance();
            getEditorsStub = jest.fn();
            instance.api = {
                getMetadataAPI: () => ({
                    getEditors: getEditorsStub,
                }),
                destroy: jest.fn(),
            };

            SidebarUtils.canHaveMetadataSidebar = jest.fn().mockReturnValueOnce(true);

            instance.fetchMetadata();

            expect(getEditorsStub).not.toBeCalled();
        });

        test('should not fetch the metadata if we cannot have the sidebar', () => {
            wrapper = getWrapper({ metadataSidebarProps: { isFeatureEnabled: false } });
            instance = wrapper.instance();
            getEditorsStub = jest.fn();
            instance.api = {
                getMetadataAPI: () => ({
                    getEditors: getEditorsStub,
                }),
                destroy: jest.fn(),
            };

            SidebarUtils.canHaveMetadataSidebar = jest.fn().mockReturnValueOnce(false);

            instance.fetchMetadata();

            expect(getEditorsStub).not.toBeCalled();
        });
    });
});
