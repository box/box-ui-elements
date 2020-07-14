import React from 'react';
import { shallow } from 'enzyme';
import messages from '../../common/messages';
import { ActivitySidebarComponent, activityFeedInlineError } from '../ActivitySidebar';

const { defaultErrorMaskSubHeaderMessage, currentUserErrorHeaderMessage } = messages;

jest.mock('lodash/debounce', () => jest.fn(i => i));

describe('elements/content-sidebar/ActivitySidebar', () => {
    const feedAPI = {
        feedItems: jest.fn(),
        deleteAnnotation: jest.fn(),
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
        file_version: {
            id: '123',
        },
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

        test.each`
            annotationsEnabled | appActivityEnabled | expectedAnnotations | expectedAppActivity
            ${false}           | ${false}           | ${false}            | ${false}
            ${false}           | ${true}            | ${false}            | ${true}
            ${true}            | ${false}           | ${true}             | ${false}
            ${true}            | ${true}            | ${true}             | ${true}
        `(
            'should fetch the feed items based on features: annotationsEnabled=$annotationsEnabled and appActivityEnabled=$appActivityEnabled',
            ({ annotationsEnabled, appActivityEnabled, expectedAnnotations, expectedAppActivity }) => {
                wrapper = getWrapper({
                    features: {
                        activityFeed: {
                            annotations: { enabled: annotationsEnabled },
                            appActivity: { enabled: appActivityEnabled },
                        },
                    },
                });

                instance = wrapper.instance();
                instance.errorCallback = jest.fn();
                instance.fetchFeedItemsErrorCallback = jest.fn();
                instance.fetchFeedItemsSuccessCallback = jest.fn();

                instance.fetchFeedItems();
                expect(feedAPI.feedItems).toHaveBeenCalledWith(
                    file,
                    false,
                    instance.fetchFeedItemsSuccessCallback,
                    instance.fetchFeedItemsErrorCallback,
                    instance.errorCallback,
                    { shouldShowAnnotations: expectedAnnotations, shouldShowAppActivity: expectedAppActivity },
                );
            },
        );
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
            expect(onError).not.toHaveBeenCalled();
        });

        test('should call onError if errors is not empty', () => {
            instance.fetchFeedItemsErrorCallback(feedItems, []);

            expect(onError).not.toHaveBeenCalled();

            instance.fetchFeedItemsErrorCallback(feedItems, [{ code: '0' }, { code: '1' }]);

            expect(onError).toHaveBeenCalledWith(expect.any(Error), 'fetch_activity_error', {
                showNotification: true,
                errors: ['0', '1'],
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

    describe('getApproverWithQuery()', () => {
        let instance;
        let wrapper;
        let getCollaboratorsSpy;

        test('should get collaborators with groups', () => {
            wrapper = getWrapper();
            instance = wrapper.instance();
            getCollaboratorsSpy = jest.spyOn(instance, 'getCollaborators');

            const search = 'Santa Claus';
            instance.getApproverWithQuery(search);

            expect(getCollaboratorsSpy).toBeCalledWith(
                instance.getApproverContactsSuccessCallback,
                instance.errorCallback,
                search,
                { includeGroups: true },
            );
            expect(fileCollaboratorsAPI.getFileCollaborators).toHaveBeenCalledWith(
                file.id,
                instance.getApproverContactsSuccessCallback,
                instance.errorCallback,
                {
                    filter_term: search,
                    include_groups: true,
                    include_uploader_collabs: false,
                },
            );
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

    describe('getMentionWithQuery()', () => {
        let instance;
        let wrapper;
        let getCollaboratorsSpy;

        beforeEach(() => {
            wrapper = getWrapper();
            instance = wrapper.instance();
            getCollaboratorsSpy = jest.spyOn(instance, 'getCollaborators');
        });

        test('should get collaborators without groups', () => {
            const search = 'Santa Claus';
            instance.getMentionWithQuery(search);
            expect(getCollaboratorsSpy).toBeCalledWith(
                instance.getMentionContactsSuccessCallback,
                instance.errorCallback,
                search,
            );
            expect(fileCollaboratorsAPI.getFileCollaborators).toHaveBeenCalledWith(
                file.id,
                instance.getMentionContactsSuccessCallback,
                instance.errorCallback,
                {
                    filter_term: search,
                    include_groups: false,
                    include_uploader_collabs: false,
                },
            );
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

        test('should call the file collaborators api', () => {
            const searchStr = 'foo';
            instance.getCollaborators(successCb, errorCb, searchStr);
            expect(fileCollaboratorsAPI.getFileCollaborators).toHaveBeenCalledWith(file.id, successCb, errorCb, {
                filter_term: searchStr,
                include_groups: false,
                include_uploader_collabs: false,
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

    describe('handleAnnotationSelect()', () => {
        const annotatorState = { activeAnnotationId: '123' };
        const emitAnnotatorActiveChangeEvent = jest.fn();
        const getAnnotationsMatchPath = jest.fn().mockReturnValue({ params: { fileVersionId: '456' } });
        const getAnnotationsPath = jest.fn().mockReturnValue('/activity/annotations/235/124');
        const history = {
            push: jest.fn(),
            replace: jest.fn(),
        };
        const onAnnotationSelect = jest.fn();

        const getAnnotationWrapper = () =>
            getWrapper({
                annotatorState,
                emitAnnotatorActiveChangeEvent,
                file,
                getAnnotationsMatchPath,
                getAnnotationsPath,
                history,
                onAnnotationSelect,
            });

        test('should call emitAnnotatorActiveChangeEvent and onAnnotatorSelect appropriately', () => {
            const wrapper = getAnnotationWrapper();
            const instance = wrapper.instance();
            const annotation = { file_version: { id: '235' }, id: '124' };

            instance.handleAnnotationSelect(annotation);

            expect(emitAnnotatorActiveChangeEvent).toHaveBeenCalledWith('124');
            expect(history.push).toHaveBeenCalledWith('/activity/annotations/235/124');
            expect(onAnnotationSelect).toHaveBeenCalledWith(annotation);
        });

        test('should not call history.push if file versions are the same', () => {
            const wrapper = getAnnotationWrapper();
            const instance = wrapper.instance();
            const annotation = { file_version: { id: '456' }, id: '124' };

            instance.handleAnnotationSelect(annotation);

            expect(emitAnnotatorActiveChangeEvent).toHaveBeenCalledWith('124');
            expect(history.push).not.toHaveBeenCalled();
            expect(onAnnotationSelect).toHaveBeenCalledWith(annotation);
        });

        test('should use current file version if match params returns null', () => {
            const wrapper = getAnnotationWrapper();
            const instance = wrapper.instance();
            const annotation = { file_version: { id: '235' }, id: '124' };
            getAnnotationsMatchPath.mockReturnValue({ params: { fileVersionId: undefined } });

            instance.handleAnnotationSelect(annotation);

            expect(emitAnnotatorActiveChangeEvent).toHaveBeenCalledWith('124');
            expect(history.push).toHaveBeenCalledWith('/activity/annotations/235/124');
            expect(onAnnotationSelect).toHaveBeenCalledWith(annotation);
        });

        test('should not call history.push if no file version id on the annotation', () => {
            const wrapper = getAnnotationWrapper();
            const instance = wrapper.instance();
            const annotation = { file_version: null, id: '124' };
            getAnnotationsMatchPath.mockReturnValue({ params: { fileVersionId: undefined } });

            instance.handleAnnotationSelect(annotation);

            expect(emitAnnotatorActiveChangeEvent).toHaveBeenCalledWith('124');
            expect(history.push).not.toHaveBeenCalled();
            expect(onAnnotationSelect).toHaveBeenCalledWith(annotation);
        });
    });

    describe('handleAnnotationDelete()', () => {
        test('should call deleteAnnotation API', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();
            instance.fetchFeedItems = jest.fn();

            wrapper.instance().handleAnnotationDelete({ id: '123' });

            expect(api.getFeedAPI().deleteAnnotation).toBeCalled();
            expect(instance.fetchFeedItems).toHaveBeenCalled();
        });
    });

    describe('deleteAnnotationSuccess()', () => {
        test('should handle successful annotation deletion', () => {
            const mockEmitRemoveEvent = jest.fn();
            const mockFeedSuccess = jest.fn();
            const wrapper = getWrapper({ emitRemoveEvent: mockEmitRemoveEvent });
            const instance = wrapper.instance();

            instance.feedSuccessCallback = mockFeedSuccess;
            instance.deleteAnnotationSuccess('123');

            expect(mockEmitRemoveEvent).toBeCalledWith('123');
            expect(mockFeedSuccess).toBeCalled();
        });
    });
});
