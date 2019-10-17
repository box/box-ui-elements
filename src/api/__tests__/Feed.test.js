import commonMessages from '../../elements/common/messages';
import messages from '../messages';
import * as sorter from '../../utils/sorter';
import * as error from '../../utils/error';
import { IS_ERROR_DISPLAYED, TASK_NEW_NOT_STARTED } from '../../constants';
import Feed from '../Feed';

const mockTask = {
    created_by: {
        type: 'task_collaborator',
        target: { name: 'Jay-Z', id: '100' },
        id: '000',
        role: 'CREATOR',
        status: TASK_NEW_NOT_STARTED,
    },
    created_at: '2019-01-01',
    due_at: '2019-02-02',
    id: '0',
    name: 'task message',
    type: 'task',
    assigned_to: {
        entries: [
            {
                id: '1',
                target: { name: 'Beyonce', id: '2', avatar_url: '', type: 'user' },
                status: TASK_NEW_NOT_STARTED,
                permissions: {
                    can_delete: false,
                    can_update: false,
                },
                role: 'ASSIGNEE',
                type: 'task_collaborator',
            },
        ],
        limit: 10,
        next_marker: null,
    },
    permissions: {
        can_update: false,
        can_delete: false,
        can_create_task_collaborator: false,
        can_create_task_link: false,
    },
    task_links: {
        entries: [
            {
                id: '03',
                type: 'task_link',
                target: {
                    type: 'file',
                    id: '4',
                },
                permissions: {
                    can_delete: false,
                    can_update: false,
                },
            },
        ],
        limit: 1,
        next_marker: null,
    },
    status: TASK_NEW_NOT_STARTED,
};

const mockFirstVersion = {
    action: 'upload',
    type: 'file_version',
    id: 123,
    created_at: 'Thu Sep 20 33658 19:45:39 GMT-0600 (CST)',
    trashed_at: 1234567891,
    modified_at: 1234567891,
    modified_by: { name: 'Akon', id: 11 },
};

const mockCurrentVersion = {
    action: 'restore',
    type: 'file_version',
    id: '123',
};

const deleted_version = {
    action: 'delete',
    type: 'file_version',
    id: 234,
    created_at: 'Thu Sep 20 33658 19:45:39 GMT-0600 (CST)',
    trashed_at: 1234567891,
    modified_at: 1234567891,
    modified_by: { name: 'Akon', id: 11 },
};

const versions = {
    total_count: 1,
    entries: [mockFirstVersion, deleted_version],
};

const versionsWithCurrent = {
    total_count: 3,
    entries: [mockCurrentVersion, mockFirstVersion, deleted_version],
};

jest.mock('lodash/uniqueId', () => () => 'uniqueId');

jest.mock('../tasks/TasksNew', () => {
    const task = mockTask;
    return jest.fn().mockImplementation(() => ({
        createTask: jest.fn().mockImplementation(({ successCallback }) => {
            successCallback();
        }),
        updateTask: jest.fn().mockImplementation(({ successCallback }) => {
            successCallback();
        }),
        deleteTask: jest.fn().mockImplementation(({ successCallback }) => {
            successCallback();
        }),
        getTasksForFile: jest.fn().mockReturnValue({ entries: [task], next_marker: null, limit: 1000 }),
        getTask: jest.fn(({ successCallback }) => {
            successCallback(task);
        }),
    }));
});

jest.mock('../tasks/TaskCollaborators', () =>
    jest.fn().mockImplementation(() => ({
        createTaskCollaborator: jest.fn().mockImplementation(({ successCallback }) => {
            successCallback();
        }),
        updateTaskCollaborator: jest.fn().mockImplementation(({ successCallback }) => {
            successCallback();
        }),
        deleteTaskCollaborator: jest.fn().mockImplementation(({ successCallback }) => {
            successCallback();
        }),
        getTaskCollaborators: jest.fn().mockReturnValue({
            entries: [
                {
                    id: '1',
                    target: { name: 'Beyonce', id: '2', avatar_url: '', type: 'user' },
                    status: 'NOT_STARTED',
                    permissions: {
                        can_delete: false,
                        can_update: false,
                    },
                    role: 'ASSIGNEE',
                    type: 'task_collaborator',
                },
            ],
            next_marker: null,
            limit: 1000,
        }),
    })),
);

jest.mock('../tasks/TaskLinks', () =>
    jest.fn().mockImplementation(() => ({
        createTaskLink: jest.fn().mockImplementation(({ successCallback }) => {
            successCallback();
        }),
    })),
);

jest.mock('../Comments', () =>
    jest.fn().mockImplementation(() => ({
        getComments: jest.fn().mockReturnValue({
            total_count: 1,
            entries: [
                {
                    type: 'comment',
                    id: '123',
                    created_at: 'Thu Sep 26 33658 19:46:39 GMT-0600 (CST)',
                    tagged_message: 'test @[123:Jeezy] @[10:Kanye West]',
                    created_by: { name: 'Akon', id: 11 },
                },
            ],
        }),
        deleteComment: jest.fn().mockImplementation(({ successCallback }) => {
            successCallback();
        }),
        updateComment: jest.fn().mockImplementation(({ successCallback }) => {
            successCallback();
        }),
        createComment: jest.fn().mockImplementation(({ successCallback }) => {
            successCallback();
        }),
    })),
);

jest.mock('../Versions', () => {
    return jest.fn().mockImplementation(() => ({
        getVersions: jest.fn(() => mockFirstVersion),
        getVersion: jest.fn(() => mockCurrentVersion),
    }));
});

const MOCK_APP_ACTIVITY_ITEM = {
    activity_template: {
        id: '1',
        type: 'activity_template',
    },
    app: {
        icon_url: 'https://some.cdn.com/12345.png',
        id: '123456',
        name: 'App activities test',
        type: 'app',
    },
    created_by: {
        id: '1234556789876',
        login: 'some-account@box.com',
        name: 'John Doe',
        type: 'user',
    },
    id: '3782',
    occurred_at: '2019-02-21T04:00:00Z',
    rendered_text: 'You shared this file in <a href="https://some-app.com" rel="noreferrer noopener">Some App</a>',
    type: 'app_activity',
};

jest.mock('../AppActivity', () =>
    jest.fn().mockImplementation(() => ({
        getAppActivity: jest.fn().mockReturnValue({
            total_count: 1,
            entries: [MOCK_APP_ACTIVITY_ITEM],
        }),
        deleteAppActivity: jest.fn().mockImplementation(({ successCallback }) => {
            successCallback();
        }),
    })),
);

describe('api/Feed', () => {
    let feed;
    const comments = {
        total_count: 1,
        entries: [
            {
                type: 'comment',
                id: '123',
                created_at: 'Thu Sep 26 33658 19:46:39 GMT-0600 (CST)',
                tagged_message: 'test @[123:Jeezy] @[10:Kanye West]',
                created_by: { name: 'Akon', id: 11 },
            },
        ],
    };

    const tasks = {
        entries: [mockTask],
        limit: 1000,
        next_marker: null,
    };

    const appActivities = {
        total_count: 1,
        entries: [MOCK_APP_ACTIVITY_ITEM],
    };

    const feedItems = [...comments.entries, ...tasks.entries, ...versions.entries, ...appActivities.entries];

    const file = {
        id: '12345',
        permissions: {
            can_comment: true,
        },
        modified_at: 1234567891,
        file_version: {
            id: 987,
        },
        restored_from: {
            id: mockFirstVersion.id,
            type: mockFirstVersion.type,
        },
    };

    const user = { id: 'user1' };
    const fileError = 'Bad box item!';
    const errorCode = 'foo';

    beforeEach(() => {
        feed = new Feed({});
        jest.spyOn(global.console, 'error').mockImplementation();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('getCacheKey()', () => {
        test('should return the cache key', () => {
            expect(feed.getCacheKey('1')).toBe('feedItems_1');
        });
    });

    describe('getCachedItems()', () => {
        beforeEach(() => {
            feed.getCache = jest.fn().mockReturnValue({
                set: jest.fn(),
                get: jest.fn().mockReturnValue(feedItems),
            });
            feed.getCacheKey = jest.fn().mockReturnValue('baz');
        });

        test('should get the cached items', () => {
            const id = '1';
            const result = feed.getCachedItems(id);
            expect(feed.getCacheKey).toHaveBeenCalledWith(id);
            expect(result).toEqual(feedItems);
        });
    });

    describe('setCachedItems()', () => {
        let cache;
        const cacheKey = 'baz';
        beforeEach(() => {
            cache = {
                get: jest.fn().mockRejectedValue(feedItems),
                set: jest.fn(),
            };
            feed.getCache = jest.fn().mockReturnValue(cache);
            feed.getCacheKey = jest.fn().mockReturnValue(cacheKey);
        });

        test('should set the cached items', () => {
            const id = '1';
            feed.setCachedItems(id, feedItems);
            expect(feed.getCacheKey).toHaveBeenCalledWith(id);
            expect(cache.set).toHaveBeenCalledWith(cacheKey, {
                items: feedItems,
                hasError: false,
            });
        });
    });

    describe('feedItems()', () => {
        const sortedItems = [
            ...versionsWithCurrent.entries,
            ...tasks.entries,
            ...comments.entries,
            ...appActivities.entries,
        ];
        let successCb;
        let errorCb;

        beforeEach(() => {
            feed.fetchVersions = jest.fn().mockResolvedValue(versions);
            feed.fetchCurrentVersion = jest.fn().mockResolvedValue(mockCurrentVersion);
            feed.fetchTasksNew = jest.fn().mockResolvedValue(tasks);
            feed.fetchComments = jest.fn().mockResolvedValue(comments);
            feed.fetchAppActivity = jest.fn().mockReturnValue(appActivities);
            feed.setCachedItems = jest.fn();
            feed.versionsAPI = {
                getVersion: jest.fn().mockReturnValue(versions),
                addCurrentVersion: jest.fn().mockReturnValue(versionsWithCurrent),
            };
            successCb = jest.fn();
            errorCb = jest.fn();
            feed.isDestroyed = jest.fn().mockReturnValue(false);
            jest.spyOn(sorter, 'sortFeedItems').mockReturnValue(sortedItems);
        });

        afterEach(() => {
            jest.restoreAllMocks();
        });

        test('should get feed items, sort, save to cache, and call the success callback', done => {
            feed.feedItems(file, false, successCb, errorCb, jest.fn(), { shouldShowAppActivity: true });
            setImmediate(() => {
                expect(feed.versionsAPI.addCurrentVersion).toHaveBeenCalledWith(mockCurrentVersion, versions, file);
                expect(sorter.sortFeedItems).toHaveBeenCalledWith(versionsWithCurrent, comments, tasks, appActivities);
                expect(feed.setCachedItems).toHaveBeenCalledWith(file.id, sortedItems);
                expect(successCb).toHaveBeenCalledWith(sortedItems);
                done();
            });
        });

        test('should get feed items, sort, save to cache, and call the error callback', done => {
            feed.fetchVersions = function fetchVersionsWithError() {
                this.hasError = true;
                return [];
            };

            feed.feedItems(file, false, successCb, errorCb);
            setImmediate(() => {
                expect(errorCb).toHaveBeenCalledWith(sortedItems);
                done();
            });
        });

        test('should use the app activity api if the { shouldShowAppActivity } option in the last argument is true', done => {
            feed.feedItems(file, false, successCb, errorCb, errorCb, { shouldShowAppActivity: true });
            setImmediate(() => {
                expect(feed.fetchAppActivity).toHaveBeenCalled();
                done();
            });
        });

        test('should not use the app activity api if the { shouldShowAppActivity } option in the last argument is false', done => {
            feed.feedItems(file, false, successCb, errorCb, errorCb, { shouldShowAppActivity: false });
            setImmediate(() => {
                expect(feed.fetchAppActivity).not.toHaveBeenCalled();
                done();
            });
        });

        test('should not call success or error callback if it is destroyed', done => {
            feed.isDestroyed = jest.fn().mockReturnValue(true);
            feed.feedItems(file, false, successCb, errorCb);
            setImmediate(() => {
                expect(successCb).not.toHaveBeenCalled();
                expect(errorCb).not.toHaveBeenCalled();
                done();
            });
        });

        test('should return the cached items', () => {
            feed.getCachedItems = jest.fn().mockReturnValue({
                hasError: false,
                items: feedItems,
            });
            feed.feedItems(file, false, successCb, errorCb);
            expect(feed.getCachedItems).toHaveBeenCalledWith(file.id);
            expect(successCb).toHaveBeenCalledWith(feedItems);
        });

        test('should refresh the cache after returning the cached items', done => {
            feed.getCachedItems = jest.fn().mockReturnValue({
                hasError: false,
                items: feedItems,
            });
            feed.feedItems(file, true, successCb, errorCb);
            expect(feed.getCachedItems).toHaveBeenCalledWith(file.id);
            expect(successCb).toHaveBeenCalledTimes(1);
            expect(successCb).toHaveBeenCalledWith(feedItems);

            // refresh cache
            setImmediate(() => {
                expect(successCb).toHaveBeenCalledTimes(2);
                done();
            });
        });
    });

    describe('fetchComments()', () => {
        beforeEach(() => {
            feed.file = file;
            feed.fetchFeedItemErrorCallback = jest.fn();
        });

        test('should return a promise and call the comments api', () => {
            const commentItems = feed.fetchComments();
            expect(commentItems instanceof Promise).toBeTruthy();
            expect(feed.commentsAPI.getComments).toBeCalled();
        });
    });

    describe('Fetching Base Items', () => {
        beforeEach(() => {
            feed.file = file;
            feed.fetchFeedItemErrorCallback = jest.fn();
        });

        describe('fetchVersions()', () => {
            test('should return a promise and call the versions api', () => {
                const versionItems = feed.fetchVersions();
                expect(versionItems instanceof Promise).toBeTruthy();
                expect(feed.versionsAPI.getVersions).toBeCalled();
            });
        });

        describe('fetchCurrentVersion()', () => {
            test('should return a promise and call the versions api', () => {
                const currentVersion = feed.fetchCurrentVersion();
                expect(currentVersion instanceof Promise).toBeTruthy();
                expect(feed.versionsAPI.getVersion).toBeCalled();
            });
        });

        describe('fetchAppActivity()', () => {
            test('should return a promise and call the app activity api', () => {
                const activityItems = feed.fetchAppActivity();
                expect(activityItems instanceof Promise).toBeTruthy();
                expect(feed.appActivityAPI.getAppActivity).toBeCalled();
            });
        });

        describe('fetchTasksNew()', () => {
            test('should return a promise and call the tasks api', () => {
                const taskItems = feed.fetchTasksNew();
                expect(taskItems instanceof Promise).toBeTruthy();
                expect(feed.tasksNewAPI.getTasksForFile).toBeCalled();
            });
        });
    });

    describe('updateTaskCollaborator()', () => {
        beforeEach(() => {
            feed.updateFeedItem = jest.fn();
            feed.updateTaskCollaboratorSuccessCallback = jest.fn();
        });

        test('should throw if no file id', () => {
            expect(() => feed.updateTaskCollaborator({})).toThrow(fileError);
        });
        test('should call the tasks collaborators api and if successful, the success callback', () => {
            feed.updateTaskCollaborator(file);
            expect(feed.taskCollaboratorsAPI.length).toBe(1);
            expect(feed.taskCollaboratorsAPI.pop().updateTaskCollaborator).toBeCalled();
            expect(feed.updateTaskCollaboratorSuccessCallback).toBeCalled();
        });
    });

    describe('updateTaskCollaboratorSuccessCallback()', () => {
        beforeEach(() => {
            feed.getCachedItems = jest.fn().mockReturnValue({
                hasError: false,
                items: feedItems,
            });
            feed.updateFeedItem = jest.fn();
        });

        test('should refresh the task from the server and call the success callback', () => {
            const updatedStatus = 'COMPLETED';
            const successCb = jest.fn();
            const taskId = mockTask.id;
            feed.updateTaskCollaboratorSuccessCallback(
                taskId,
                file,
                {
                    ...tasks.entries[0].assigned_to.entries[0],
                    status: updatedStatus,
                },
                successCb,
            );
            expect(feed.tasksNewAPI.getTask).toBeCalled();
            expect(feed.updateFeedItem).toBeCalledWith({ isPending: false }, taskId);
            expect(successCb).toBeCalled();
        });
    });

    describe('updateTaskNew()', () => {
        beforeEach(() => {
            feed.updateFeedItem = jest.fn();
        });

        test('should throw if no file id', async () => {
            expect.assertions(1);
            const updatedTask = feed.updateTaskNew({});
            await expect(updatedTask).rejects.toEqual(Error(fileError));
        });

        test('should call the error handling when unable to create new task collaborator', async () => {
            const mockErrorCallback = jest.fn();
            const mockSuccessCallback = jest.fn();

            feed.createTaskCollaborator = jest.fn().mockRejectedValue(new Error('forced rejection'));
            feed.deleteTaskCollaborator = jest.fn().mockResolvedValue();

            const task = {
                id: '1',
                description: 'updated description',
                addedAssignees: [
                    {
                        type: 'user',
                        id: '3086276240',
                        name: 'Test User',
                        login: 'testuser@foo.com',
                    },
                ],
                removedAssignees: [
                    {
                        type: 'task_collaborator',
                        id: '19283765',
                        target: { type: 'user', id: '19283765', name: 'remove Test User', login: 'testuser@foo.com' },
                        role: 'ASSIGNEE',
                        permissions: {
                            can_delete: true,
                            can_update: true,
                        },
                        status: 'incomplete',
                    },
                ],
            };

            feed.updateTaskNew(file, task, mockSuccessCallback, mockErrorCallback);

            await new Promise(r => setTimeout(r, 0));

            expect(feed.tasksNewAPI.updateTask).not.toBeCalled();
            expect(feed.tasksNewAPI.getTask).not.toBeCalled();
            expect(feed.deleteTaskCollaborator).not.toBeCalled();
            expect(feed.updateFeedItem).toBeCalled();
            expect(mockErrorCallback).toBeCalled();
        });

        test('should call the error handling when unable to delete existing task collaborator', async () => {
            const mockErrorCallback = jest.fn();
            const mockSuccessCallback = jest.fn();
            feed.deleteTaskCollaborator = jest.fn().mockRejectedValue(new Error('forced rejection'));

            const task = {
                id: '1',
                description: 'updated description',
                addedAssignees: [
                    {
                        type: 'user',
                        id: '3086276240',
                        name: 'Test User',
                        login: 'testuser@foo.com',
                    },
                ],
                removedAssignees: [
                    {
                        type: 'task_collaborator',
                        id: '19283765',
                        target: { type: 'user', id: '19283765', name: 'remove Test User', login: 'testuser@foo.com' },
                        role: 'ASSIGNEE',
                        permissions: {
                            can_delete: true,
                            can_update: true,
                        },
                        status: 'incomplete',
                    },
                ],
            };

            feed.updateTaskNew(file, task, mockSuccessCallback, mockErrorCallback);

            await new Promise(r => setTimeout(r, 0));

            expect(feed.tasksNewAPI.updateTask).toBeCalled();
            expect(feed.tasksNewAPI.getTask).toBeCalled();
            expect(feed.updateFeedItem).toBeCalled();
            expect(mockErrorCallback).toBeCalled();
        });

        test('should call the new task api and if successful, the success callback', async () => {
            const successCallback = jest.fn();
            const task = {
                id: '1',
                description: 'updated description',
                addedAssignees: [],
                removedAssignees: [],
            };
            feed.updateTaskNew(file, task, successCallback, jest.fn());
            expect(feed.file.id).toBe(file.id);

            // push a new promise to trigger the promises in updateTaskNew
            await new Promise(r => setTimeout(r, 0));

            expect(feed.tasksNewAPI.updateTask).toBeCalled();
            expect(feed.tasksNewAPI.getTask).toBeCalled();
            expect(feed.updateFeedItem).toBeCalledTimes(2);
            expect(successCallback).toBeCalled();
        });

        test('should call the appropriate new task APIs when adding new assignees', async () => {
            const successCallback = jest.fn();
            const task = {
                id: '1',
                description: 'updated description',
                addedAssignees: [
                    {
                        type: 'user',
                        id: '3086276240',
                        name: 'Test User',
                        login: 'testuser@foo.com',
                    },
                ],
                removedAssignees: [
                    {
                        type: 'task_collaborator',
                        id: '19283765',
                        target: { type: 'user', id: '19283765', name: 'remove Test User', login: 'testuser@foo.com' },
                        role: 'ASSIGNEE',
                        permissions: {
                            can_delete: true,
                            can_update: true,
                        },
                        status: 'incomplete',
                    },
                ],
            };

            feed.updateTaskNew(file, task, successCallback, jest.fn());

            await new Promise(r => setTimeout(r, 0));

            expect(feed.tasksNewAPI.updateTask).toBeCalled();
            expect(feed.updateFeedItem).toBeCalled();
            expect(successCallback).toBeCalled();
        });
    });

    describe('updateComment()', () => {
        beforeEach(() => {
            feed.updateFeedItem = jest.fn();
        });

        test('should throw if no file id', () => {
            expect(() => feed.updateComment({})).toThrow(fileError);
        });

        test('should call the comments api and update the feed items', () => {
            const successCallback = jest.fn();
            const comment = {
                id: '1',
                tagged_message: 'updated message',
                message: 'update message',
                permissions: { can_edit: true },
            };
            feed.updateComment(file, comment.id, comment.text, true, comment.permmissions, successCallback, jest.fn());
            expect(feed.updateFeedItem).toBeCalled();
            expect(successCallback).toBeCalled();
        });
    });

    describe('deleteComment()', () => {
        beforeEach(() => {
            feed.updateFeedItem = jest.fn();
            feed.deleteFeedItem = jest.fn();
        });

        test('should throw if no file id', () => {
            expect(() => feed.deleteComment({})).toThrow(fileError);
        });

        test('should call the comments api and if successful, the success callback', () => {
            feed.deleteComment(file);
            expect(feed.commentsAPI.deleteComment).toBeCalled();
            expect(feed.deleteFeedItem).toBeCalled();
        });
    });

    describe('deleteCommentErrorCallback()', () => {
        const e = new Error('foo');

        beforeEach(() => {
            feed.updateFeedItem = jest.fn();
            feed.createFeedError = jest.fn().mockReturnValue(error);
            feed.feedErrorCallback = jest.fn();
        });

        test('should update the feed item and call the error callback', () => {
            const commentId = '1';
            feed.deleteCommentErrorCallback(e, errorCode, commentId);
            expect(feed.updateFeedItem).toBeCalledWith(error, commentId);
            expect(feed.feedErrorCallback).toBeCalledWith(true, e, errorCode);
        });
    });

    describe('deleteAppActivity()', () => {
        beforeEach(() => {
            feed.updateFeedItem = jest.fn();
            feed.deleteFeedItem = jest.fn();
        });

        test('should throw if no file id', () => {
            expect(() => feed.deleteAppActivity({})).toThrow(fileError);
        });

        test('should call the app activity api and if successful, the success callback', () => {
            const activityItemId = '12345';
            feed.deleteAppActivity(file, activityItemId);
            expect(feed.appActivityAPI.deleteAppActivity).toBeCalled();
            expect(feed.deleteFeedItem).toBeCalled();
        });
    });

    describe('deleteTaskNew()', () => {
        beforeEach(() => {
            feed.updateFeedItem = jest.fn();
            feed.deleteFeedItem = jest.fn();
        });

        test('should throw if no file id', () => {
            expect(() => feed.deleteTaskNew({})).toThrow(fileError);
        });

        test('should call the new task api and if successful, the success callback', () => {
            feed.deleteTaskNew(file, { id: '1' });
            expect(feed.file.id).toBe(file.id);
            expect(feed.tasksNewAPI.deleteTask).toBeCalled();
            expect(feed.deleteFeedItem).toBeCalled();
        });
    });

    describe('deleteFeedItem()', () => {
        let successCb;
        const feedItemId = feedItems[0].id;
        beforeEach(() => {
            feed.setCachedItems = jest.fn();
            feed.file = file;
            successCb = jest.fn();
        });

        test('should delete the feed item and call success callback', () => {
            feed.getCachedItems = jest.fn().mockReturnValue({
                hasError: false,
                items: feedItems,
            });
            feed.deleteFeedItem(feedItemId, successCb);
            expect(feed.setCachedItems.mock.calls[0][1].length).toBe(feedItems.length - 1);
            expect(successCb).toBeCalled();
        });

        test('not call the success callback', () => {
            feed.isDestroyed = jest.fn().mockReturnValue(true);
            feed.deleteFeedItem(feedItemId, successCb);
            expect(successCb).not.toBeCalled();
        });
    });

    describe('feedErrorCallback()', () => {
        const code = 'foo';
        const e = new Error('bar');

        beforeEach(() => {
            jest.spyOn(global.console, 'error').mockImplementation();
            feed.errorCallback = jest.fn();
        });

        afterEach(() => {
            jest.restoreAllMocks();
        });

        test('should log the error and set the hasError property if its not destroyed and hasError is set to true', () => {
            const hasError = true;
            feed.feedErrorCallback(hasError, e, code);
            expect(global.console.error).toBeCalledWith(e);
            expect(feed.hasError).toBe(true);
            expect(feed.errorCallback).toHaveBeenCalledWith(e, code, {
                error: e,
                [IS_ERROR_DISPLAYED]: hasError,
            });
        });

        test('should call the error callback with the value of hasError', () => {
            const hasError = false;
            feed.feedErrorCallback(hasError, e, code);
            expect(feed.errorCallback).toHaveBeenCalledWith(e, code, {
                error: e,
                [IS_ERROR_DISPLAYED]: hasError,
            });
        });

        test('should set hasError only if hasError is set', () => {
            feed.hasError = null;
            expect(feed.hasError).toBe(null);
            const hasError = false;
            feed.feedErrorCallback(hasError, e, code);
            expect(feed.hasError).toBe(null);
            feed.feedErrorCallback(true, e, code);
            expect(feed.hasError).toBe(true);
        });
    });

    describe('addPendingItem()', () => {
        const itemBase = {
            my_prop: 'yay',
        };

        beforeEach(() => {
            feed.file = file;
            feed.setCachedItems = jest.fn();
        });
        test('should create an item and add it to the feed with empty cache', () => {
            feed.getCachedItems = jest.fn();

            const item = feed.addPendingItem(file.id, user, itemBase);

            expect(typeof item.created_at).toBe('string');
            expect(item.created_by).toBe(user);
            expect(typeof item.modified_at).toBe('string');
            expect(item.isPending).toBe(true);
            expect(feed.setCachedItems).toBeCalledWith(file.id, [item]);
        });

        test('should create an item and add it to the feed with populated cache', () => {
            feed.getCachedItems = jest.fn().mockReturnValue({
                hasError: false,
                items: feedItems,
            });

            const item = feed.addPendingItem(file.id, user, itemBase);
            expect(feed.setCachedItems).toBeCalledWith(file.id, [...feedItems, item]);
        });
    });

    describe('createCommentSuccessCallback()', () => {
        let successCb;
        beforeEach(() => {
            feed.updateFeedItem = jest.fn();
            successCb = jest.fn();
        });

        test('should assign tagged_message of the comment with tagged_message value if it exists', () => {
            const id = '0987654321';
            const commentData = { tagged_message: 'yay' };
            feed.createCommentSuccessCallback(commentData, id, successCb);
            expect(feed.updateFeedItem).toBeCalledWith(
                {
                    ...commentData,
                    isPending: false,
                },
                id,
            );
            expect(successCb).toBeCalled();
        });

        test('should assign tagged_message of the comment with message value if it exists', () => {
            const id = '0987654321';
            const commentData = { message: 'yay' };
            feed.createCommentSuccessCallback(commentData, id, successCb);
            expect(feed.updateFeedItem).toBeCalledWith(
                {
                    ...commentData,
                    isPending: false,
                },
                id,
            );
        });

        test('should not invoke success callback if destroyed', () => {
            const id = '0987654321';
            const commentData = { message: 'yay' };
            feed.isDestroyed = jest.fn().mockReturnValue(true);
            feed.createCommentSuccessCallback(commentData, id, successCb);
            expect(successCb).not.toBeCalled();
        });
    });

    describe('createFeedError()', () => {
        test('should create a feed error with the message and title', () => {
            const feedError = feed.createFeedError('foo', 'bar');
            expect(feedError).toEqual({
                error: {
                    message: 'foo',
                    title: 'bar',
                },
            });
        });

        test('should create a feed error with the message and default title', () => {
            const feedError = feed.createFeedError('foo');
            expect(feedError).toEqual({
                error: {
                    message: 'foo',
                    title: commonMessages.errorOccured,
                },
            });
        });
    });

    describe('updateFeedItem()', () => {
        const { id } = comments.entries[0];
        const updates = {
            foo: 'bar',
            id: 'foo',
        };

        beforeEach(() => {
            feed.setCachedItems = jest.fn();
            feed.getCachedItems = jest.fn().mockReturnValue({
                hasError: false,
                items: feedItems,
            });
        });

        test('should throw if no file id', () => {
            feed.file = {};
            expect(() => feed.updateFeedItem({}, id)).toThrow(fileError);
        });

        test('should update the cache with the updated item', () => {
            feed.file = file;
            const updatedFeedItems = feed.updateFeedItem(updates, id);
            expect(updatedFeedItems).not.toBeNull();
            expect(feed.setCachedItems).toBeCalledWith(file.id, updatedFeedItems);
        });
    });

    describe('createComment()', () => {
        let successCb;
        let errorCb;
        const currentUser = {
            id: 'bar',
        };
        const text = 'textfoo';
        const hasMention = true;

        beforeEach(() => {
            successCb = jest.fn();
            errorCb = jest.fn();
            feed.addPendingItem = jest.fn();
            feed.createCommentSuccessCallback = jest.fn();
            feed.createCommentErrorCallback = jest.fn();
            feed.createFeedError = jest.fn().mockReturnValue('foo');
        });

        test('should throw if no file id', () => {
            expect(() => feed.createComment({}, currentUser, text, true, successCb, errorCb)).toThrow(fileError);
        });

        test('should create a pending item', () => {
            feed.createComment(file, currentUser, text, true, successCb, errorCb);

            expect(feed.addPendingItem).toBeCalledWith(file.id, currentUser, {
                id: 'uniqueId',
                tagged_message: text,
                type: 'comment',
            });
        });

        test('should create the comment and invoke the success callback', done => {
            feed.createComment(file, currentUser, text, hasMention, successCb, errorCb);
            setImmediate(() => {
                expect(feed.commentsAPI.createComment).toBeCalled();
                expect(feed.createCommentSuccessCallback).toBeCalled();
                expect(feed.createCommentErrorCallback).not.toBeCalled();
                done();
            });
        });
    });

    describe('createCommentErrorCallback()', () => {
        const message = 'foo';
        const id = 'uniqueId';
        beforeEach(() => {
            feed.updateFeedItem = jest.fn();
            feed.createFeedError = jest.fn().mockReturnValue(message);
            feed.feedErrorCallback = jest.fn();
        });

        test('should invoke update the feed item with an AF error and call the success callback', () => {
            const e = { status: 409 };
            feed.createCommentErrorCallback(e, errorCode, id);
            expect(feed.createFeedError).toBeCalledWith(messages.commentCreateConflictMessage);
            expect(feed.updateFeedItem).toBeCalledWith(message, id);
            expect(feed.feedErrorCallback).toHaveBeenCalledWith(false, e, errorCode);
        });

        test('should invoke update the feed item with an AF error', () => {
            const e = { status: 500 };
            feed.isDestroyed = jest.fn().mockReturnValue(true);
            feed.createCommentErrorCallback(e, errorCode, id);
            expect(feed.createFeedError).toBeCalledWith(messages.commentCreateErrorMessage);
            expect(feed.updateFeedItem).toBeCalledWith(message, id);
        });
    });

    describe('destroy()', () => {
        let commentFn;
        let versionFn;
        let taskFn;

        beforeEach(() => {
            commentFn = jest.fn();
            versionFn = jest.fn();
            taskFn = jest.fn();

            feed.tasksNewAPI = {
                destroy: taskFn,
            };
            feed.versionsAPI = {
                destroy: versionFn,
            };
            feed.commentsAPI = {
                destroy: commentFn,
            };
        });

        test('should destroy the APIs', () => {
            feed.destroy();
            expect(versionFn).toBeCalled();
            expect(commentFn).toBeCalled();
            expect(taskFn).toBeCalled();
        });
    });

    describe('fetchFeedItemErrorCallback()', () => {
        let errorCb;
        const code = 'foo';
        const e = new Error('bar');

        beforeEach(() => {
            feed.feedErrorCallback = jest.fn();
            errorCb = jest.fn();
        });

        afterEach(() => {
            jest.restoreAllMocks();
        });

        test('should call the error callback if error is internal server error', () => {
            const shouldDisplayError = true;
            jest.spyOn(error, 'isUserCorrectableError').mockReturnValue(shouldDisplayError);
            feed.fetchFeedItemErrorCallback(errorCb, e, code);
            expect(feed.feedErrorCallback).toHaveBeenCalledWith(shouldDisplayError, e, code);
        });

        test('should not call the error callback if error is forbidden or another error', () => {
            const shouldDisplayError = false;
            jest.spyOn(error, 'isUserCorrectableError').mockReturnValue(shouldDisplayError);
            feed.fetchFeedItemErrorCallback(errorCb, e, code);
            expect(feed.feedErrorCallback).toHaveBeenCalledWith(shouldDisplayError, e, code);
        });
    });
});
