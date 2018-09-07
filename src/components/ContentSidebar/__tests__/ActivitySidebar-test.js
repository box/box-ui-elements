import React from 'react';
import { shallow } from 'enzyme';
import {
    ActivitySidebarComponent,
    activityFeedInlineError,
} from '../ActivitySidebar';
import messages from '../../messages';

const {
    defaultErrorMaskSubHeaderMessage,
    currentUserErrorHeaderMessage,
} = messages;

describe('components/ContentSidebar/ActivitySidebar', () => {
    const feedAPI = {
        feedItems: jest.fn(),
        deleteComment: jest.fn(),
        deleteTask: jest.fn(),
        createTask: jest.fn(),
        updateTask: jest.fn(),
        updateTaskAssignment: jest.fn(),
        createComment: jest.fn(),
    };
    const usersAPI = {
        get: jest.fn(),
        getAvatarUrlWithAccessToken: jest.fn().mockResolvedValue('foo'),
    };
    const api = {
        getUsersAPI: () => usersAPI,
        getFeedAPI: () => feedAPI,
    };
    const file = {
        id: 'I_AM_A_FILE',
    };
    const currentUser = {
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
    const getWrapper = (props = {}) =>
        shallow(<ActivitySidebarComponent api={api} file={file} {...props} />);

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
            instance.fetchFeedItems = jest.fn();
            instance.createTask(message, assignees, dueAt);
            expect(feedAPI.createTask).toHaveBeenCalledWith(
                file,
                currentUser,
                message,
                assignees,
                dueAt,
                instance.feedSuccessCallback,
                instance.feedErrorCallback,
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
            expect(feedAPI.deleteTask).toHaveBeenCalled();
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
            expect(usersAPI.get).toBeCalled();
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
            expect(inlineErrorState.errorHeader).toEqual(
                currentUserErrorHeaderMessage,
            );
            expect(inlineErrorState.errorSubHeader).toEqual(
                defaultErrorMaskSubHeaderMessage,
            );
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
            expect(feedAPI.updateTask).toBeCalled();
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
            expect(feedAPI.updateTaskAssignment).toBeCalled();
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
            expect(() => instance.createComment(message, true)).toThrow(
                'Bad box user!',
            );
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
        const message = 'foo';
        let instance;
        let wrapper;

        beforeEach(() => {
            wrapper = getWrapper();
            instance = wrapper.instance();
            global.console.error = jest.fn();
        });

        afterEach(() => {
            global.console.error.mockRestore();
        });

        test('should log the error', () => {
            instance.errorCallback(message);
            expect(global.console.error).toBeCalledWith(message);
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
            expect(usersAPI.getAvatarUrlWithAccessToken).toBeCalledWith(
                currentUser.id,
                file.id,
            );
        });
    });
});
