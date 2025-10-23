import * as React from 'react';
import { shallow, mount } from 'enzyme';
import cloneDeep from 'lodash/cloneDeep';
import { ActivitySidebarComponent, activityFeedInlineError } from '../ActivitySidebar';
import ActivitySidebarFilter from '../ActivitySidebarFilter';
import { filterableActivityFeedItems } from '../fixtures';
import { FEED_ITEM_TYPE_COMMENT } from '../../../constants';

jest.mock('lodash/debounce', () => jest.fn(i => i));
jest.mock('lodash/uniqueId', () => () => 'uniqueId');

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
        fetchThreadedComment: jest.fn(),
        updateAnnotation: jest.fn(),
        updateComment: jest.fn(),
        updateFeedItem: jest.fn(),
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
        getCollaboratorsWithQuery: jest.fn(),
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
        test('should call the deleteReply API and call emitAnnotationReplyDeleteEvent', () => {
            const mockEmitAnnotationReplyDeleteEvent = jest.fn();
            const wrapper = getWrapper({ emitAnnotationReplyDeleteEvent: mockEmitAnnotationReplyDeleteEvent });
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
            expect(mockEmitAnnotationReplyDeleteEvent).toBeCalledWith(id, parentId, true);
        });
    });

    describe('deleteReplySuccessCallback()', () => {
        test('should call the feedSuccessCallback and emitAnnotationReplyDeleteEvent', () => {
            const mockEmitAnnotationReplyDeleteEvent = jest.fn();
            const wrapper = getWrapper({ emitAnnotationReplyDeleteEvent: mockEmitAnnotationReplyDeleteEvent });
            const instance = wrapper.instance();
            instance.feedSuccessCallback = jest.fn();

            const id = '1';
            const parentId = '123';

            instance.deleteReplySuccessCallback(id, parentId);
            expect(instance.feedSuccessCallback).toBeCalled();
            expect(mockEmitAnnotationReplyDeleteEvent).toBeCalledWith(id, parentId);
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

            expect(() => instance.createReply('123', FEED_ITEM_TYPE_COMMENT, 'abc', true)).toThrow(userError);
        });

        test('should call the createReply API, fetch the items and call emitAnnotationReplyCreateEvent', () => {
            const mockEmitAnnotationReplyCreateEvent = jest.fn();
            const wrapper = getWrapper({ emitAnnotationReplyCreateEvent: mockEmitAnnotationReplyCreateEvent });
            const instance = wrapper.instance();
            instance.fetchFeedItems = jest.fn();
            const parentId = '123';
            const parentType = FEED_ITEM_TYPE_COMMENT;
            const message = 'abc';

            instance.setState({
                currentUser,
            });
            instance.createReply(parentId, parentType, message);
            expect(feedAPI.createReply).toBeCalledWith(
                file,
                currentUser,
                parentId,
                parentType,
                message,
                expect.any(Function),
                expect.any(Function),
            );
            expect(instance.fetchFeedItems).toBeCalled();
            expect(mockEmitAnnotationReplyCreateEvent).toBeCalledWith(
                { tagged_message: message },
                'uniqueId',
                parentId,
                true,
            );
        });
    });

    describe('createReplySuccessCallback()', () => {
        test('should call the feedSuccessCallback and emitAnnotationReplyCreateEvent', () => {
            const mockEmitAnnotationReplyCreateEvent = jest.fn();
            const wrapper = getWrapper({ emitAnnotationReplyCreateEvent: mockEmitAnnotationReplyCreateEvent });
            const instance = wrapper.instance();
            instance.feedSuccessCallback = jest.fn();

            const reply = { id: '1', status: 'resolved' };
            const parentId = '123';
            const eventRequestId = 'comment_123';

            instance.createReplySuccessCallback(eventRequestId, parentId, reply);
            expect(instance.feedSuccessCallback).toBeCalled();
            expect(mockEmitAnnotationReplyCreateEvent).toBeCalledWith(reply, eventRequestId, parentId);
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
                    { can_edit: true, can_delete: true },
                    expect.any(Function),
                    expect.any(Function),
                );
                expect(instance.fetchFeedItems).toBeCalled();
            });
        });
    });

    describe('updateReply()', () => {
        test('should call updateReply API and call emitAnnotationReplyUpdateEvent', () => {
            const mockEmitAnnotationReplyUpdateEvent = jest.fn();
            const wrapper = getWrapper({ emitAnnotationReplyUpdateEvent: mockEmitAnnotationReplyUpdateEvent });
            const instance = wrapper.instance();
            const parentId = '123';
            const text = 'abc';
            const reply = {
                id: '1',
                permissions: { can_edit: true },
            };
            instance.fetchFeedItems = jest.fn();

            wrapper.instance().updateReply(reply.id, parentId, text, reply.permissions);

            expect(api.getFeedAPI().updateReply).toBeCalledWith(
                file,
                reply.id,
                parentId,
                text,
                reply.permissions,
                expect.any(Function),
                expect.any(Function),
            );
            expect(instance.fetchFeedItems).toBeCalled();
            expect(mockEmitAnnotationReplyUpdateEvent).toBeCalledWith(
                { id: reply.id, tagged_message: text },
                parentId,
                true,
            );
        });
    });

    describe('fetchRepliesForFeedItems()', () => {
        test('should not call getActiveFeedEntryData if activeFeedEntryId is not set', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();
            instance.getActiveFeedEntryData = jest.fn();

            instance.fetchRepliesForFeedItems([]);

            expect(instance.getActiveFeedEntryData).not.toBeCalled();
        });

        test('should call getActiveFeedEntryData with given feedItems if activeFeedEntryId is set', () => {
            const wrapper = getWrapper({
                activeFeedEntryId: '123',
            });
            const instance = wrapper.instance();
            instance.getActiveFeedEntryData = jest.fn().mockImplementation(() => Promise.resolve());
            const feedItems = [{ id: '123' }];

            instance.fetchRepliesForFeedItems(feedItems);

            expect(instance.getActiveFeedEntryData).toBeCalledWith(feedItems);
        });

        test.each`
            id           | type         | isActiveEntryInFeedResult
            ${undefined} | ${undefined} | ${true}
            ${'123'}     | ${'comment'} | ${true}
            ${undefined} | ${undefined} | ${false}
            ${'123'}     | ${'task'}    | ${false}
        `(
            'should not call getFeedItemsWithReplies if isActiveEntryInFeed results with $isActiveEntryInFeedResult and getActiveFeedEntryData resolves with id=$id and type=$type',
            async ({ id, type, isActiveEntryInFeedResult }) => {
                const wrapper = getWrapper({
                    activeFeedEntryId: '123',
                });
                const instance = wrapper.instance();
                instance.getFeedItemsWithReplies = jest.fn();
                instance.isActiveEntryInFeed = jest.fn().mockImplementation(() => isActiveEntryInFeedResult);
                instance.getActiveFeedEntryData = jest.fn().mockImplementation(() => Promise.resolve({ id, type }));
                const feedItems = [{ id: '123' }];

                await instance.fetchRepliesForFeedItems(feedItems);

                expect(instance.getFeedItemsWithReplies).not.toBeCalled();
            },
        );

        test('should call getFeedItemsWithReplies if getActiveFeedEntryData resolves with id and type of feed item that is not the feed ', async () => {
            const wrapper = getWrapper({
                activeFeedEntryId: '123',
            });
            const instance = wrapper.instance();
            instance.isActiveEntryInFeed = jest.fn().mockImplementation(() => false);
            instance.getActiveFeedEntryData = jest
                .fn()
                .mockImplementation(() => Promise.resolve({ id: '123', type: 'comment' }));
            instance.getFeedItemsWithReplies = jest.fn().mockImplementation(() => Promise.resolve());
            const feedItems = [{ id: '123', replies: [{ id: '456' }] }];

            await instance.fetchRepliesForFeedItems(feedItems);

            expect(instance.getFeedItemsWithReplies).toBeCalledWith(feedItems, '123', 'comment');
        });
    });

    describe('updateReplySuccessCallback()', () => {
        test('should call the feedSuccessCallback and emitAnnotationReplyUpdateEvent', () => {
            const mockEmitAnnotationReplyUpdateEvent = jest.fn();
            const wrapper = getWrapper({ emitAnnotationReplyUpdateEvent: mockEmitAnnotationReplyUpdateEvent });
            const instance = wrapper.instance();
            instance.feedSuccessCallback = jest.fn();

            const onSuccess = jest.fn();
            const reply = { id: '1', status: 'resolved' };
            const parentId = '123';

            instance.updateReplySuccessCallback(parentId, onSuccess, reply);
            expect(instance.feedSuccessCallback).toBeCalled();
            expect(mockEmitAnnotationReplyUpdateEvent).toBeCalledWith(reply, parentId);
            expect(onSuccess).toBeCalled();
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
            annotationsEnabled | appActivityEnabled | repliesEnabled | tasksEnabled | versionsEnabled | uaaIntegrationEnabled | expectedAnnotations | expectedAppActivity | expectedReplies | expectedTasks | expectedVersions | expectedUseUAA
            ${false}           | ${false}           | ${false}       | ${false}     | ${false}        | ${false}              | ${false}            | ${false}            | ${false}        | ${false}      | ${false}         | ${false}
            ${true}            | ${true}            | ${true}        | ${true}      | ${true}         | ${true}               | ${true}             | ${true}             | ${true}         | ${true}       | ${true}          | ${true}
        `(
            'should fetch the feed items based on features: annotationsEnabled=$annotationsEnabled, appActivityEnabled=$appActivityEnabled, repliesEnabled=$repliesEnabled, tasksEnabled=$tasksEnabled, versionsEnabled=$versionsEnabled and uaaIntegrationEnabled=$uaaIntegrationEnabled',
            ({
                annotationsEnabled,
                appActivityEnabled,
                repliesEnabled,
                tasksEnabled,
                versionsEnabled,
                uaaIntegrationEnabled,
                expectedAnnotations,
                expectedAppActivity,
                expectedReplies,
                expectedTasks,
                expectedVersions,
                expectedUseUAA,
            }) => {
                wrapper = getWrapper({
                    features: {
                        activityFeed: {
                            annotations: { enabled: annotationsEnabled },
                            appActivity: { enabled: appActivityEnabled },
                            uaaIntegration: { enabled: uaaIntegrationEnabled },
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
                instance.logAPIParity = jest.fn();

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
                        shouldUseUAA: expectedUseUAA,
                    },
                    expectedUseUAA ? instance.logAPIParity : undefined,
                );
            },
        );

        test('should call feedItems with fetchRepliesForFeedItems as success callback instead of fetchFeedItemsSuccessCallback when shouldShowReplies and shouldRefreshCache are true and active comment is set, ', () => {
            const shouldShowReplies = true;
            const shouldRefreshCache = true;
            wrapper = getWrapper({
                activeFeedEntryId: '123',
                activeFeedEntryType: 'comment',
                hasReplies: shouldShowReplies,
            });
            instance = wrapper.instance();
            instance.errorCallback = jest.fn();
            instance.fetchFeedItemsErrorCallback = jest.fn();
            instance.fetchRepliesForFeedItems = jest.fn();

            instance.fetchFeedItems(shouldRefreshCache);

            expect(feedAPI.feedItems).toHaveBeenCalledWith(
                file,
                true,
                instance.fetchRepliesForFeedItems,
                instance.fetchFeedItemsErrorCallback,
                instance.errorCallback,
                {
                    shouldShowAnnotations: false,
                    shouldShowAppActivity: false,
                    shouldShowReplies: true,
                    shouldShowTasks: true,
                    shouldShowVersions: true,
                    shouldUseUAA: false,
                },
                undefined,
            );
        });
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

    describe('getCommentFeedItemWithReplies()', () => {
        test('should return given feedItem with given replies', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();

            const item = { id: '123' };
            const replies = [{ id: '456' }];
            const expectedItem = { id: '123', replies: [{ id: '456' }] };

            expect(instance.getCommentFeedItemWithReplies(item, replies)).toMatchObject(expectedItem);
        });
    });

    describe('getFeedItemsWithReplies()', () => {
        test.each`
            id           | type
            ${undefined} | ${'comment'}
            ${'123'}     | ${undefined}
            ${undefined} | ${undefined}
        `('should resolve with given feedItems if id=$id and type=$type', async ({ id, type }) => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();
            const feedItems = [{ id: '123' }];

            const result = await instance.getFeedItemsWithReplies(feedItems, id, type);

            expect(result).toMatchObject(feedItems);
        });

        test('should call fetchReplies feed api and resolve with updated feedItems', async () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();
            const feedItems = [{ id: '123', type: 'comment' }];
            const id = '123';
            const type = 'comment';
            const replies = [{ id: '456' }, { id: '789' }];
            const expectedItem = { id: '123', type: 'comment', replies };
            const expectedItems = [expectedItem];

            instance.isItemTypeComment = jest.fn().mockImplementation(() => true);
            instance.getCommentFeedItemWithReplies = jest.fn().mockImplementation(() => expectedItem);
            api.getFeedAPI().fetchReplies = jest
                .fn()
                .mockImplementationOnce((fileParam, idParam, typeParam, successCallback) => {
                    successCallback(replies);
                });

            const result = await instance.getFeedItemsWithReplies(feedItems, id, type);

            expect(api.getFeedAPI().fetchReplies).toBeCalledWith(
                file,
                id,
                type,
                expect.any(Function),
                expect.any(Function),
            );
            expect(result).toMatchObject(expectedItems);
        });

        test('should reject with error if fetchReplies is called and fails', async () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();
            const feedItems = [{ id: '123', type: 'comment' }];
            const id = '123';
            const type = 'comment';
            const error = { status: '500' };

            api.getFeedAPI().fetchReplies = jest
                .fn()
                .mockImplementationOnce((fileParam, idParam, typeParam, successCallback, errorCallback) => {
                    errorCallback(error);
                });

            await expect(instance.getFeedItemsWithReplies(feedItems, id, type)).rejects.toMatchObject(error);
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

    describe('getApprover()', () => {
        let instance;
        let wrapper;

        test('should get collaborators with groups and respect hidden collaborators', () => {
            wrapper = getWrapper();
            instance = wrapper.instance();

            const search = 'Santa Claus';
            instance.getApprover(search);

            expect(api.getFileCollaboratorsAPI().getCollaboratorsWithQuery).toBeCalledWith(
                file.id,
                instance.getApproverContactsSuccessCallback,
                instance.errorCallback,
                search,
                {
                    includeGroups: true,
                    respectHiddenCollabs: true,
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

    describe('getMention()', () => {
        let instance;
        let wrapper;

        test('should get collaborators without groups', () => {
            wrapper = getWrapper();
            instance = wrapper.instance();

            const search = 'Santa Claus';
            instance.getMention(search);

            expect(api.getFileCollaboratorsAPI().getCollaboratorsWithQuery).toBeCalledWith(
                file.id,
                instance.getMentionContactsSuccessCallback,
                instance.errorCallback,
                search,
            );
        });
    });

    describe('getFocusableFeedItemById()', () => {
        test.each`
            feedItems                                | itemId       | expected
            ${[]}                                    | ${undefined} | ${undefined}
            ${[]}                                    | ${'123'}     | ${undefined}
            ${[{ id: '123', type: 'comment' }]}      | ${'123'}     | ${{ id: '123', type: 'comment' }}
            ${[{ id: '123', type: 'annotation' }]}   | ${'123'}     | ${{ id: '123', type: 'annotation' }}
            ${[{ id: '123', type: 'task' }]}         | ${'123'}     | ${{ id: '123', type: 'task' }}
            ${[{ id: '123', type: 'app_activity' }]} | ${'123'}     | ${undefined}
            ${[{ id: '123', type: 'comment' }]}      | ${'456'}     | ${undefined}
        `(
            'given feedItems=$feedItems and itemId=$itemId should return $expected',
            ({ feedItems, itemId, expected }) => {
                const wrapper = getWrapper();
                const instance = wrapper.instance();

                expect(instance.getFocusableFeedItemById(feedItems, itemId)).toEqual(expected);
            },
        );
    });

    describe('getCommentFeedItemByReplyId()', () => {
        test.each`
            feedItems                                                     | itemId       | expected
            ${[]}                                                         | ${'123'}     | ${undefined}
            ${[]}                                                         | ${undefined} | ${undefined}
            ${[{ id: '123', type: 'comment', replies: [{ id: '456' }] }]} | ${'123'}     | ${undefined}
            ${[{ id: '123', type: 'comment', replies: [{ id: '456' }] }]} | ${'999'}     | ${undefined}
            ${[{ id: '123', type: 'comment', replies: [{ id: '456' }] }]} | ${'456'}     | ${{ id: '123', type: 'comment', replies: [{ id: '456' }] }}
            ${[{ id: '123', type: 'comment' }]}                           | ${'456'}     | ${undefined}
            ${[{ id: '123', type: 'task', replies: [{ id: '456' }] }]}    | ${'456'}     | ${undefined}
        `(
            'given feedItems=$feedItems and itemId=$itemId should return $expected',
            ({ feedItems, itemId, expected }) => {
                const wrapper = getWrapper();
                const instance = wrapper.instance();

                expect(instance.getCommentFeedItemByReplyId(feedItems, itemId)).toEqual(expected);
            },
        );
    });

    describe('isActiveEntryInFeed()', () => {
        test.each`
            getFocusableFeedItemByIdResult | getCommentFeedItemByReplyIdResult | expected
            ${false}                       | ${false}                          | ${false}
            ${true}                        | ${false}                          | ${true}
            ${false}                       | ${true}                           | ${true}
        `(
            'should return $expected when getFocusableFeedItemByIdResult returns $getFocusableFeedItemByIdResult and getCommentFeedItemByReplyId returns $getCommentFeedItemByReplyIdResult',
            ({ getFocusableFeedItemByIdResult, getCommentFeedItemByReplyIdResult, expected }) => {
                const wrapper = getWrapper();
                const instance = wrapper.instance();
                instance.getFocusableFeedItemById = jest
                    .fn()
                    .mockImplementationOnce(() => getFocusableFeedItemByIdResult);
                instance.getCommentFeedItemByReplyId = jest
                    .fn()
                    .mockImplementationOnce(() => getCommentFeedItemByReplyIdResult);

                expect(instance.isActiveEntryInFeed([], '123')).toEqual(expected);
            },
        );
    });

    describe('isItemTypeFocusable()', () => {
        test.each`
            type              | expected
            ${'annotation'}   | ${true}
            ${'app_activity'} | ${false}
            ${'comment'}      | ${true}
            ${'file_version'} | ${false}
            ${'task'}         | ${true}
        `('should return $expected given type=$type', ({ type, expected }) => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();

            expect(instance.isItemTypeFocusable(type)).toEqual(expected);
        });
    });

    describe('isItemTypeComment()', () => {
        test.each`
            type              | expected
            ${'annotation'}   | ${true}
            ${'app_activity'} | ${false}
            ${'comment'}      | ${true}
            ${'file_version'} | ${false}
            ${'task'}         | ${false}
        `('should return $expected given type=$type', ({ type, expected }) => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();

            expect(instance.isItemTypeComment(type)).toEqual(expected);
        });
    });

    describe('getActiveFeedEntryData()', () => {
        test('should resolve with active feed entry data if active entry is a first level Feed item', async () => {
            const wrapper = getWrapper({
                activeFeedEntryId: '123',
                activeFeedEntryType: 'annotation',
            });
            const instance = wrapper.instance();
            const data = { id: '123', type: 'comment' };

            instance.getFocusableFeedItemById = jest.fn().mockImplementation(() => data);

            const result = await instance.getActiveFeedEntryData([]);

            expect(result).toEqual(data);
        });

        test('should resolve with active feed entry data if active entry is within replies of any first level Feed items', async () => {
            const wrapper = getWrapper({
                activeFeedEntryId: '123',
                activeFeedEntryType: 'annotation',
            });
            const instance = wrapper.instance();
            const data = { id: '123', type: 'comment' };

            instance.getFocusableFeedItemById = jest.fn().mockImplementation(() => undefined);
            instance.getCommentFeedItemByReplyId = jest.fn().mockImplementation(() => data);

            const result = await instance.getActiveFeedEntryData([]);

            expect(result).toEqual(data);
        });

        test('should call fetchThreadedComment from feed api if the active entry could not be found within feed items', async () => {
            const wrapper = getWrapper({
                activeFeedEntryId: '123',
                activeFeedEntryType: 'comment',
            });
            const instance = wrapper.instance();
            const expectedData = { id: '123', type: 'comment' };
            const parentItem = { id: '123', type: 'comment', replies: [{ id: '456' }] };
            const feedItems = [parentItem];

            instance.getFocusableFeedItemById = jest
                .fn()
                .mockImplementation(() => parentItem)
                .mockImplementationOnce(() => undefined);
            instance.getCommentFeedItemByReplyId = jest.fn().mockImplementation(() => undefined);
            api.getFeedAPI().fetchThreadedComment = jest
                .fn()
                .mockImplementationOnce((f, commentId, successCallback) => {
                    successCallback({ parent: {} });
                });

            const result = await instance.getActiveFeedEntryData(feedItems);

            expect(api.getFeedAPI().fetchThreadedComment).toBeCalledWith(
                file,
                '123',
                expect.any(Function),
                expect.any(Function),
            );
            expect(result).toMatchObject(expectedData);
        });

        test('if fetchThreadedComment is called unsuccessfuly and error status is 404, should resolve with {}', async () => {
            const wrapper = getWrapper({
                activeFeedEntryId: '123',
                activeFeedEntryType: 'comment',
            });
            const instance = wrapper.instance();
            const feedItems = [{ id: '123', type: 'comment' }];
            const error = { status: 404 };

            api.getFeedAPI().fetchThreadedComment = jest
                .fn()
                .mockImplementationOnce((f, commentId, successCallback, errorCallback) => {
                    errorCallback(error);
                });
            instance.getFocusableFeedItemById = jest.fn().mockImplementation(() => undefined);
            instance.getCommentFeedItemByReplyId = jest.fn().mockImplementation(() => undefined);

            const result = await instance.getActiveFeedEntryData(feedItems);

            expect(result).toMatchObject({});
        });

        test('if fetchThreadedComment is called unsuccessfuly and error status != 404, should reject with received error', async () => {
            const wrapper = getWrapper({
                activeFeedEntryId: '123',
                activeFeedEntryType: 'comment',
            });
            const instance = wrapper.instance();
            const feedItems = [{ id: '123', type: 'comment' }];
            const error = { status: 500 };

            api.getFeedAPI().fetchThreadedComment = jest
                .fn()
                .mockImplementationOnce((f, commentId, successCallback, errorCallback) => {
                    errorCallback(error);
                });
            instance.getFocusableFeedItemById = jest.fn().mockImplementation(() => undefined);
            instance.getCommentFeedItemByReplyId = jest.fn().mockImplementation(() => undefined);

            await expect(instance.getActiveFeedEntryData(feedItems)).rejects.toMatchObject(error);
        });
    });

    describe('getActiveCommentPath()', () => {
        test.each`
            commentId    | expected
            ${undefined} | ${'/activity'}
            ${'123'}     | ${'/activity/comments/123'}
            ${'456'}     | ${'/activity/comments/456'}
        `('should return $expected given commentId=$commentId', ({ commentId, expected }) => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();

            expect(instance.getActiveCommentPath(commentId)).toEqual(expected);
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
            const itemType = FEED_ITEM_TYPE_COMMENT;
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

    describe('handleAnnotationEdit()', () => {
        test('should call updateAnnotation API and call emitAnnotationUpdateEvent', () => {
            const mockEmitAnnotationUpdateEvent = jest.fn();
            const wrapper = getWrapper({ emitAnnotationUpdateEvent: mockEmitAnnotationUpdateEvent });
            const instance = wrapper.instance();
            instance.fetchFeedItems = jest.fn();

            wrapper.instance().handleAnnotationEdit({
                id: '123',
                permissions: {
                    can_edit: true,
                    can_delete: true,
                    can_resolve: true,
                },
                text: 'hello',
            });

            expect(mockEmitAnnotationUpdateEvent).toBeCalledWith(
                {
                    id: '123',
                    description: {
                        message: 'hello',
                    },
                },
                true,
            );
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
        test('should call updateAnnotation API and call emitAnnotationUpdateEvent', () => {
            const mockEmitAnnotationUpdateEvent = jest.fn();
            const wrapper = getWrapper({ emitAnnotationUpdateEvent: mockEmitAnnotationUpdateEvent });
            const instance = wrapper.instance();
            instance.fetchFeedItems = jest.fn();

            wrapper.instance().handleAnnotationStatusChange({
                id: '123',
                status: 'open',
                permissions: {
                    can_edit: true,
                    can_delete: true,
                    can_resolve: true,
                },
            });

            expect(mockEmitAnnotationUpdateEvent).toBeCalledWith({ id: '123', status: 'open' }, true);
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
        test('should call deleteAnnotation API and call emitAnnotationDeleteEvent', () => {
            const mockEmitAnnotationRemoveEvent = jest.fn();
            const wrapper = getWrapper({ emitAnnotationRemoveEvent: mockEmitAnnotationRemoveEvent });
            const instance = wrapper.instance();
            instance.fetchFeedItems = jest.fn();

            wrapper.instance().handleAnnotationDelete({ id: '123' });

            expect(mockEmitAnnotationRemoveEvent).toBeCalledWith('123', true);
            expect(api.getFeedAPI().deleteAnnotation).toBeCalled();
            expect(instance.fetchFeedItems).toHaveBeenCalled();
        });
    });

    describe('deleteAnnotationSuccess()', () => {
        test('should handle successful annotation deletion', () => {
            const mockEmitAnnotationRemoveEvent = jest.fn();
            const mockFeedSuccess = jest.fn();
            const wrapper = getWrapper({ emitAnnotationRemoveEvent: mockEmitAnnotationRemoveEvent });
            const instance = wrapper.instance();

            instance.feedSuccessCallback = mockFeedSuccess;
            instance.deleteAnnotationSuccess('123');

            expect(mockEmitAnnotationRemoveEvent).toBeCalledWith('123');
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
            ${'task'}     | ${[expectedTaskItem, expectedVersionItem]}
        `(
            'should filter feed items of type "comment" or "annotation" based on status equal to $status',
            ({ status, expected }) => {
                const { annotationOpen, annotationResolved, commentOpen, commentResolved, taskItem, versionItem } =
                    cloneDeep(filterableActivityFeedItems);
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
            ${'task'}     | ${'task'}
        `(
            'given $status should update feedItemsStatusFilter state with $expected and call filter change event callback',
            ({ status, expected }) => {
                const mockOnFilterChange = jest.fn();
                const wrapper = getWrapper({ onFilterChange: mockOnFilterChange });
                const instance = wrapper.instance();
                instance.setState = jest.fn();
                instance.handleItemsFiltered(status);
                expect(instance.setState).toBeCalledWith({ feedItemsStatusFilter: expected });
                expect(mockOnFilterChange).toBeCalledWith(expected);
            },
        );
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

            test.each`
                hasTasks
                ${false}
                ${true}
            `('when activityFeed.newThreadedReplies is not enabled and hasTasks is $hasTasks', ({ hasTasks }) => {
                const wrapper = getWrapper({
                    features: {
                        activityFeed: {
                            newThreadedReplies: { enabled: false },
                        },
                    },
                    hasTasks,
                });
                const instance = wrapper.instance();
                expect(instance.renderActivitySidebarFilter()).toBe(null);
            });
        });

        describe('should return ActivitySidebarFilter', () => {
            test('when activityFeed.filter feature is enabled', () => {
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

            test('with default filter options when activityFeed.filter is enabled', () => {
                const wrapper = getWrapper({
                    features: {
                        activityFeed: {
                            filter: { enabled: true },
                        },
                    },
                    hasTasks: true,
                });
                const instance = wrapper.instance();
                const resultWrapper = mount(instance.renderActivitySidebarFilter());
                const sidebarFilter = resultWrapper.find(ActivitySidebarFilter).first();
                expect(resultWrapper.name()).toBe('ActivitySidebarFilter');
                expect(sidebarFilter.props().activityFilterOptions).toEqual(['all', 'open']);
            });

            test.each`
                expectedOptions                         | hasTasks
                ${['all', 'open', 'resolved']}          | ${false}
                ${['all', 'open', 'resolved', 'tasks']} | ${true}
            `(
                'with $expectedOptions filter options when activityFeed.newThreadedReplies is enabled, activityFeed.filter is enabled, and hasTasks is $hasTasks',
                ({ expectedOptions, hasTasks }) => {
                    const wrapper = getWrapper({
                        features: {
                            activityFeed: {
                                filter: { enabled: true },
                                newThreadedReplies: { enabled: true },
                            },
                        },
                        hasTasks,
                    });
                    const instance = wrapper.instance();
                    const resultWrapper = mount(instance.renderActivitySidebarFilter());
                    const sidebarFilter = resultWrapper.find(ActivitySidebarFilter).first();
                    expect(resultWrapper.name()).toBe('ActivitySidebarFilter');
                    expect(sidebarFilter.props().activityFilterOptions).toEqual(expectedOptions);
                },
            );
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

            test.each`
                hasTasks
                ${false}
                ${true}
            `('when activityFeed.newThreadedReplies is disabled and hasTasks is $hasTasks', ({ hasTasks }) => {
                const wrapper = getWrapper({
                    features: {
                        activityFeed: {
                            newThreadedReplies: { enabled: false },
                        },
                    },
                    hasTasks,
                });
                const instance = wrapper.instance();
                const resultWrapper = mount(instance.renderTitle());
                expect(resultWrapper.name()).toBe('FormattedMessage');
            });
        });

        describe('should return null', () => {
            test('when activityFeed.filter feature is enabled', () => {
                const wrapper = getWrapper({ features: { activityFeed: { filter: { enabled: true } } } });
                const instance = wrapper.instance();
                expect(instance.renderTitle()).toBe(null);
            });

            test.each`
                hasTasks
                ${false}
                ${true}
            `(
                'when activityFeed.newThreadedReplies is enabled, activityFeed.filter is enabled, and hasTasks is $hasTasks',
                ({ hasTasks }) => {
                    const wrapper = getWrapper({
                        features: {
                            activityFeed: {
                                filter: { enabled: true },
                                newThreadedReplies: { enabled: true },
                            },
                        },
                        hasTasks,
                    });
                    const instance = wrapper.instance();
                    expect(instance.renderTitle()).toBe(null);
                },
            );
        });
    });
});
