import React from 'react';
import { shallow } from 'enzyme';
import messages from '../../common/messages';
import { ActivitySidebarComponent, activityFeedInlineError } from '../ActivitySidebar';

const { defaultErrorMaskSubHeaderMessage, currentUserErrorHeaderMessage } = messages;

describe('elements/content-sidebar/ActivitySidebar', () => {
    const feedAPI = {
        feedItems: jest.fn(),
        deleteComment: jest.fn(),
        deleteTaskNew: jest.fn(),
        createTaskNew: jest.fn(),
        updateTaskNew: jest.fn(),
        updateTaskCollaborator: jest.fn(),
        createComment: jest.fn(),
    };
    const usersAPI = {
        get: jest.fn(),
        getAvatarUrlWithAccessToken: jest.fn().mockResolvedValue('foo'),
        getUser: jest.fn(),
    };
    const fileCollaboratorsAPI = {
        getFileCollaborators: jest.fn(),
    };
    const api = {
        getUsersAPI: () => usersAPI,
        getFeedAPI: () => feedAPI,
        getFileCollaboratorsAPI: () => fileCollaboratorsAPI,
    };
    const file = {
        id: 'I_AM_A_FILE',
    };
    let currentUser = {
        id: 'foo',
    };
    const collaborators = {
        entries: [
            {
                id: '1',
                name: 'foo',
                item: {},
            },
        ],
    };
    let onError = jest.fn();
    const getWrapper = (props = {}) =>
        shallow(
            <ActivitySidebarComponent
                api={api}
                file={file}
                logger={{ onReadyMetric: jest.fn() }}
                onError={onError}
                {...props}
            />,
        );

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

    describe('componentDidMount()', () => {
        let wrapper;
        let instance;
        currentUser = {
            id: '123',
        };
        beforeEach(() => {
            jest.spyOn(ActivitySidebarComponent.prototype, 'fetchFeedItems');
            jest.spyOn(ActivitySidebarComponent.prototype, 'fetchCurrentUser');
            wrapper = getWrapper({
                currentUser,
            });
            instance = wrapper.instance();
        });

        afterEach(() => {
            jest.restoreAllMocks();
        });

        test('should fetch the file and refresh the cache and fetch the current user', () => {
            expect(instance.fetchFeedItems).toHaveBeenCalledWith(true);
            expect(instance.fetchCurrentUser).toHaveBeenCalledWith(currentUser);
        });
    });

    describe('render()', () => {
        test('should render the activity feed sidebar', () => {
            const wrapper = getWrapper();
            expect(wrapper).toMatchSnapshot();
        });
    });

    describe('createTask()', () => {
        let instance;
        let wrapper;

        beforeEach(() => {
            wrapper = getWrapper();
            instance = wrapper.instance();
        });

        test('should throw an error if there is not the current user in the state', () => {
            expect(() => instance.createTask()).toThrow('Bad box user!');
        });

        test('should create the task and fetch the feed items', () => {
            wrapper.setState({
                currentUser,
            });
            const message = 'message';
            const assignees = ['1', '2'];
            const dueAt = 'test';
            const taskType = 'GENERAL';
            const completionRule = 'ALL_ASSIGNEES';
            instance.fetchFeedItems = jest.fn();
            instance.createTask(message, assignees, taskType, dueAt, completionRule);
            expect(feedAPI.createTaskNew).toHaveBeenCalledWith(
                file,
                currentUser,
                message,
                assignees,
                taskType,
                dueAt,
                completionRule,
                expect.any(Function),
                expect.any(Function),
            );
            expect(instance.fetchFeedItems).toHaveBeenCalled();
        });
    });

    describe('deleteTask()', () => {
        test('should call the deleteTask prop if it exists', () => {
            const id = '1;';
            const onTaskDelete = jest.fn();
            const wrapper = getWrapper({ onTaskDelete });
            const instance = wrapper.instance();
            instance.fetchFeedItems = jest.fn();

            instance.deleteTask({ id });
            expect(feedAPI.deleteTaskNew).toHaveBeenCalled();
            expect(instance.fetchFeedItems).toHaveBeenCalled();
        });
    });

    describe('deleteComment()', () => {
        let wrapper;
        let instance;
        beforeEach(() => {
            const onCommentDelete = jest.fn();
            wrapper = getWrapper({ onCommentDelete });
            instance = wrapper.instance();
            instance.fetchFeedItems = jest.fn();
        });

        test('should call the deleteComment prop if it exists', () => {
            const id = '1';
            const permissions = {
                can_edit: false,
                can_delete: true,
            };
            instance.deleteComment({ id, permissions });
            expect(feedAPI.deleteComment).toHaveBeenCalled();
            expect(instance.fetchFeedItems).toHaveBeenCalled();
        });
    });

    describe('fetchCurrentUser()', () => {
        let instance;
        let wrapper;
        beforeEach(() => {
            wrapper = getWrapper();
            instance = wrapper.instance();
            instance.errorCallback = jest.fn();
        });
        test('should invoke setState() directly if user parameter is not missing', () => {
            instance.setState = jest.fn();
            instance.fetchCurrentUser(currentUser);
            expect(instance.setState).toBeCalledWith({
                currentUser,
                currentUserError: undefined,
            });
        });

        test('should get the user', () => {
            instance.fetchCurrentUser();
            expect(usersAPI.getUser).toBeCalled();
        });
    });

    describe('fetchCurrentUserErrorCallback()', () => {
        let instance;
        let wrapper;

        beforeEach(() => {
            wrapper = getWrapper();
            instance = wrapper.instance();
            instance.errorCallback = jest.fn();
            instance.fetchFeedItems = jest.fn();
            instance.fetchCurrentUser = jest.fn();
        });

        test('should set a maskError if there is an error in fetching the current user', () => {
            instance.fetchCurrentUserErrorCallback();
            const inlineErrorState = wrapper.state().currentUserError.maskError;
            expect(typeof currentUserErrorHeaderMessage).toBe('object');
            expect(typeof defaultErrorMaskSubHeaderMessage).toBe('object');
            expect(inlineErrorState.errorHeader).toEqual(currentUserErrorHeaderMessage);
            expect(inlineErrorState.errorSubHeader).toEqual(defaultErrorMaskSubHeaderMessage);
        });
    });

    describe('feedSuccessCallback()', () => {
        let instance;
        let wrapper;

        beforeEach(() => {
            wrapper = getWrapper();
            instance = wrapper.instance();
            instance.fetchFeedItems = jest.fn();
        });

        test('should fetch the feed items', () => {
            instance.feedSuccessCallback();
            expect(instance.fetchFeedItems).toBeCalled();
        });
    });

    describe('feedErrorCallback()', () => {
        let instance;
        let wrapper;

        beforeEach(() => {
            wrapper = getWrapper();
            instance = wrapper.instance();
            instance.fetchFeedItems = jest.fn();
            instance.errorCallback = jest.fn();
        });

        test('should invoke the generic error callback and fetch the items', () => {
            instance.feedErrorCallback();
            expect(instance.errorCallback).toBeCalled();
            expect(instance.fetchFeedItems).toBeCalled();
        });
    });

    describe('updateTask()', () => {
        let instance;
        let wrapper;
        const taskObj = {
            text: 'foo',
            id: 'bar',
        };

        beforeEach(() => {
            wrapper = getWrapper();
            instance = wrapper.instance();
            instance.fetchFeedItems = jest.fn();
        });

        test('should call the update task API and fetch the items', () => {
            instance.updateTask(taskObj);
            expect(feedAPI.updateTaskNew).toBeCalled();
            expect(instance.fetchFeedItems).toBeCalled();
        });
    });

    describe('updateTaskAssignment()', () => {
        let instance;
        let wrapper;

        beforeEach(() => {
            wrapper = getWrapper();
            instance = wrapper.instance();
            instance.fetchFeedItems = jest.fn();
        });

        test('should call the update task assignment API and fetch the items', () => {
            instance.updateTaskAssignment('1', '2', 'foo', 'bar');
            expect(feedAPI.updateTaskCollaborator).toBeCalled();
            expect(instance.fetchFeedItems).toBeCalled();
        });
    });

    describe('createComment()', () => {
        let instance;
        let wrapper;
        const message = 'foo';

        beforeEach(() => {
            wrapper = getWrapper();
            instance = wrapper.instance();
            instance.fetchFeedItems = jest.fn();
        });

        test('should throw an error if missing current user', () => {
            expect(() => instance.createComment(message, true)).toThrow('Bad box user!');
        });

        test('should call the create comment API and fetch the items', () => {
            instance.setState({
                currentUser,
            });
            instance.createComment(message, true);
            expect(feedAPI.createComment).toBeCalled();
            expect(instance.fetchFeedItems).toBeCalled();
        });
    });

    describe('fetchFeedItems()', () => {
        let instance;
        let wrapper;

        beforeEach(() => {
            wrapper = getWrapper();
            instance = wrapper.instance();
            instance.fetchFeedItems = jest.fn();
        });

        test('should fetch the feed items', () => {
            instance.fetchFeedItems();
            expect(feedAPI.feedItems).toBeCalled();
        });
    });

    describe('fetchFeedItemsSuccessCallback()', () => {
        let instance;
        let wrapper;
        const feedItems = 'foo';

        beforeEach(() => {
            wrapper = getWrapper();
            instance = wrapper.instance();
            instance.setState = jest.fn();
        });

        test('should set the feedItems in the state', () => {
            instance.fetchFeedItemsSuccessCallback(feedItems);
            expect(instance.setState).toBeCalledWith({
                feedItems,
                activityFeedError: undefined,
            });
        });
    });

    describe('fetchFeedItemsErrorCallback()', () => {
        let instance;
        let wrapper;
        const feedItems = 'foo';

        beforeEach(() => {
            wrapper = getWrapper();
            instance = wrapper.instance();
            instance.setState = jest.fn();
        });

        test('should set the feedItems in the state', () => {
            instance.fetchFeedItemsErrorCallback(feedItems);
            expect(instance.setState).toBeCalledWith({
                feedItems,
                activityFeedError: activityFeedInlineError,
            });
        });
    });

    describe('errorCallback()', () => {
        let instance;
        let wrapper;
        let error;
        const code = 'some_code';
        const contextInfo = {
            foo: 'bar',
        };

        beforeEach(() => {
            error = new Error('foo');
            onError = jest.fn();
            wrapper = getWrapper({
                onError,
            });
            instance = wrapper.instance();
            jest.spyOn(global.console, 'error').mockImplementation();
        });

        afterEach(() => {
            jest.restoreAllMocks();
        });

        test('should log the error', () => {
            instance.errorCallback(error, code, contextInfo);
            expect(onError).toHaveBeenCalledWith(error, code, contextInfo);
        });
    });

    describe('fetchCurrentUserSuccessCallback()', () => {
        let instance;
        let wrapper;

        beforeEach(() => {
            wrapper = getWrapper();
            instance = wrapper.instance();
            instance.setState = jest.fn();
        });

        test('should set the feedItems in the state', () => {
            instance.fetchCurrentUserSuccessCallback(currentUser);
            expect(instance.setState).toBeCalledWith({
                currentUser,
                currentUserError: undefined,
            });
        });
    });

    describe('fetchCurrentUserSuccessCallback()', () => {
        let instance;
        let wrapper;

        beforeEach(() => {
            wrapper = getWrapper();
            instance = wrapper.instance();
            instance.setState = jest.fn();
        });

        test('should set the feedItems in the state', () => {
            instance.fetchCurrentUserSuccessCallback(currentUser);
            expect(instance.setState).toBeCalledWith({
                currentUser,
                currentUserError: undefined,
            });
        });
    });

    describe('getApproverContactsSuccessCallback()', () => {
        let instance;
        let wrapper;

        beforeEach(() => {
            wrapper = getWrapper();
            instance = wrapper.instance();
            instance.setState = jest.fn();
        });

        test('should set the feedItems in the state', () => {
            instance.getApproverContactsSuccessCallback(collaborators);
            expect(instance.setState).toBeCalledWith({
                approverSelectorContacts: collaborators.entries,
            });
        });
    });

    describe('getMentionContactsSuccessCallback()', () => {
        let instance;
        let wrapper;

        beforeEach(() => {
            wrapper = getWrapper();
            instance = wrapper.instance();
            instance.setState = jest.fn();
        });

        test('should set the feedItems in the state', () => {
            instance.getMentionContactsSuccessCallback(collaborators);
            expect(instance.setState).toBeCalledWith({
                mentionSelectorContacts: collaborators.entries,
            });
        });
    });

    describe('fetchCurrentUserErrorCallback()', () => {
        let wrapper;
        let instance;

        beforeEach(() => {
            wrapper = getWrapper({
                file,
            });
            instance = wrapper.instance();
            instance.setState = jest.fn();
            instance.errorCallback = jest.fn();
        });

        test('should set the current user error and call the error callback', () => {
            instance.fetchCurrentUserErrorCallback({ status: 500 });
            expect(instance.setState).toBeCalledWith({
                currentUser: undefined,
                currentUserError: expect.any(Object),
            });
            expect(instance.errorCallback).toBeCalled();
        });
    });

    describe('getAvatarUrl()', () => {
        let wrapper;
        let instance;

        beforeEach(() => {
            wrapper = getWrapper({
                file,
            });
            instance = wrapper.instance();
        });

        test('should set the current user error and call the error callback', () => {
            const avatarUrl = instance.getAvatarUrl(currentUser.id);
            expect(avatarUrl instanceof Promise).toBe(true);
            expect(usersAPI.getAvatarUrlWithAccessToken).toBeCalledWith(currentUser.id, file.id);
        });
    });

    describe('getCollaborators()', () => {
        let wrapper;
        let instance;
        let successCb;
        let errorCb;

        beforeEach(() => {
            successCb = jest.fn();
            errorCb = jest.fn();
            wrapper = getWrapper({
                file,
            });
            instance = wrapper.instance();
        });

        test('should short circuit if there is no search string', () => {
            instance.getCollaborators(successCb, errorCb);
            instance.getCollaborators(successCb, errorCb, '');
            instance.getCollaborators(successCb, errorCb, '  ');
            expect(fileCollaboratorsAPI.getFileCollaborators).not.toHaveBeenCalled();
        });

        test('should get the collaborators', () => {
            const searchStr = 'foo';
            instance.getCollaborators(successCb, errorCb, searchStr);
            expect(fileCollaboratorsAPI.getFileCollaborators).toHaveBeenCalledWith(file.id, successCb, errorCb, {
                filter_term: searchStr,
            });
        });
    });

    describe('refresh()', () => {
        let instance;
        let wrapper;

        beforeEach(() => {
            wrapper = getWrapper();
            instance = wrapper.instance();
        });

        test('should fetch the feed items when refresh is called', () => {
            const fetchFeedItems = jest.fn();
            instance.fetchFeedItems = fetchFeedItems;

            instance.refresh();

            expect(fetchFeedItems).toHaveBeenCalled();
            expect(fetchFeedItems).toHaveBeenCalledWith(true);
        });
    });
});
