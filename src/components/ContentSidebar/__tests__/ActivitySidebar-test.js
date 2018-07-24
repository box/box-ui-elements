import React from 'react';
import { shallow } from 'enzyme';
import { ActivitySidebarComponent } from '../ActivitySidebar';
import messages from '../../messages';

const { defaultErrorMaskSubHeaderMessage, currentUserErrorHeaderMessage } = messages;

describe('components/ContentSidebar/ActivitySidebar', () => {
    const feedAPI = {
        feedItems: jest.fn(),
        deleteComment: jest.fn(),
        deleteTask: jest.fn(),
        createTask: jest.fn()
    };
    const api = {
        getUsersAPI: () => ({
            get: jest.fn()
        }),
        getFeedAPI: () => feedAPI
    };
    const file = {
        id: 'I_AM_A_FILE'
    };
    const currentUser = {
        id: 'foo'
    };
    const getWrapper = (props = {}) => shallow(<ActivitySidebarComponent api={api} file={file} {...props} />);

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
                currentUser
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
                instance.feedErrorCallback
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
                can_delete: true
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
            expect(instance.setState).toBeCalledWith({ currentUser, currentUserError: undefined });
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
});
