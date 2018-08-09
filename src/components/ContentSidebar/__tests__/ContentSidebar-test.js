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
    currentUserErrorHeaderMessage,
    errorOccured,
    activityFeedItemApiError,
    fileAccessStatsPermissionsError
} = messages;

jest.mock('../SidebarUtils');
jest.mock('../Sidebar', () => 'sidebar');

const file = {
    id: 'I_AM_A_FILE'
};

const defaultResponse = {
    total_count: 0,
    entries: []
};

const activityFeedError = {
    title: errorOccured,
    content: activityFeedItemApiError
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
            instance.UNSAFE_componentWillReceiveProps(newProps);

            expect(instance.fetchData).toBeCalledWith(newProps);
        });

        test('should set new view when viewport width may have changed', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();
            const newProps = {
                isLarge: false
            };
            instance.setState({ file });

            instance.setState = jest.fn();
            instance.getDefaultSidebarView = jest.fn().mockReturnValueOnce('view');
            instance.UNSAFE_componentWillReceiveProps(newProps);

            expect(instance.getDefaultSidebarView).toBeCalledWith(file, newProps);
            expect(instance.setState).toBeCalledWith({ view: 'view' });
        });

        test('should not set new view when viewport width may have changed but was manually toggled', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();
            const newProps = {
                isLarge: false
            };
            instance.setState({ file, hasBeenToggled: true });
            instance.setState = jest.fn();
            instance.getDefaultSidebarView = jest.fn().mockReturnValueOnce('view');
            instance.UNSAFE_componentWillReceiveProps(newProps);

            expect(instance.getDefaultSidebarView).not.toBeCalled();
            expect(instance.setState).not.toBeCalled();
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
            const err = 'error';
            instance.fetchVersionsErrorCallback(err);
            const activityFeedErrorState = wrapper.state().activityFeedError.inlineError;
            expect(typeof errorOccured).toBe('object');
            expect(typeof activityFeedItemApiError).toBe('object');
            expect(activityFeedErrorState).toEqual(activityFeedError);
            expect(instance.errorCallback).toBeCalledWith(err);
        });
    });

    describe('fetchCommentsErrorCallback()', () => {
        let instance;
        let wrapper;
        beforeEach(() => {
            const props = {};
            wrapper = getWrapper(props);
            instance = wrapper.instance();
            instance.errorCallback = jest.fn();
        });
        test('should set default comment response and error', () => {
            const err = 'error';
            instance.fetchCommentsErrorCallback(err);
            const comments = wrapper.state('comments');
            expect(comments).toEqual(defaultResponse);
            const inlineErrorState = wrapper.state().activityFeedError.inlineError;
            expect(typeof errorOccured).toBe('object');
            expect(typeof activityFeedItemApiError).toBe('object');
            expect(inlineErrorState).toEqual(activityFeedError);
            expect(instance.errorCallback).toBeCalledWith(err);
        });
    });

    describe('fetchTasksErrorCallback()', () => {
        let instance;
        let wrapper;
        beforeEach(() => {
            const props = {};
            wrapper = getWrapper(props);
            instance = wrapper.instance();
            instance.errorCallback = jest.fn();
        });
        test('should set default task response and error', () => {
            const err = 'error';
            instance.fetchTasksErrorCallback(err);
            const comments = wrapper.state('tasks');
            expect(comments).toEqual(defaultResponse);
            const inlineErrorState = wrapper.state().activityFeedError.inlineError;
            expect(typeof errorOccured).toBe('object');
            expect(typeof activityFeedItemApiError).toBe('object');
            expect(inlineErrorState).toEqual(activityFeedError);
            expect(instance.errorCallback).toBeCalledWith(err);
        });
    });

    describe('fetchTaskAssignmentsErrorCallback()', () => {
        let instance;
        let wrapper;
        beforeEach(() => {
            const props = {};
            wrapper = getWrapper(props);
            instance = wrapper.instance();
            instance.errorCallback = jest.fn();
        });
        test('should set default task response and error', () => {
            const err = 'error';
            instance.fetchTasksErrorCallback(err);
            const inlineErrorState = wrapper.state().activityFeedError.inlineError;
            expect(typeof errorOccured).toBe('object');
            expect(typeof activityFeedItemApiError).toBe('object');
            expect(inlineErrorState).toEqual(activityFeedError);
            expect(instance.errorCallback).toBeCalledWith(err);
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

    describe('onToggle()', () => {
        test('should set new view state but not toggle state', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();

            wrapper.setState({ view: 'activity' });
            instance.setState = jest.fn();
            instance.onToggle('skills');

            expect(instance.setState).toBeCalledWith({ hasBeenToggled: false, view: 'skills' });
        });

        test('should set new view state and toggle state', () => {
            const wrapper = getWrapper({ isCollapsed: true });
            const instance = wrapper.instance();

            instance.setState = jest.fn();
            instance.onToggle('skills');

            expect(instance.setState).toBeCalledWith({ hasBeenToggled: true, view: 'skills' });
        });

        test('should remove view state', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();

            wrapper.setState({ view: 'activity' });
            instance.setState = jest.fn();
            instance.onToggle('activity');

            expect(instance.setState).toBeCalledWith({ hasBeenToggled: true, view: undefined });
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

    describe('appendAssignmentsToTask', () => {
        let instance;
        let wrapper;
        beforeEach(() => {
            wrapper = getWrapper();
            instance = wrapper.instance();
        });

        test('should correctly format a task with assignment with a message, increment assignment count', () => {
            const task = {
                task_assignment_collection: {
                    entries: [],
                    total_count: 0
                }
            };

            const assignments = [
                { id: '1', assigned_to: { id: '1234' }, message: 'completed', resolution_state: 'completed' }
            ];
            const expectedResult = {
                task_assignment_collection: {
                    entries: [{ ...assignments[0], type: 'task_assignment' }],
                    total_count: 1
                }
            };

            const result = instance.appendAssignmentsToTask(task, assignments);
            expect(result.task_assignment_collection.total_count).toBe(1);
            expect(result).toEqual(expectedResult);
        });

        test('should correctly format a task with assignment, increment assignment count', () => {
            const task = {
                task_assignment_collection: {
                    entries: [],
                    total_count: 0
                }
            };

            const assignments = [{ id: '1', assigned_to: { id: '1234' }, resolution_state: 'completed' }];
            const expectedResult = {
                task_assignment_collection: {
                    entries: [{ ...assignments[0], type: 'task_assignment' }],
                    total_count: 1
                }
            };

            const result = instance.appendAssignmentsToTask(task, assignments);
            expect(result.task_assignment_collection.total_count).toBe(1);
            expect(result).toEqual(expectedResult);
        });
    });

    describe('createTaskAssignmentErrorCallback', () => {
        let instance;
        let wrapper;
        beforeEach(() => {
            wrapper = getWrapper();
            instance = wrapper.instance();
        });

        test('should call error callbacks and attempt to delete bad task', () => {
            instance.deleteTask = jest.fn();
            instance.errorCallback = jest.fn();
            const localErrorCallback = jest.fn();
            const task = { id: 'foo' };
            const e = new Error();

            instance.createTaskAssignmentErrorCallback(e, task, localErrorCallback);

            expect(instance.deleteTask).toBeCalledWith(task.id);
            expect(instance.errorCallback).toBeCalled();
            expect(localErrorCallback).toBeCalled();
        });
    });

    describe('createTaskAssignment', () => {
        let instance;
        let wrapper;
        let taskAssignmentsAPI;
        const task = {
            type: 'task',
            id: '1234',
            created_at: '1',
            message: 'test',
            task_assignment_collection: []
        };
        const api = {
            getTaskAssignmentsAPI: () => taskAssignmentsAPI
        };

        beforeEach(() => {
            wrapper = getWrapper();
            instance = wrapper.instance();
            instance.api = api;
        });

        test('should resolve on a successful task assignment create', () => {
            taskAssignmentsAPI = {
                createTaskAssignment: jest.fn().mockReturnValue('foo')
            };

            const promise = instance.createTaskAssignment({ id: '1' }, task, { id: '1234' }, () => {});
            expect(taskAssignmentsAPI.createTaskAssignment).toBeCalled();

            promise.then((data) => {
                expect(data).toBe('foo');
            });
        });

        test('should call the error callback on a task assignment failure', () => {
            taskAssignmentsAPI = {
                createTaskAssignment: jest.fn().mockReturnValue(Promise.reject())
            };
            instance.createTaskAssignmentErrorCallback = jest.fn();

            const promise = instance.createTaskAssignment({ id: '1' }, task, { id: '1234' }, () => {});
            expect(taskAssignmentsAPI.createTaskAssignment).toBeCalled();

            promise.catch(() => {
                expect(instance.createTaskAssignmentErrorCallback).toBeCalled();
            });
        });
    });

    describe('createTaskSuccessCallback()', () => {
        let instance;
        let wrapper;
        let taskAssignmentsAPI;
        let assignees;
        let task;
        const api = {
            getTaskAssignmentsAPI: () => taskAssignmentsAPI
        };

        beforeEach(() => {
            wrapper = getWrapper();
            instance = wrapper.instance();
            instance.setState({ file });
            instance.api = api;
            instance.createTaskAssignment = jest.fn();
            instance.appendAssignmentsToTask = jest.fn();
            assignees = [{ id: '1', name: 'A. User' }, { id: '2', name: 'B. User' }];
            task = {
                type: 'task',
                id: '1234',
                created_at: '1',
                message: 'test',
                task_assignment_collection: []
            };

            instance.setState({
                tasks: {
                    total_count: 0,
                    entries: []
                }
            });
        });

        test('should not add to the task entries state if there is none', () => {
            instance.setState({ tasks: undefined });
            instance.setState = jest.fn();

            instance.createTaskSuccessCallback();

            expect(instance.createTaskAssignment).not.toBeCalled();
        });

        test('should create a TaskAssignment for each assignment', () => {
            instance.createTaskAssignment.mockReturnValue(Promise.resolve());
            instance.createTaskSuccessCallback(task, assignees, () => {}, () => {});
            expect(instance.createTaskAssignment).toBeCalledTimes(2);
        });

        test('should call the success callback and update the state once all assignments have been created', () => {
            instance.appendAssignmentsToTask = jest.fn();
            instance.setState = jest.fn();
            instance.createTaskAssignment.mockReturnValue(Promise.resolve());
            const successCallback = jest.fn();

            return instance.createTaskSuccessCallback(task, assignees, successCallback, () => {}).then(() => {
                expect(instance.appendAssignmentsToTask).toBeCalled();
                expect(instance.setState).toBeCalled();
                expect(successCallback).toBeCalled();
            });
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

        test('should invoke errorCallback() if the API failed to create a task', (done) => {
            instance.errorCallback = jest.fn();
            const testErrorCallback = jest.fn();
            tasksAPI = {
                createTask: ({ errorCallback }) => {
                    errorCallback();
                    expect(instance.errorCallback).toBeCalled();
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
        test('should return undefined when no file', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();
            expect(instance.getDefaultSidebarView(null, {})).toBeUndefined();
        });

        test('should return default view when provided', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();
            expect(instance.getDefaultSidebarView({}, { defaultView: 'default' })).toBe('default');
        });

        test('should return undefined when small viewport and not toggled manually', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();
            SidebarUtils.canHaveDetailsSidebar = jest.fn().mockReturnValueOnce(true);
            expect(instance.getDefaultSidebarView({}, { isLarge: false })).toBeUndefined();
        });

        test('should return some view when large viewport and not toggled manually', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();
            SidebarUtils.canHaveDetailsSidebar = jest.fn().mockReturnValueOnce(true);
            expect(instance.getDefaultSidebarView({}, { isLarge: true })).toBe('details');
        });

        test('should return skills when no current view is skills and skills exist', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();

            instance.setState({ view: 'skills' });

            SidebarUtils.canHaveDetailsSidebar = jest.fn().mockReturnValueOnce(true);
            SidebarUtils.shouldRenderSkillsSidebar = jest.fn().mockReturnValueOnce(true);
            SidebarUtils.canHaveActivitySidebar = jest.fn().mockReturnValueOnce(true);
            SidebarUtils.canHaveMetadataSidebar = jest.fn().mockReturnValueOnce(true);

            expect(instance.getDefaultSidebarView(file, { isLarge: true })).toBe('skills');
        });

        test('should return activity when current view is activity and skills exist', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();

            instance.setState({ view: 'activity' });

            SidebarUtils.canHaveDetailsSidebar = jest.fn().mockReturnValueOnce(true);
            SidebarUtils.shouldRenderSkillsSidebar = jest.fn().mockReturnValueOnce(true);
            SidebarUtils.canHaveActivitySidebar = jest.fn().mockReturnValueOnce(true);
            SidebarUtils.canHaveMetadataSidebar = jest.fn().mockReturnValueOnce(true);

            expect(instance.getDefaultSidebarView(file, { isLarge: true })).toBe('activity');
        });

        test('should return details when current view is details and skills or activity both exist', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();

            instance.setState({ view: 'details' });

            SidebarUtils.canHaveDetailsSidebar = jest.fn().mockReturnValueOnce(true);
            SidebarUtils.shouldRenderSkillsSidebar = jest.fn().mockReturnValueOnce(true);
            SidebarUtils.canHaveActivitySidebar = jest.fn().mockReturnValueOnce(true);
            SidebarUtils.canHaveMetadataSidebar = jest.fn().mockReturnValueOnce(true);

            expect(instance.getDefaultSidebarView(file, { isLarge: true })).toBe('details');
        });

        test('should return metadata when current view is metadata and skills or activity both exist', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();

            instance.setState({ view: 'metadata' });

            SidebarUtils.canHaveDetailsSidebar = jest.fn().mockReturnValueOnce(true);
            SidebarUtils.shouldRenderSkillsSidebar = jest.fn().mockReturnValueOnce(true);
            SidebarUtils.canHaveActivitySidebar = jest.fn().mockReturnValueOnce(true);
            SidebarUtils.canHaveMetadataSidebar = jest.fn().mockReturnValueOnce(true);

            expect(instance.getDefaultSidebarView(file, { isLarge: true })).toBe('metadata');
        });

        test('should default to skills when no current view and skills exist', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();

            SidebarUtils.canHaveDetailsSidebar = jest.fn().mockReturnValueOnce(true);
            SidebarUtils.shouldRenderSkillsSidebar = jest.fn().mockReturnValueOnce(true);
            SidebarUtils.canHaveActivitySidebar = jest.fn().mockReturnValueOnce(true);
            SidebarUtils.canHaveMetadataSidebar = jest.fn().mockReturnValueOnce(true);

            expect(instance.getDefaultSidebarView(file, { isLarge: true })).toBe('skills');
        });

        test('should default to activity when no current view and skills dont exist', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();

            SidebarUtils.canHaveDetailsSidebar = jest.fn().mockReturnValueOnce(true);
            SidebarUtils.shouldRenderSkillsSidebar = jest.fn().mockReturnValueOnce(false);
            SidebarUtils.canHaveActivitySidebar = jest.fn().mockReturnValueOnce(true);
            SidebarUtils.canHaveMetadataSidebar = jest.fn().mockReturnValueOnce(true);

            expect(instance.getDefaultSidebarView(file, { isLarge: true })).toBe('activity');
        });

        test('should default to details when no current view and skills or activity dont exist', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();

            SidebarUtils.canHaveDetailsSidebar = jest.fn().mockReturnValueOnce(true);
            SidebarUtils.shouldRenderSkillsSidebar = jest.fn().mockReturnValueOnce(false);
            SidebarUtils.canHaveActivitySidebar = jest.fn().mockReturnValueOnce(false);
            SidebarUtils.canHaveMetadataSidebar = jest.fn().mockReturnValueOnce(true);

            expect(instance.getDefaultSidebarView(file, { isLarge: true })).toBe('details');
        });

        test('should default to metadata when no current view and skills or activity or details dont exist', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();

            SidebarUtils.canHaveDetailsSidebar = jest.fn().mockReturnValueOnce(false);
            SidebarUtils.shouldRenderSkillsSidebar = jest.fn().mockReturnValueOnce(false);
            SidebarUtils.canHaveActivitySidebar = jest.fn().mockReturnValueOnce(false);
            SidebarUtils.canHaveMetadataSidebar = jest.fn().mockReturnValueOnce(true);

            expect(instance.getDefaultSidebarView(file, { isLarge: true })).toBe('metadata');
        });

        test('should default to activity when current view is skills but new view has no skills', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();

            instance.setState({ view: 'skills' });

            SidebarUtils.canHaveDetailsSidebar = jest.fn().mockReturnValueOnce(true);
            SidebarUtils.shouldRenderSkillsSidebar = jest.fn().mockReturnValueOnce(false);
            SidebarUtils.canHaveActivitySidebar = jest.fn().mockReturnValueOnce(true);
            SidebarUtils.canHaveMetadataSidebar = jest.fn().mockReturnValueOnce(true);

            expect(instance.getDefaultSidebarView(file, { isLarge: true })).toBe('activity');
        });

        test('should default to details when current view is skills but new view has no skills or activity', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();

            instance.setState({ view: 'skills' });

            SidebarUtils.canHaveDetailsSidebar = jest.fn().mockReturnValueOnce(true);
            SidebarUtils.shouldRenderSkillsSidebar = jest.fn().mockReturnValueOnce(false);
            SidebarUtils.canHaveActivitySidebar = jest.fn().mockReturnValueOnce(false);
            SidebarUtils.canHaveMetadataSidebar = jest.fn().mockReturnValueOnce(true);

            expect(instance.getDefaultSidebarView(file, { isLarge: true })).toBe('details');
        });

        test('should default to skills when current view is details but new view has no details', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();

            instance.setState({ view: 'details' });

            SidebarUtils.canHaveDetailsSidebar = jest.fn().mockReturnValueOnce(false);
            SidebarUtils.shouldRenderSkillsSidebar = jest.fn().mockReturnValueOnce(true);
            SidebarUtils.canHaveActivitySidebar = jest.fn().mockReturnValueOnce(true);
            SidebarUtils.canHaveMetadataSidebar = jest.fn().mockReturnValueOnce(true);

            expect(instance.getDefaultSidebarView(file, { isLarge: true })).toBe('skills');
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

            expect(getDefaultSidebarView).toBeCalledWith(file, instance.props);
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

    describe('getActivityFeedError()', () => {
        let wrapper;
        let instance;
        beforeEach(() => {
            wrapper = getWrapper({
                file
            });
            instance = wrapper.instance();
        });

        test('should not return an error if forbidden', () => {
            const error = instance.getActivityFeedError({
                status: 403
            });
            expect(error).toBeUndefined();
        });

        test('should return an inlineError object if not forbidden', () => {
            const error = instance.getActivityFeedError({
                status: 500
            });
            expect(typeof error.inlineError).toBe('object');
        });
    });
});
