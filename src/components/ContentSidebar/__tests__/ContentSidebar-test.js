import React from 'react';
import { mount } from 'enzyme';
import ContentSidebar from '../ContentSidebar';
import messages from '../../messages';
import SidebarUtils from '../SidebarUtils';

const {
    fileDescriptionInlineErrorTitleMessage,
    defaultInlineErrorContentMessage,
    versionHistoryErrorHeaderMessage,
    defaultErrorMaskSubHeaderMessage,
    fileAccessStatsErrorHeaderMessage,
    currentUserErrorHeaderMessage
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
            expect(instance.setState).toBeCalledWith({ view: 'view', isCollapsed: true });
        });

        test('should update the isCollapsed state when isCollapsed prop changed', () => {
            const wrapper = getWrapper({
                isCollapsed: false
            });
            expect(wrapper.state('isCollapsed')).toBe(false);

            const newProps = {
                isCollapsed: true
            };
            wrapper.setProps(newProps);
            expect(wrapper.state('isCollapsed')).toBe(true);
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

    describe('fetchVersionsErrorCallback()', () => {
        let instance;
        let wrapper;
        beforeEach(() => {
            const props = {};
            wrapper = getWrapper(props);
            instance = wrapper.instance();
            instance.errorCallback = jest.fn();
        });
        test('should set a maskError if there is an error in fetching version history', () => {
            instance.fetchVersionsErrorCallback();
            const inlineErrorState = wrapper.state().versionError.maskError;
            expect(typeof versionHistoryErrorHeaderMessage).toBe('object');
            expect(typeof defaultErrorMaskSubHeaderMessage).toBe('object');
            expect(inlineErrorState.errorHeader).toEqual(versionHistoryErrorHeaderMessage);
            expect(inlineErrorState.errorSubHeader).toEqual(defaultErrorMaskSubHeaderMessage);
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
    });

    describe('fetchCurrentUserErrorCallback()', () => {
        let instance;
        let wrapper;
        beforeEach(() => {
            const props = {};
            wrapper = getWrapper(props);
            instance = wrapper.instance();
            instance.errorCallback = jest.fn();
        });

        test('should set a maskError if there is an error in fetching the access stats', () => {
            instance.fetchCurrentUserErrorCallback();
            const inlineErrorState = wrapper.state().currentUserError.maskError;
            expect(typeof currentUserErrorHeaderMessage).toBe('object');
            expect(typeof defaultErrorMaskSubHeaderMessage).toBe('object');
            expect(inlineErrorState.errorHeader).toEqual(currentUserErrorHeaderMessage);
            expect(inlineErrorState.errorSubHeader).toEqual(defaultErrorMaskSubHeaderMessage);
        });
    });

    describe('fetchCurrentUser()', () => {
        let instance;
        let wrapper;
        test('should invoke setState() directly if user parameter is not missing', () => {
            const currentUser = {
                id: '1234',
                login: 'wile@acmetesting.com'
            };

            const props = { hasProperties: true }; // to force render
            wrapper = getWrapper(props);
            instance = wrapper.instance();
            instance.errorCallback = jest.fn();

            instance.setState = jest.fn();

            instance.fetchCurrentUser(currentUser);
            expect(instance.setState).toBeCalledWith({ currentUser, currentUserError: undefined });
        });
    });

    describe('createCommentSuccessCallback()', () => {
        let instance;
        let wrapper;
        beforeEach(() => {
            wrapper = getWrapper();
            instance = wrapper.instance();
        });

        test('should not add to the comment entries state if there is none', () => {
            instance.setState({ comments: undefined });
            instance.setState = jest.fn();

            instance.createCommentSuccessCallback({});

            expect(instance.setState).not.toBeCalled();
        });

        test('should add the comment to the comment entries state', () => {
            instance.setState({
                comments: {
                    total_count: 0,
                    entries: []
                }
            });

            instance.createCommentSuccessCallback({
                type: 'comment'
            });

            const { comments } = instance.state;
            expect(comments.entries.length).toBe(1);
        });

        test('should increase total_count of the comment state', () => {
            instance.setState({
                comments: {
                    total_count: 0,
                    entries: []
                }
            });

            instance.createCommentSuccessCallback({
                type: 'comment'
            });

            const { comments } = instance.state;
            expect(comments.total_count).toBe(1);
        });
    });

    describe('createComment()', () => {
        let instance;
        let wrapper;
        let commentsAPI;

        const api = {
            getCommentsAPI: () => commentsAPI
        };

        beforeEach(() => {
            wrapper = getWrapper();
            instance = wrapper.instance();
            instance.api = api;
        });

        test('should throw an error if there is no file in the state', () => {
            expect(instance.createComment).toThrow('Bad box item!');
        });

        test('should have "message" data if comment does not contain mentions', (done) => {
            const text = 'My tagged_message';
            commentsAPI = {
                createComment: ({ message }) => {
                    expect(message).toEqual(text);
                    done();
                }
            };
            instance.setState({ file });

            instance.createComment(text, false);
        });

        test('should have "tagged_message" data if comment contains mentions', (done) => {
            const text = 'My tagged_message';
            commentsAPI = {
                createComment: ({ taggedMessage }) => {
                    expect(taggedMessage).toEqual(text);
                    done();
                }
            };
            instance.setState({ file });

            instance.createComment(text, true);
        });

        test('should invoke createCommentSuccessCallback() with a new comment if api was successful', (done) => {
            instance.createCommentSuccessCallback = jest.fn();
            commentsAPI = {
                createComment: ({ successCallback }) => {
                    successCallback();
                    expect(instance.createCommentSuccessCallback).toBeCalled();
                    done();
                }
            };
            instance.setState({ file });

            instance.createComment('text');
        });

        test('should invoke provided successCallback with a new comment if api was successful', (done) => {
            const onSuccess = jest.fn();
            commentsAPI = {
                createComment: ({ successCallback }) => {
                    successCallback();
                    expect(onSuccess).toBeCalled();
                    done();
                }
            };
            instance.setState({ file });

            instance.createComment('text', false, onSuccess);
        });

        test('should invoke errorCallback() if it failed to create a comment', (done) => {
            instance.errorCallback = jest.fn();
            commentsAPI = {
                createComment: ({ errorCallback }) => {
                    errorCallback();
                    expect(instance.errorCallback).toBeCalled();
                    done();
                }
            };
            instance.setState({ file });

            instance.createComment('text');
        });

        test('should invoke provided errorCallback if it failed to create a comment', (done) => {
            const testErrorCallback = jest.fn();
            instance.errorCallback = jest.fn();

            commentsAPI = {
                createComment: ({ errorCallback }) => {
                    errorCallback();
                    expect(testErrorCallback).toBeCalled();
                    done();
                }
            };
            instance.setState({ file });

            instance.createComment('text', false, jest.fn(), testErrorCallback);
        });
    });

    describe('createTask()', () => {
        let instance;
        let wrapper;
        let tasksAPI;

        const api = {
            getTaskAPI: () => tasksAPI
        };

        beforeEach(() => {
            wrapper = getWrapper();
            instance = wrapper.instance();
            instance.api = api;
        });

        test('should throw an error if there is no file in the state', () => {
            expect(instance.createTask).toThrow('Bad box item!');
        });
    });

    describe('updateTask()', () => {
        let instance;
        let wrapper;
        let tasksAPI;

        const api = {
            getTasksAPI: () => tasksAPI
        };

        beforeEach(() => {
            wrapper = getWrapper();
            instance = wrapper.instance();
            instance.api = api;
        });

        test('should throw an error if there is no file in the state', () => {
            expect(instance.updateTask).toThrow('Bad box item!');
        });

        test('should execute success callback', (done) => {
            const onTaskUpdate = jest.fn();
            const successCb = jest.fn();
            const errorCb = jest.fn();

            wrapper.setProps({
                activitySidebarProps: {
                    onTaskUpdate
                }
            });
            instance.updateTaskSuccessCallback = jest.fn();

            tasksAPI = {
                updateTask: ({ successCallback }) => {
                    successCallback();

                    expect(instance.updateTaskSuccessCallback).toBeCalled();
                    expect(onTaskUpdate).toBeCalled();
                    expect(successCb).toBeCalled();
                    expect(errorCb).not.toBeCalled();
                    done();
                }
            };

            instance.setState({ file });
            instance.updateTask('1', 'foo', successCb, errorCb);
        });

        test('should execute error callback', (done) => {
            const onTaskUpdate = jest.fn();
            const successCb = jest.fn();
            const errorCb = jest.fn();

            wrapper.setProps({
                activitySidebarProps: {
                    onTaskUpdate
                }
            });
            instance.updateTaskSuccessCallback = jest.fn();
            instance.errorCallback = jest.fn();

            tasksAPI = {
                updateTask: ({ errorCallback }) => {
                    errorCallback();

                    expect(instance.updateTaskSuccessCallback).not.toBeCalled();
                    expect(onTaskUpdate).not.toBeCalled();
                    expect(successCb).not.toBeCalled();
                    expect(errorCb).toBeCalled();
                    expect(instance.errorCallback).toBeCalled();
                    done();
                }
            };

            instance.setState({ file }, () => {
                instance.updateTask('1', 'foo', successCb, errorCb);
            });
        });
    });

    describe('updateTaskSuccessCallback()', () => {
        let instance;
        let wrapper;
        beforeEach(() => {
            wrapper = getWrapper();
            instance = wrapper.instance();
        });

        test('should update the task', () => {
            const id = '1';
            const message = 'foo';

            wrapper.setState({
                tasks: {
                    total_count: 1,
                    entries: [
                        {
                            id,
                            message: 'bar'
                        }
                    ]
                }
            });

            instance.updateTaskSuccessCallback({
                id,
                type: 'task',
                message
            });

            const { tasks } = instance.state;
            expect(tasks.entries.length).toBe(1);
            expect(tasks.entries[0].message).toBe(message);
        });

        test('should not update if invalid id', () => {
            const id = '1';
            const message = 'foo';

            wrapper.setState({
                tasks: {
                    total_count: 1,
                    entries: [
                        {
                            id,
                            message
                        }
                    ]
                }
            });

            instance.updateTaskSuccessCallback({
                id: '2',
                type: 'task',
                message: 'bar'
            });

            const { tasks } = instance.state;
            expect(tasks.entries.length).toBe(1);
            expect(tasks.entries[0].message).toBe(message);
        });
    });

    describe('deleteTaskSuccessCallback()', () => {
        let instance;
        let wrapper;
        beforeEach(() => {
            wrapper = getWrapper();
            instance = wrapper.instance();
        });

        test('should not delete the task entries state if invalid task id', () => {
            wrapper.setState({
                tasks: {
                    total_count: 1,
                    entries: [
                        {
                            id: '1'
                        }
                    ]
                }
            });

            instance.deleteTaskSuccessCallback('2');
            expect(wrapper.state('tasks').total_count).toBe(1);
        });

        test('should delete the task entry', () => {
            const id = '1';

            wrapper.setState({
                tasks: {
                    total_count: 1,
                    entries: [
                        {
                            id
                        }
                    ]
                }
            });

            instance.deleteTaskSuccessCallback(id);

            const tasks = wrapper.state('tasks');
            expect(tasks.total_count).toBe(0);
            expect(tasks.entries.length).toBe(0);
        });
    });

    describe('deleteTask()', () => {
        let instance;
        let wrapper;
        let tasksAPI;

        const api = {
            getTasksAPI: () => tasksAPI
        };

        beforeEach(() => {
            wrapper = getWrapper();
            instance = wrapper.instance();
            instance.api = api;
        });

        test('should throw an error if there is no file in the state', () => {
            expect(instance.updateTask).toThrow('Bad box item!');
        });

        test('should execute success callback', (done) => {
            const onTaskUpdate = jest.fn();
            const successCb = jest.fn();
            const errorCb = jest.fn();

            wrapper.setProps({
                activitySidebarProps: {
                    onTaskUpdate
                }
            });
            instance.updateTaskSuccessCallback = jest.fn();

            tasksAPI = {
                updateTask: ({ successCallback }) => {
                    successCallback();

                    expect(instance.updateTaskSuccessCallback).toBeCalled();
                    expect(onTaskUpdate).toBeCalled();
                    expect(successCb).toBeCalled();
                    expect(errorCb).not.toBeCalled();
                    done();
                }
            };

            instance.setState({ file });
            instance.updateTask('1', 'foo', successCb, errorCb);
        });

        test('should execute error callback', (done) => {
            const onTaskUpdate = jest.fn();
            const successCb = jest.fn();
            const errorCb = jest.fn();

            wrapper.setProps({
                onTaskUpdate
            });
            instance.updateTaskSuccessCallback = jest.fn();
            instance.errorCallback = jest.fn();

            tasksAPI = {
                updateTask: ({ errorCallback }) => {
                    errorCallback();

                    expect(instance.updateTaskSuccessCallback).not.toBeCalled();
                    expect(onTaskUpdate).not.toBeCalled();
                    expect(successCb).not.toBeCalled();
                    expect(errorCb).toBeCalled();
                    expect(instance.errorCallback).toBeCalled();
                    done();
                }
            };

            instance.setState({ file }, () => {
                instance.updateTask('1', 'foo', successCb, errorCb);
            });
        });
    });

    describe('deleteComment()', () => {
        let instance;
        let wrapper;
        let commentsAPI;

        const api = {
            getCommentsAPI: () => commentsAPI
        };

        beforeEach(() => {
            wrapper = getWrapper();
            instance = wrapper.instance();
            instance.api = api;
        });

        test('should execute success callback', (done) => {
            const onCommentDelete = jest.fn();
            const successCb = jest.fn();
            const errorCb = jest.fn();

            wrapper.setProps({
                activitySidebarProps: {
                    onCommentDelete
                }
            });
            instance.deleteCommentSuccessCallback = jest.fn();

            commentsAPI = {
                deleteComment: ({ successCallback }) => {
                    successCallback();

                    expect(instance.deleteCommentSuccessCallback).toBeCalled();
                    expect(onCommentDelete).toBeCalled();
                    expect(successCb).toBeCalled();
                    expect(errorCb).not.toBeCalled();
                    done();
                }
            };

            instance.setState({ file });
            instance.deleteComment('1', {}, successCb, errorCb);
        });

        test('should execute error callback', (done) => {
            const onCommentDelete = jest.fn();
            const successCb = jest.fn();
            const errorCb = jest.fn();

            wrapper.setProps({
                onCommentDelete
            });
            instance.deleteCommentSuccessCallback = jest.fn();
            instance.errorCallback = jest.fn();

            commentsAPI = {
                deleteComment: ({ errorCallback }) => {
                    errorCallback();

                    expect(instance.deleteCommentSuccessCallback).not.toBeCalled();
                    expect(onCommentDelete).not.toBeCalled();
                    expect(successCb).not.toBeCalled();
                    expect(errorCb).toBeCalled();
                    expect(instance.errorCallback).toBeCalled();
                    done();
                }
            };

            instance.setState({ file }, () => {
                instance.deleteComment('1', {}, successCb, errorCb);
            });
        });
    });

    describe('deleteCommentSuccessCallback', () => {
        let instance;
        let wrapper;
        beforeEach(() => {
            wrapper = getWrapper();
            instance = wrapper.instance();
        });

        test('should not delete the comment entries state if invalid comment id', () => {
            wrapper.setState({
                comments: {
                    total_count: 1,
                    entries: [
                        {
                            id: '1'
                        }
                    ]
                }
            });
            instance.setState = jest.fn();

            instance.deleteCommentSuccessCallback('2');
            expect(wrapper.state('comments').total_count).toBe(1);
        });

        test('should delete the comments entry', () => {
            const id = '1';

            wrapper.setState({
                comments: {
                    total_count: 1,
                    entries: [
                        {
                            id
                        }
                    ]
                }
            });

            instance.deleteCommentSuccessCallback(id);

            const comments = wrapper.state('comments');
            expect(comments.total_count).toBe(0);
            expect(comments.entries.length).toBe(0);
        });
    });

    describe('createTaskSuccessCallback()', () => {
        let instance;
        let wrapper;
        beforeEach(() => {
            wrapper = getWrapper();
            instance = wrapper.instance();
        });

        test('should not add to the task entries state if there is none', () => {
            instance.setState({ tasks: undefined });
            instance.setState = jest.fn();

            instance.createTaskSuccessCallback({});

            expect(instance.setState).not.toBeCalled();
        });

        test('should add the task to the task entries state, and increates total_count by one', () => {
            instance.setState({
                tasks: {
                    total_count: 0,
                    entries: []
                }
            });

            instance.createTaskSuccessCallback({
                type: 'task'
            });

            const { tasks } = instance.state;
            expect(tasks.entries.length).toBe(1);
            expect(tasks.total_count).toBe(1);
        });
    });

    describe('createTask()', () => {
        let instance;
        let wrapper;
        let tasksAPI;
        const api = {
            getTasksAPI: () => tasksAPI
        };

        beforeEach(() => {
            wrapper = getWrapper();
            instance = wrapper.instance();
            instance.api = api;
        });

        test('should throw an error if there is no file in the state', () => {
            expect(instance.createTask).toThrow('Bad box item!');
        });

        test('should invoke createTaskSuccessCallback() with a new task if api was successful', (done) => {
            instance.createTaskSuccessCallback = jest.fn();
            tasksAPI = {
                createTask: ({ successCallback }) => {
                    successCallback();
                    expect(instance.createTaskSuccessCallback).toBeCalled();
                    done();
                }
            };
            instance.setState({ file });

            instance.createTask('text');
        });

        test('should invoke provided successCallback with a new task if api was successful', (done) => {
            const onSuccess = jest.fn();
            tasksAPI = {
                createTask: ({ successCallback }) => {
                    successCallback();
                    expect(onSuccess).toBeCalled();
                    done();
                }
            };
            instance.setState({ file });

            instance.createTask('text', undefined, undefined, onSuccess);
        });

        test('should invoke errorCallback() if it failed to create a task', (done) => {
            instance.errorCallback = jest.fn();
            tasksAPI = {
                createTask: ({ errorCallback }) => {
                    errorCallback();
                    expect(instance.errorCallback).toBeCalled();
                    done();
                }
            };
            instance.setState({ file });

            instance.createTask('text');
        });

        test('should invoke provided errorCallback if it failed to create a task', (done) => {
            const testErrorCallback = jest.fn();
            tasksAPI = {
                createTask: ({ errorCallback }) => {
                    errorCallback();
                    expect(testErrorCallback).toBeCalled();
                    done();
                }
            };
            instance.setState({ file });
            instance.errorCallback = jest.fn();

            instance.createTask('text', undefined, undefined, undefined, testErrorCallback);
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

            SidebarUtils.shouldRenderDetailsSidebar = jest.fn().mockReturnValueOnce(true);
            SidebarUtils.shouldRenderSkillsSidebar = jest.fn().mockReturnValueOnce(true);
            SidebarUtils.shouldRenderActivitySidebar = jest.fn().mockReturnValueOnce(true);

            expect(instance.getDefaultSidebarView(false, file)).toBe('skills');
        });

        test('should return activity when current view is activity and skills exist', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();

            instance.setState({ view: 'activity' });

            SidebarUtils.shouldRenderDetailsSidebar = jest.fn().mockReturnValueOnce(true);
            SidebarUtils.shouldRenderSkillsSidebar = jest.fn().mockReturnValueOnce(true);
            SidebarUtils.shouldRenderActivitySidebar = jest.fn().mockReturnValueOnce(true);

            expect(instance.getDefaultSidebarView(false, file)).toBe('activity');
        });

        test('should return details when current view is details and skills or activity both exist', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();

            instance.setState({ view: 'details' });

            SidebarUtils.shouldRenderDetailsSidebar = jest.fn().mockReturnValueOnce(true);
            SidebarUtils.shouldRenderSkillsSidebar = jest.fn().mockReturnValueOnce(true);
            SidebarUtils.shouldRenderActivitySidebar = jest.fn().mockReturnValueOnce(true);

            expect(instance.getDefaultSidebarView(false, file)).toBe('details');
        });

        test('should default to skills when no current view and skills exist', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();

            SidebarUtils.shouldRenderDetailsSidebar = jest.fn().mockReturnValueOnce(false);
            SidebarUtils.shouldRenderSkillsSidebar = jest.fn().mockReturnValueOnce(true);
            SidebarUtils.shouldRenderActivitySidebar = jest.fn().mockReturnValueOnce(false);

            expect(instance.getDefaultSidebarView(false, file)).toBe('skills');
        });

        test('should default to activity when no current view and skills dont exist', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();

            SidebarUtils.shouldRenderDetailsSidebar = jest.fn().mockReturnValueOnce(false);
            SidebarUtils.shouldRenderSkillsSidebar = jest.fn().mockReturnValueOnce(false);
            SidebarUtils.shouldRenderActivitySidebar = jest.fn().mockReturnValueOnce(true);

            expect(instance.getDefaultSidebarView(false, file)).toBe('activity');
        });

        test('should default to details when no current view and skills or activity dont exist', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();

            SidebarUtils.shouldRenderDetailsSidebar = jest.fn().mockReturnValueOnce(true);
            SidebarUtils.shouldRenderSkillsSidebar = jest.fn().mockReturnValueOnce(false);
            SidebarUtils.shouldRenderActivitySidebar = jest.fn().mockReturnValueOnce(false);

            expect(instance.getDefaultSidebarView(false, file)).toBe('details');
        });

        test('should default to activity when current view is skills but new view has no skills', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();

            instance.setState({ view: 'skills' });

            SidebarUtils.shouldRenderDetailsSidebar = jest.fn().mockReturnValueOnce(false);
            SidebarUtils.shouldRenderSkillsSidebar = jest.fn().mockReturnValueOnce(false);
            SidebarUtils.shouldRenderActivitySidebar = jest.fn().mockReturnValueOnce(true);

            expect(instance.getDefaultSidebarView(false, file)).toBe('activity');
        });

        test('should default to details when current view is skills but new view has no skills', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();

            instance.setState({ view: 'skills' });

            SidebarUtils.shouldRenderDetailsSidebar = jest.fn().mockReturnValueOnce(true);
            SidebarUtils.shouldRenderSkillsSidebar = jest.fn().mockReturnValueOnce(false);
            SidebarUtils.shouldRenderActivitySidebar = jest.fn().mockReturnValueOnce(false);

            expect(instance.getDefaultSidebarView(false, file)).toBe('details');
        });

        test('should default to skills when current view is details but new view has no details', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();

            instance.setState({ view: 'details' });

            SidebarUtils.shouldRenderDetailsSidebar = jest.fn().mockReturnValueOnce(false);
            SidebarUtils.shouldRenderSkillsSidebar = jest.fn().mockReturnValueOnce(true);
            SidebarUtils.shouldRenderActivitySidebar = jest.fn().mockReturnValueOnce(false);

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

        it('should clear the file and fetch a new one', () => {
            wrapper.setProps({
                fileId: file.id
            });
            wrapper.setState({
                file
            });

            instance.onClassificationChange();
            expect(wrapper.state('file')).toBe(undefined);
            expect(fetchFile).toBeCalledWith(file.id, true);
        });

        it('should return undefined if there is no file id', () => {
            wrapper.setState({
                file
            });

            instance.onClassificationChange();
            expect(wrapper.state('file')).toBe(undefined);
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

        it('should call onClassificationClick with the refresh function', () => {
            instance.onClassificationClick();
            expect(onClassificationClick).toBeCalledWith(instance.onClassificationChange);
        });
    });
});
