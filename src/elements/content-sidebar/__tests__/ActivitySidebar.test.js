import React from 'react';
import { shallow, mount } from 'enzyme';
import cloneDeep from 'lodash/cloneDeep';
import { ActivitySidebarComponent, activityFeedInlineError } from '../ActivitySidebar';
import { filterableActivityFeedItems } from '../fixtures';

jest.mock('lodash/debounce', () => jest.fn(i => i));

const userError = 'Bad box user!';

describe('elements/content-sidebar/ActivitySidebar', () => {
    const feedAPI = {
        createComment: jest.fn(),
        createReply: jest.fn(),
        createTaskNew: jest.fn(),
        createThreadedComment: jest.fn(),
        deleteAnnotation: jest.fn(),
        deleteComment: jest.fn(),
        deleteReply: jest.fn(),
        deleteTaskNew: jest.fn(),
        deleteThreadedComment: jest.fn(),
        feedItems: jest.fn(),
        fetchReplies: jest.fn(),
        updateAnnotation: jest.fn(),
        updateComment: jest.fn(),
        updateReply: jest.fn(),
        updateTaskCollaborator: jest.fn(),
        updateTaskNew: jest.fn(),
        updateThreadedComment: jest.fn(),
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
    const currentUser = {
        id: '123',
        name: 'foo bar',
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
                currentUser={currentUser}
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

        beforeEach(() => {
            jest.spyOn(ActivitySidebarComponent.prototype, 'fetchFeedItems');

            wrapper = getWrapper();
            instance = wrapper.instance();
        });

        afterEach(() => {
            jest.restoreAllMocks();
        });

        test('should fetch the file and refresh the cache and fetch the current user', () => {
            expect(instance.fetchFeedItems).toHaveBeenCalledWith(true);
        });
    });

    describe('render()', () => {
        test('should render the activity feed sidebar', () => {
            const wrapper = getWrapper();
            expect(wrapper).toMatchSnapshot();
        });
    });

    describe('createTask()', () => {
        test('should throw an error if there is not the current user in the state', () => {
            const wrapper = getWrapper({ currentUser: undefined });
            const instance = wrapper.instance();
            expect(() => instance.createTask()).toThrow('Bad box user!');
        });

        test('should create the task and fetch the feed items', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();
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
        test.each`
            hasReplies
            ${undefined}
            ${false}
        `(
            'should call the deleteComment API if it exists when hasReplies prop equals to $hasReplies',
            ({ hasReplies }) => {
                const wrapper = getWrapper({ hasReplies });
                const instance = wrapper.instance();
                instance.fetchFeedItems = jest.fn();

                const id = '1';
                const permissions = {
                    can_edit: false,
                    can_delete: true,
                };
                instance.deleteComment({ id, permissions });
                expect(feedAPI.deleteComment).toBeCalledWith(
                    file,
                    id,
                    permissions,
                    expect.any(Function),
                    expect.any(Function),
                );
                expect(instance.fetchFeedItems).toBeCalled();
            },
        );

        test('should call the deleteThreadedComment API if it exists when hasReplies prop equals to true', () => {
            const wrapper = getWrapper({ hasReplies: true });
            const instance = wrapper.instance();
            instance.fetchFeedItems = jest.fn();

            const id = '1';
            const permissions = {
                can_edit: false,
                can_delete: true,
            };
            instance.deleteComment({ id, permissions });
            expect(feedAPI.deleteThreadedComment).toBeCalledWith(
                file,
                id,
                permissions,
                expect.any(Function),
                expect.any(Function),
            );
            expect(instance.fetchFeedItems).toBeCalled();
        });
    });

    describe('deleteReply()', () => {
        test('should call the deleteReply API', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();
            instance.fetchFeedItems = jest.fn();

            const id = '1';
            const parentId = '123';
            const permissions = {
                can_edit: false,
                can_delete: true,
            };
            instance.deleteReply({ id, parentId, permissions });
            expect(feedAPI.deleteReply).toBeCalledWith(
                file,
                id,
                parentId,
                permissions,
                expect.any(Function),
                expect.any(Function),
            );
            expect(instance.fetchFeedItems).toBeCalled();
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
        let onTaskAssignmentUpdate;

        beforeEach(() => {
            onTaskAssignmentUpdate = jest.fn();
            wrapper = getWrapper({ onTaskAssignmentUpdate, file });
            instance = wrapper.instance();
            instance.fetchFeedItems = jest.fn();
            instance.feedSuccessCallback = jest.fn();
            instance.feedErrorCallback = jest.fn();
        });

        test('should call the update task assignment API and fetch the items', () => {
            instance.updateTaskAssignment('1', '2', 'foo', 'bar');
            expect(feedAPI.updateTaskCollaborator).toHaveBeenCalledWith(
                file,
                '1',
                '2',
                'foo',
                expect.any(Function),
                instance.feedErrorCallback,
            );
            expect(instance.fetchFeedItems).toBeCalled();
            const successCallback = feedAPI.updateTaskCollaborator.mock.calls[0][4];
            successCallback();
            expect(onTaskAssignmentUpdate).toHaveBeenCalledWith('1', '2', 'foo', '123');
        });
    });

    describe('createComment()', () => {
        test('should throw an error if missing current user', () => {
            const wrapper = getWrapper({ currentUser: null });
            const instance = wrapper.instance();
            const message = 'foo';

            expect(() => instance.createComment(message, true)).toThrow('Bad box user!');
        });

        test.each`
            hasReplies
            ${undefined}
            ${false}
        `(
            'should call the createComment API and fetch the items when hasReplies prop equals to $hasReplies',
            ({ hasReplies }) => {
                const wrapper = getWrapper({ hasReplies });
                const instance = wrapper.instance();
                instance.fetchFeedItems = jest.fn();
                const message = 'foo';
                const hasMention = true;

                instance.createComment(message, hasMention);
                expect(feedAPI.createComment).toBeCalledWith(
                    file,
                    currentUser,
                    message,
                    hasMention,
                    expect.any(Function),
                    expect.any(Function),
                );
                expect(instance.fetchFeedItems).toBeCalled();
            },
        );

        test('should call the createThreadedComment API and fetch the items when hasReplies prop equals to true', () => {
            const wrapper = getWrapper({ hasReplies: true });
            const instance = wrapper.instance();
            instance.fetchFeedItems = jest.fn();
            const message = 'foo';
            const hasMention = true;

            instance.createComment(message, hasMention);
            expect(feedAPI.createThreadedComment).toBeCalledWith(
                file,
                currentUser,
                message,
                hasMention,
                expect.any(Function),
                expect.any(Function),
            );
            expect(instance.fetchFeedItems).toBeCalled();
        });
    });

    describe('createReply()', () => {
        test('should throw an error if missing current user', () => {
            const wrapper = getWrapper({ currentUser: undefined });
            const instance = wrapper.instance();

            expect(() => instance.createReply('123', 'comment', 'abc', true)).toThrow(userError);
        });

        test('should call the createReply API and fetch the items', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();
            instance.fetchFeedItems = jest.fn();
            const parentId = '123';
            const parentType = 'comment';
            const message = 'abc';
            const hasMention = true;

            instance.setState({
                currentUser,
            });
            instance.createReply(parentId, parentType, message, hasMention);
            expect(feedAPI.createReply).toBeCalledWith(
                file,
                currentUser,
                parentId,
                parentType,
                message,
                hasMention,
                expect.any(Function),
                expect.any(Function),
            );
            expect(instance.fetchFeedItems).toBeCalled();
        });
    });

    describe('updateComment()', () => {
        test.each`
            hasReplies
            ${undefined}
            ${false}
        `('should call updateComment API when hasReplies prop equals to $hasReplies', ({ hasReplies }) => {
            const wrapper = getWrapper({ hasReplies });
            const instance = wrapper.instance();
            instance.fetchFeedItems = jest.fn();

            wrapper.instance().updateComment('123', 'hello', undefined, false, {
                can_edit: true,
                can_delete: true,
            });

            expect(api.getFeedAPI().updateComment).toBeCalledWith(
                file,
                '123',
                'hello',
                false,
                { can_edit: true, can_delete: true },
                expect.any(Function),
                expect.any(Function),
            );
            expect(instance.fetchFeedItems).toBeCalled();
        });

        describe('should call updateThreadedComment API when hasReplies prop equals to true', () => {
            test.each`
                status       | text         | expectedStatus | expectedText
                ${undefined} | ${undefined} | ${undefined}   | ${undefined}
                ${'open'}    | ${'foo'}     | ${'open'}      | ${'foo'}
            `('given status=$status and text=$text', ({ status, text, expectedStatus, expectedText }) => {
                const wrapper = getWrapper({ hasReplies: true });
                const instance = wrapper.instance();
                instance.fetchFeedItems = jest.fn();

                wrapper.instance().updateComment('123', text, status, false, {
                    can_edit: true,
                    can_delete: true,
                });

                expect(api.getFeedAPI().updateThreadedComment).toBeCalledWith(
                    file,
                    '123',
                    expectedText,
                    expectedStatus,
                    false,
                    { can_edit: true, can_delete: true },
                    expect.any(Function),
                    expect.any(Function),
                );
                expect(instance.fetchFeedItems).toBeCalled();
            });
        });
    });

    describe('updateReply()', () => {
        test('should call updateReply API', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();
            const parentId = '123';
            const text = 'abc';
            const hasMention = true;
            const reply = {
                id: '1',
                permissions: { can_edit: true },
            };
            instance.fetchFeedItems = jest.fn();

            wrapper.instance().updateReply(reply.id, parentId, text, hasMention, reply.permissions);

            expect(api.getFeedAPI().updateReply).toBeCalledWith(
                file,
                reply.id,
                parentId,
                text,
                hasMention,
                reply.permissions,
                expect.any(Function),
                expect.any(Function),
            );
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
            annotationsEnabled | appActivityEnabled | repliesEnabled | tasksEnabled | versionsEnabled | expectedAnnotations | expectedAppActivity | expectedReplies | expectedTasks | expectedVersions
            ${false}           | ${false}           | ${false}       | ${false}     | ${false}        | ${false}            | ${false}            | ${false}        | ${false}      | ${false}
            ${true}            | ${true}            | ${true}        | ${true}      | ${true}         | ${true}             | ${true}             | ${true}         | ${true}       | ${true}
        `(
            'should fetch the feed items based on features: annotationsEnabled=$annotationsEnabled, appActivityEnabled=$appActivityEnabled, repliesEnabled=$repliesEnabled, tasksEnabled=$tasksEnabled and versionsEnabled=$versionsEnabled',
            ({
                annotationsEnabled,
                appActivityEnabled,
                repliesEnabled,
                tasksEnabled,
                versionsEnabled,
                expectedAnnotations,
                expectedAppActivity,
                expectedReplies,
                expectedTasks,
                expectedVersions,
            }) => {
                wrapper = getWrapper({
                    features: {
                        activityFeed: {
                            annotations: { enabled: annotationsEnabled },
                            appActivity: { enabled: appActivityEnabled },
                        },
                    },
                    hasReplies: repliesEnabled,
                    hasTasks: tasksEnabled,
                    hasVersions: versionsEnabled,
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
                    {
                        shouldShowAnnotations: expectedAnnotations,
                        shouldShowAppActivity: expectedAppActivity,
                        shouldShowReplies: expectedReplies,
                        shouldShowTasks: expectedTasks,
                        shouldShowVersions: expectedVersions,
                    },
                );
            },
        );
    });

    describe('fetchFeedItemsSuccessCallback()', () => {
        const feedItems = ['foo'];
        let instance;
        let logger;
        let wrapper;

        beforeEach(() => {
            logger = { onDataReadyMetric: jest.fn(), onReadyMetric: jest.fn() };
            wrapper = getWrapper({ logger });
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

        test('should not call onDataReadyMetric if feedItems is <= 1', () => {
            instance.fetchFeedItemsSuccessCallback(feedItems);
            expect(logger.onDataReadyMetric).not.toHaveBeenCalled();
        });

        test('should call onDataReadyMetric if feedItems is > 1', () => {
            instance.fetchFeedItemsSuccessCallback(['foo', 'bar']);
            expect(logger.onDataReadyMetric).toHaveBeenCalledWith(
                {
                    endMarkName: 'activity_sidebar_data_ready',
                    startMarkName: 'activity_sidebar_data_loading',
                },
                file.id,
            );
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
        });

        test('should dinamycally set as false contacts loading state', () => {
            instance.setState = jest.fn();
            instance.getMentionContactsSuccessCallback(collaborators);

            expect(instance.setState).toBeCalledWith(
                {
                    contactsLoaded: false,
                },
                expect.any(Function),
            );
        });

        test('should set the feedItems in the state', () => {
            instance.getMentionContactsSuccessCallback(collaborators);
            expect(wrapper.state('contactsLoaded')).toBeTruthy();
            expect(wrapper.state('mentionSelectorContacts')).toEqual(collaborators.entries);
        });
    });

    describe('getReplies()', () => {
        test('should call fetchReplies API', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();
            const itemId = '123';
            const itemType = 'comment';
            instance.fetchFeedItems = jest.fn();

            wrapper.instance().getReplies(itemId, itemType);

            expect(api.getFeedAPI().fetchReplies).toBeCalledWith(
                file,
                itemId,
                itemType,
                expect.any(Function),
                expect.any(Function),
            );
            expect(instance.fetchFeedItems).toBeCalled();
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

    describe('handleAnnotationEdit()', () => {
        test('should call updateAnnotation API', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();
            instance.fetchFeedItems = jest.fn();

            wrapper.instance().handleAnnotationEdit('123', 'hello', {
                can_edit: true,
                can_delete: true,
                can_resolve: true,
            });

            expect(api.getFeedAPI().updateAnnotation).toBeCalledWith(
                expect.anything(),
                '123',
                'hello',
                undefined,
                { can_edit: true, can_delete: true, can_resolve: true },
                expect.any(Function),
                expect.any(Function),
            );
            expect(instance.fetchFeedItems).toBeCalled();
        });
    });

    describe('handleAnnotationStatusChange()', () => {
        test('should call updateAnnotation API', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();
            instance.fetchFeedItems = jest.fn();

            wrapper.instance().handleAnnotationStatusChange('123', 'open', {
                can_edit: true,
                can_delete: true,
                can_resolve: true,
            });

            expect(api.getFeedAPI().updateAnnotation).toBeCalledWith(
                expect.anything(),
                '123',
                undefined,
                'open',
                { can_edit: true, can_delete: true, can_resolve: true },
                expect.any(Function),
                expect.any(Function),
            );
            expect(instance.fetchFeedItems).toBeCalled();
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

    describe('getFilteredFeedItems()', () => {
        const {
            annotationOpen: expectedAnnotationOpen,
            annotationResolved: expectedAnnotationResolved,
            commentOpen: expectedCommentOpen,
            commentResolved: expectedCommentResolved,
            taskItem: expectedTaskItem,
            versionItem: expectedVersionItem,
        } = filterableActivityFeedItems;

        test.each`
            status        | expected
            ${undefined}  | ${[expectedAnnotationOpen, expectedAnnotationResolved, expectedCommentOpen, expectedCommentResolved, expectedTaskItem, expectedVersionItem]}
            ${'open'}     | ${[expectedAnnotationOpen, expectedCommentOpen, expectedVersionItem]}
            ${'resolved'} | ${[expectedAnnotationResolved, expectedCommentResolved, expectedVersionItem]}
        `(
            'should filter feed items of type "comment" or "annotation" based on status equal to $status',
            ({ status, expected }) => {
                const {
                    annotationOpen,
                    annotationResolved,
                    commentOpen,
                    commentResolved,
                    taskItem,
                    versionItem,
                } = cloneDeep(filterableActivityFeedItems);
                const wrapper = getWrapper();
                const instance = wrapper.instance();
                instance.setState({
                    feedItems: [
                        annotationOpen,
                        annotationResolved,
                        commentOpen,
                        commentResolved,
                        taskItem,
                        versionItem,
                    ],
                });
                instance.setState({
                    feedItemsStatusFilter: status,
                });
                expect(instance.getFilteredFeedItems()).toMatchObject(expected);
            },
        );
    });

    describe('handleItemsFiltered()', () => {
        test.each`
            status        | expected
            ${undefined}  | ${undefined}
            ${'open'}     | ${'open'}
            ${'resolved'} | ${'resolved'}
        `('given $status should update feedItemsStatusFilter state with $expected', ({ status, expected }) => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();
            instance.setState = jest.fn();
            instance.handleItemsFiltered(status);
            expect(instance.setState).toBeCalledWith({ feedItemsStatusFilter: expected });
        });
    });

    describe('renderAddTaskButton()', () => {
        test('should return null when hasTasks is false', () => {
            const wrapper = getWrapper({ hasTasks: false });
            const instance = wrapper.instance();
            expect(instance.renderAddTaskButton()).toBe(null);
        });
    });

    describe('renderActivitySidebarFilter()', () => {
        describe('should return null', () => {
            test('when activityFeed.filter feature is not set', () => {
                const wrapper = getWrapper();
                const instance = wrapper.instance();
                expect(instance.renderActivitySidebarFilter()).toBe(null);
            });

            test('when activityFeed.filter feature is disabled', () => {
                const wrapper = getWrapper({
                    features: {
                        activityFeed: {
                            filter: { enabled: false },
                        },
                    },
                });
                const instance = wrapper.instance();
                expect(instance.renderActivitySidebarFilter()).toBe(null);
            });
        });

        test('should return ActivitySidebarFilter when activityFeed.filter feature is enabled', () => {
            const wrapper = getWrapper({
                features: {
                    activityFeed: {
                        filter: { enabled: true },
                    },
                },
            });
            const instance = wrapper.instance();
            const resultWrapper = mount(instance.renderActivitySidebarFilter());
            expect(resultWrapper.name()).toBe('ActivitySidebarFilter');
        });
    });

    describe('renderTitle()', () => {
        describe('should return FormattedMessage', () => {
            test('when activityFeed.filter feature is not set', () => {
                const wrapper = getWrapper();
                const instance = wrapper.instance();
                const resultWrapper = mount(instance.renderTitle());
                expect(resultWrapper.name()).toBe('FormattedMessage');
            });

            test('when activityFeed.filter feature is disabled', () => {
                const wrapper = getWrapper({
                    features: {
                        activityFeed: {
                            filter: { enabled: false },
                        },
                    },
                });
                const instance = wrapper.instance();
                const resultWrapper = mount(instance.renderTitle());
                expect(resultWrapper.name()).toBe('FormattedMessage');
            });
        });

        test('should return undefined when activityFeed.filter feature is enabled', () => {
            const wrapper = getWrapper({ features: { activityFeed: { filter: { enabled: true } } } });
            const instance = wrapper.instance();
            expect(instance.renderTitle()).toBe(undefined);
        });
    });
});
