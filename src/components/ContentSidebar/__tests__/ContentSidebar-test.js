import React from 'react';
import { mount } from 'enzyme';
import ContentSidebar from '../ContentSidebar';
import messages from '../../messages';

const {
    fileDescriptionInlineErrorTitleMessage,
    defaultInlineErrorContentMessage,
    versionHistoryErrorHeaderMessage,
    defaultErrorMaskSubHeaderMessage,
    fileAccessStatsErrorHeaderMessage,
    currentUserErrorHeaderMessage
} = messages;

jest.mock('../Sidebar', () => 'sidebar');

describe('components/ContentSidebar/ContentSidebar', () => {
    let rootElement;
    const getWrapper = (props) => mount(<ContentSidebar {...props} />, { attachTo: rootElement });

    beforeEach(() => {
        rootElement = document.createElement('div');
        document.body.appendChild(rootElement);
    });

    afterEach(() => {
        document.body.removeChild(rootElement);
    });

    describe('componentWillReceiveProps()', () => {
        test('should reset state to initialState if the fileid has changed', () => {
            const props = {
                fileId: '123456'
            };
            const wrapper = getWrapper(props);
            const instance = wrapper.instance();
            const newProps = {
                fileId: 'abcdefg'
            };
            instance.setState = jest.fn();
            instance.componentWillReceiveProps(newProps);

            expect(instance.setState).toBeCalledWith(instance.initialState);
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

    describe('onCommentCreateSuccess()', () => {
        let instance;
        let wrapper;
        beforeEach(() => {
            wrapper = getWrapper();
            instance = wrapper.instance();
        });

        test('should not add to the comment entries state if there is none', () => {
            instance.setState({ comments: undefined });
            instance.setState = jest.fn();

            instance.onCommentCreateSuccess({});

            expect(instance.setState).not.toBeCalled();
        });

        test('should add the comment to the comment entries state', () => {
            instance.setState({
                comments: {
                    total_count: 0,
                    entries: []
                }
            });

            instance.onCommentCreateSuccess({
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

            instance.onCommentCreateSuccess({
                type: 'comment'
            });

            const { comments } = instance.state;
            expect(comments.total_count).toBe(1);
        });
    });

    describe('onCommentCreate()', () => {
        let instance;
        let wrapper;
        let commentsAPI;
        const file = {
            id: 'I_AM_A_FILE'
        };
        const api = {
            getCommentsAPI: () => commentsAPI
        };

        beforeEach(() => {
            wrapper = getWrapper();
            instance = wrapper.instance();
            instance.api = api;
        });

        test('should throw an error if there is no file in the state', () => {
            expect(instance.onCommentCreate).toThrow('Bad box item!');
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

            instance.onCommentCreate(text, false);
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

            instance.onCommentCreate(text, true);
        });

        test('should invoke onCommentCreateSuccess() with a new comment if api was successful', (done) => {
            instance.onCommentCreateSuccess = jest.fn();
            commentsAPI = {
                createComment: ({ successCallback }) => {
                    successCallback();
                    expect(instance.onCommentCreateSuccess).toBeCalled();
                    done();
                }
            };
            instance.setState({ file });

            instance.onCommentCreate('text');
        });

        test('should return a promise', () => {
            instance.setState({ file });
            const retValue = instance.onCommentCreate('text');
            expect(retValue).toBeInstanceOf(Promise);
        });
    });
});
