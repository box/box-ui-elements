import React from 'react';
import { mount } from 'enzyme';
import ContentSidebar from '../ContentSidebar';
import messages from '../../messages';
import SidebarUtils from '../SidebarUtils';

const {
    fileDescriptionInlineErrorTitleMessage,
    defaultInlineErrorContentMessage,
    defaultErrorMaskSubHeaderMessage,
    fileAccessStatsErrorHeaderMessage,
    fileAccessStatsPermissionsError
} = messages;

jest.mock('../SidebarUtils');
jest.mock('../Sidebar', () => 'sidebar');

const file = {
    id: 'I_AM_A_FILE'
};

describe('components/ContentSidebar/ContentSidebar', () => {
    let rootElement;
    const getWrapper = (props) => mount(<ContentSidebar {...props} />, { attachTo: rootElement });

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
                fileId: '123456'
            };
            const wrapper = getWrapper(props);
            const instance = wrapper.instance();
            const newProps = {
                fileId: 'abcdefg'
            };
            instance.fetchData = jest.fn();
            instance.componentWillReceiveProps(newProps);

            expect(instance.fetchData).toBeCalledWith(newProps);
        });

        test('should set new view when visibility may have changed', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();
            const newProps = {
                isCollapsed: true
            };
            instance.setState({ file });

            instance.setState = jest.fn();
            instance.getDefaultSidebarView = jest.fn().mockReturnValueOnce('view');
            instance.componentWillReceiveProps(newProps);

            expect(instance.getDefaultSidebarView).toBeCalledWith(true, file);
            expect(instance.setState).toBeCalledWith({ isCollapsed: true, view: 'view' });
        });
    });

    describe('setFileDescriptionErrorCallback()', () => {
        let instance;
        let wrapper;
        beforeEach(() => {
            const props = {};
            wrapper = getWrapper(props);
            instance = wrapper.instance();
            instance.errorCallback = jest.fn();
        });
        test('should set an inlineError if there is an error in updating the file description', () => {
            instance.setFileDescriptionErrorCallback();
            const inlineErrorState = wrapper.state().fileError.inlineError;
            expect(typeof fileDescriptionInlineErrorTitleMessage).toBe('object');
            expect(typeof defaultInlineErrorContentMessage).toBe('object');
            expect(inlineErrorState.title).toEqual(fileDescriptionInlineErrorTitleMessage);
            expect(inlineErrorState.content).toEqual(defaultInlineErrorContentMessage);
        });
    });

    describe('fetchFileAccessStatsErrorCallback()', () => {
        let instance;
        let wrapper;
        beforeEach(() => {
            const props = {};
            wrapper = getWrapper(props);
            instance = wrapper.instance();
            instance.errorCallback = jest.fn();
        });
        test('should set a maskError if there is an error in fetching the access stats', () => {
            instance.fetchFileAccessStatsErrorCallback();
            const inlineErrorState = wrapper.state().accessStatsError.maskError;
            expect(typeof fileAccessStatsErrorHeaderMessage).toBe('object');
            expect(typeof defaultErrorMaskSubHeaderMessage).toBe('object');
            expect(inlineErrorState.errorHeader).toEqual(fileAccessStatsErrorHeaderMessage);
            expect(inlineErrorState.errorSubHeader).toEqual(defaultErrorMaskSubHeaderMessage);
        });

        test('should set error if forbidden', () => {
            instance.fetchFileAccessStatsErrorCallback({
                status: 403
            });
            const { accessStatsError } = wrapper.state();
            expect(accessStatsError).toEqual({
                error: fileAccessStatsPermissionsError
            });
        });
    });

    describe('onToggle()', () => {
        test('should set new view state', () => {
            const wrapper = getWrapper({ isCollapsed: true });
            const instance = wrapper.instance();

            wrapper.setState({ view: 'activity' });
            instance.setState = jest.fn();
            instance.onToggle('skills');

            expect(instance.setState).toBeCalledWith({ isCollapsed: false, view: 'skills' });
        });

        test('should remove view state', () => {
            const wrapper = getWrapper({ isCollapsed: true });
            const instance = wrapper.instance();

            wrapper.setState({ view: 'activity' });
            instance.setState = jest.fn();
            instance.onToggle('activity');

            expect(instance.setState).toBeCalledWith({ isCollapsed: true, view: undefined });
        });
    });

    describe('getDefaultSidebarView()', () => {
        test('should return undefined when collapsed', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();
            expect(instance.getDefaultSidebarView(true, {})).toBeUndefined();
        });

        test('should return undefined when no file', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();
            expect(instance.getDefaultSidebarView(false)).toBeUndefined();
        });

        test('should return skills when no current view is skills and skills exist', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();

            instance.setState({ view: 'skills' });

            SidebarUtils.canHaveDetailsSidebar = jest.fn().mockReturnValueOnce(true);
            SidebarUtils.shouldRenderSkillsSidebar = jest.fn().mockReturnValueOnce(true);
            SidebarUtils.canHaveActivitySidebar = jest.fn().mockReturnValueOnce(true);

            expect(instance.getDefaultSidebarView(false, file)).toBe('skills');
        });

        test('should return activity when current view is activity and skills exist', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();

            instance.setState({ view: 'activity' });

            SidebarUtils.canHaveDetailsSidebar = jest.fn().mockReturnValueOnce(true);
            SidebarUtils.shouldRenderSkillsSidebar = jest.fn().mockReturnValueOnce(true);
            SidebarUtils.canHaveActivitySidebar = jest.fn().mockReturnValueOnce(true);

            expect(instance.getDefaultSidebarView(false, file)).toBe('activity');
        });

        test('should return details when current view is details and skills or activity both exist', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();

            instance.setState({ view: 'details' });

            SidebarUtils.canHaveDetailsSidebar = jest.fn().mockReturnValueOnce(true);
            SidebarUtils.shouldRenderSkillsSidebar = jest.fn().mockReturnValueOnce(true);
            SidebarUtils.canHaveActivitySidebar = jest.fn().mockReturnValueOnce(true);

            expect(instance.getDefaultSidebarView(false, file)).toBe('details');
        });

        test('should default to skills when no current view and skills exist', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();

            SidebarUtils.canHaveDetailsSidebar = jest.fn().mockReturnValueOnce(false);
            SidebarUtils.shouldRenderSkillsSidebar = jest.fn().mockReturnValueOnce(true);
            SidebarUtils.canHaveActivitySidebar = jest.fn().mockReturnValueOnce(false);

            expect(instance.getDefaultSidebarView(false, file)).toBe('skills');
        });

        test('should default to activity when no current view and skills dont exist', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();

            SidebarUtils.canHaveDetailsSidebar = jest.fn().mockReturnValueOnce(false);
            SidebarUtils.shouldRenderSkillsSidebar = jest.fn().mockReturnValueOnce(false);
            SidebarUtils.canHaveActivitySidebar = jest.fn().mockReturnValueOnce(true);

            expect(instance.getDefaultSidebarView(false, file)).toBe('activity');
        });

        test('should default to details when no current view and skills or activity dont exist', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();

            SidebarUtils.canHaveDetailsSidebar = jest.fn().mockReturnValueOnce(true);
            SidebarUtils.shouldRenderSkillsSidebar = jest.fn().mockReturnValueOnce(false);
            SidebarUtils.canHaveActivitySidebar = jest.fn().mockReturnValueOnce(false);

            expect(instance.getDefaultSidebarView(false, file)).toBe('details');
        });

        test('should default to activity when current view is skills but new view has no skills', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();

            instance.setState({ view: 'skills' });

            SidebarUtils.canHaveDetailsSidebar = jest.fn().mockReturnValueOnce(false);
            SidebarUtils.shouldRenderSkillsSidebar = jest.fn().mockReturnValueOnce(false);
            SidebarUtils.canHaveActivitySidebar = jest.fn().mockReturnValueOnce(true);

            expect(instance.getDefaultSidebarView(false, file)).toBe('activity');
        });

        test('should default to details when current view is skills but new view has no skills', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();

            instance.setState({ view: 'skills' });

            SidebarUtils.canHaveDetailsSidebar = jest.fn().mockReturnValueOnce(true);
            SidebarUtils.shouldRenderSkillsSidebar = jest.fn().mockReturnValueOnce(false);
            SidebarUtils.canHaveActivitySidebar = jest.fn().mockReturnValueOnce(false);

            expect(instance.getDefaultSidebarView(false, file)).toBe('details');
        });

        test('should default to skills when current view is details but new view has no details', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();

            instance.setState({ view: 'details' });

            SidebarUtils.canHaveDetailsSidebar = jest.fn().mockReturnValueOnce(false);
            SidebarUtils.shouldRenderSkillsSidebar = jest.fn().mockReturnValueOnce(true);
            SidebarUtils.canHaveActivitySidebar = jest.fn().mockReturnValueOnce(false);

            expect(instance.getDefaultSidebarView(false, file)).toBe('skills');
        });
    });

    describe('setFileDescriptionSuccessCallback()', () => {
        let instance;
        let wrapper;
        beforeEach(() => {
            wrapper = getWrapper();
            instance = wrapper.instance();
        });

        test('should update the file state', () => {
            instance.setFileDescriptionSuccessCallback(file);

            const { file: fileState, fileError } = instance.state;
            expect(fileState).toEqual(file);
            expect(fileError).toBe(undefined);
        });

        test('should reset fileError if one was previously set', () => {
            const fileError = 'test error';
            instance.setState({ fileError });
            expect(fileError).toBe(fileError);

            instance.setFileDescriptionSuccessCallback(file);
            const { fileError: fileErrorState } = instance.state;
            expect(fileErrorState).toBe(undefined);
        });
    });

    describe('onClassificationChange()', () => {
        let instance;
        let wrapper;
        let fetchFile;

        beforeEach(() => {
            wrapper = getWrapper();
            instance = wrapper.instance();
            fetchFile = jest.fn();
            instance.fetchFile = fetchFile;
        });

        test('should refetch the file', () => {
            wrapper.setProps({
                fileId: file.id
            });
            instance.onClassificationChange();
            expect(fetchFile).toBeCalledWith(file.id, true);
        });

        test('should not refetch the file there is no file id', () => {
            wrapper.setState({
                file
            });

            instance.onClassificationChange();
            expect(fetchFile).not.toBeCalled();
        });
    });

    describe('onClassificationClick()', () => {
        let instance;
        let wrapper;
        let onClassificationClick;

        beforeEach(() => {
            onClassificationClick = jest.fn();
            wrapper = getWrapper({
                detailsSidebarProps: {
                    onClassificationClick
                }
            });
            instance = wrapper.instance();
            instance.onClassificationChange = jest.fn();
        });

        test('should call onClassificationClick with the refresh function', () => {
            instance.onClassificationClick();
            expect(onClassificationClick).toBeCalledWith(instance.onClassificationChange);
        });
    });

    describe('fetchFile()', () => {
        let fileStub;
        let wrapper;
        let instance;
        let fetchFileSuccessCallback;
        let fetchFileErrorCallback;

        beforeEach(() => {
            wrapper = getWrapper({
                file
            });
            instance = wrapper.instance();
            fileStub = jest.fn();
            fetchFileSuccessCallback = jest.fn();
            fetchFileErrorCallback = jest.fn();
            instance.api = {
                getFileAPI: () => ({
                    file: fileStub
                })
            };
            instance.fetchFileSuccessCallback = fetchFileSuccessCallback;
            instance.fetchFileErrorCallback = fetchFileErrorCallback;
        });

        test('should fetch the file with forceFetch', () => {
            instance.fetchFile(file.id);
            expect(fileStub).toBeCalledWith(file.id, fetchFileSuccessCallback, fetchFileErrorCallback, false, true);
        });

        test('should fetch the file with forceFetch', () => {
            instance.fetchFile(file.id);
            expect(fileStub).toBeCalledWith(file.id, fetchFileSuccessCallback, fetchFileErrorCallback, false, true);
        });
    });

    describe('fetchFileSuccessCallback()', () => {
        let setState;
        let getDefaultSidebarView;
        let wrapper;
        let instance;

        beforeEach(() => {
            setState = jest.fn();
            getDefaultSidebarView = jest.fn().mockReturnValueOnce('view');
            wrapper = getWrapper({
                file
            });
            instance = wrapper.instance();
            instance.getDefaultSidebarView = getDefaultSidebarView;
            instance.setState = setState;
        });

        test('should set the file state to be the file response', () => {
            instance.fetchFileSuccessCallback(file);

            expect(getDefaultSidebarView).toBeCalledWith(false, file);
            expect(setState).toBeCalledWith({
                file,
                view: 'view',
                isFileLoading: false
            });
        });
    });

    describe('fetchFileErrorCallback()', () => {
        let setState;
        let wrapper;
        let instance;
        let errorCallback;
        beforeEach(() => {
            setState = jest.fn();
            errorCallback = jest.fn();
            wrapper = getWrapper({
                file
            });
            instance = wrapper.instance();
            instance.setState = setState;
            instance.errorCallback = errorCallback;
        });

        test('should set isFileLoading to be false, and call the errorCallback', () => {
            const err = 'test error';
            instance.fetchFileErrorCallback(err);

            expect(setState).toBeCalledWith({
                isFileLoading: false
            });
            expect(errorCallback).toBeCalledWith(err);
        });
    });
});
