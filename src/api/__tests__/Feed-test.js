import Feed from '../Feed';
import messages from '../../components/messages';

jest.mock('lodash/uniqueId', () => () => 'uniqueId');

jest.mock('../Tasks', () => {
    const task = {
        type: 'task',
        id: '1234',
        created_at: 'Thu Sep 25 33658 19:45:39 GMT-0600 (CST)',
        modified_at: 'Thu Sep 25 33658 19:46:39 GMT-0600 (CST)',
        tagged_message: 'test',
        modified_by: { name: 'Jay-Z', id: 10 },
        dueAt: 1234567891,
        task_assignment_collection: {
            entries: [{ assigned_to: { name: 'Akon', id: 11 } }],
            total_count: 1
        }
    };

    return jest.fn().mockImplementation(() => ({
        updateTask: jest.fn().mockImplementation(({ successCallback }) => {
            successCallback();
        }),
        createTask: jest.fn().mockImplementation(({ successCallback }) => {
            successCallback();
        }),
        deleteTask: jest.fn().mockImplementation(({ successCallback }) => {
            successCallback();
        }),
        get: jest.fn().mockReturnValue(task),
        getAssignments: jest.fn().mockImplementation((id, taskId, successCallback) => {
            successCallback({
                total_count: 1,
                entries: [
                    {
                        type: 'task_assignment',
                        id: '48714317',
                        assigned_to: {
                            type: 'user',
                            id: '3086276240',
                            name: 'Daniel DeMicco',
                            login: 'ddemicco@box.com'
                        },
                        resolution_state: 'incomplete',
                        message: 'Completed'
                    }
                ]
            });
        })
    }));
});

jest.mock('../TaskAssignments', () =>
    jest.fn().mockImplementation(() => ({
        updateTaskAssignment: jest.fn().mockImplementation(({ successCallback }) => {
            successCallback();
        }),
        createTaskAssignment: jest.fn().mockImplementation(({ successCallback }) => {
            successCallback();
        })
    }))
);

jest.mock('../Comments', () =>
    jest.fn().mockImplementation(() => ({
        offsetGet: jest.fn().mockReturnValue({
            total_count: 1,
            entries: [
                {
                    type: 'comment',
                    id: '123',
                    created_at: 'Thu Sep 26 33658 19:46:39 GMT-0600 (CST)',
                    tagged_message: 'test @[123:Jeezy] @[10:Kanye West]',
                    created_by: { name: 'Akon', id: 11 }
                }
            ]
        }),
        deleteComment: jest.fn().mockImplementation(({ successCallback }) => {
            successCallback();
        }),
        createComment: jest.fn().mockImplementation(({ successCallback }) => {
            successCallback();
        })
    }))
);

jest.mock('../Versions', () =>
    jest.fn().mockImplementation(() => ({
        offsetGet: jest.fn().mockReturnValue({
            total_count: 1,
            entries: [
                {
                    action: 'upload',
                    type: 'file_version',
                    id: 123,
                    created_at: 'Thu Sep 20 33658 19:45:39 GMT-0600 (CST)',
                    trashed_at: 1234567891,
                    modified_at: 1234567891,
                    modified_by: { name: 'Akon', id: 11 }
                }
            ]
        })
    }))
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
                created_by: { name: 'Akon', id: 11 }
            }
        ]
    };
    const tasks = {
        total_count: 1,
        entries: [
            {
                type: 'task',
                id: '1234',
                created_at: 'Thu Sep 25 33658 19:45:39 GMT-0600 (CST)',
                modified_at: 'Thu Sep 25 33658 19:46:39 GMT-0600 (CST)',
                tagged_message: 'test',
                modified_by: { name: 'Jay-Z', id: 10 },
                dueAt: 1234567891,
                task_assignment_collection: {
                    entries: [{ assigned_to: { name: 'Akon', id: 11 } }],
                    total_count: 1
                }
            }
        ]
    };
    const taskAssignments = {
        total_count: 1,
        entries: [
            {
                type: 'task_assignment',
                id: '48714317',
                assigned_to: { type: 'user', id: '3086276240', name: 'Daniel DeMicco', login: 'ddemicco@box.com' },
                resolution_state: 'incomplete',
                message: 'Completed'
            }
        ]
    };
    const first_version = {
        action: 'upload',
        type: 'file_version',
        id: 123,
        created_at: 'Thu Sep 20 33658 19:45:39 GMT-0600 (CST)',
        trashed_at: 1234567891,
        modified_at: 1234567891,
        modified_by: { name: 'Akon', id: 11 }
    };

    const deleted_version = {
        action: 'delete',
        type: 'file_version',
        id: 234,
        created_at: 'Thu Sep 20 33658 19:45:39 GMT-0600 (CST)',
        trashed_at: 1234567891,
        modified_at: 1234567891,
        modified_by: { name: 'Akon', id: 11 }
    };

    const versions = {
        total_count: 1,
        entries: [first_version, deleted_version]
    };

    const feedItems = [...comments.entries, ...tasks.entries, ...versions.entries];

    const file = {
        id: '12345',
        permissions: {
            can_comment: true
        },
        modified_at: 1234567891,
        file_version: {
            id: 987
        },
        restored_from: {
            id: first_version.id,
            type: first_version.type
        }
    };

    const user = { id: 'user1' };

    const fileError = 'Bad box item!';

    beforeEach(() => {
        feed = new Feed({});
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
                get: jest.fn().mockReturnValue(feedItems)
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
                set: jest.fn()
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
                hasError: false
            });
        });
    });

    describe('feedItems', () => {
        const sortedItems = [...versions.entries, ...tasks.entries, ...comments.entries];
        let successCb;
        let errorCb;

        beforeEach(() => {
            feed.fetchVersions = jest.fn().mockResolvedValue(versions);
            feed.fetchTasks = jest.fn().mockResolvedValue(tasks);
            feed.fetchComments = jest.fn().mockResolvedValue(comments);
            feed.addRestoredVersion = jest.fn().mockReturnValue(versions);
            feed.sortFeedItems = jest.fn().mockReturnValue(sortedItems);
            feed.setCachedItems = jest.fn();
            successCb = jest.fn();
            errorCb = jest.fn();
            feed.isDestroyed = jest.fn().mockReturnValue(false);
        });

        test('should get feed items, sort, save to cache, and call the success callback', (done) => {
            feed.feedItems(file, successCb, errorCb);
            setImmediate(() => {
                expect(feed.sortFeedItems).toHaveBeenCalledWith(versions, comments, tasks);
                expect(feed.setCachedItems).toHaveBeenCalledWith(file.id, sortedItems);
                expect(successCb).toHaveBeenCalledWith(sortedItems);
                done();
            });
        });

        test('should get feed items, sort, save to cache, and call the error callback', (done) => {
            feed.fetchVersions = function fetchVersionsWithError() {
                this.hasError = true;
                return [];
            };

            feed.feedItems(file, successCb, errorCb);
            setImmediate(() => {
                expect(errorCb).toHaveBeenCalledWith(sortedItems);
                done();
            });
        });

        test('should not call success or error callback if it is destroyed', (done) => {
            feed.isDestroyed = jest.fn().mockReturnValue(true);
            feed.feedItems(file, successCb, errorCb);
            setImmediate(() => {
                expect(successCb).not.toHaveBeenCalled();
                expect(errorCb).not.toHaveBeenCalled();
                done();
            });
        });

        test('should throw if no file id', () => {
            expect(() => feed.feedItems({}, successCb, errorCb)).toThrow(fileError);
        });

        test('should return the cached items', () => {
            feed.getCachedItems = jest.fn().mockReturnValue({
                hasError: false,
                items: feedItems
            });
            feed.feedItems(file, successCb, errorCb);
            expect(feed.getCachedItems).toHaveBeenCalledWith(file.id);
            expect(successCb).toHaveBeenCalledWith(feedItems);
        });
    });

    describe('sortFeedItems()', () => {
        test('should sort items based on date', () => {
            const sorted = feed.sortFeedItems(comments, tasks);
            expect(sorted[0].id).toEqual(comments.entries[0].id);
            expect(sorted[1].id).toEqual(tasks.entries[0].id);
        });
    });

    describe('fetchComments()', () => {
        test('should return a promise and call the comments api', () => {
            const commentItems = feed.fetchComments();
            expect(commentItems instanceof Promise).toBeTruthy();
            expect(feed.commentsAPI.offsetGet).toBeCalled();
        });
    });

    describe('fetchVersions()', () => {
        test('should return a promise and call the versions api', () => {
            const versionItems = feed.fetchVersions();
            expect(versionItems instanceof Promise).toBeTruthy();
            expect(feed.versionsAPI.offsetGet).toBeCalled();
        });
    });

    describe('fetchTasks()', () => {
        test('should return a promise and call the tasks api', () => {
            const taskItems = feed.fetchTasks();
            expect(taskItems instanceof Promise).toBeTruthy();
            expect(feed.tasksAPI.get).toBeCalled();
        });
    });

    describe('updateTaskAssignment()', () => {
        beforeEach(() => {
            feed.updateFeedItem = jest.fn();
            feed.updateTaskAssignmentSuccessCallback = jest.fn();
        });

        test('should throw if no file id', () => {
            expect(() => feed.updateTaskAssignment({})).toThrow(fileError);
        });
        test('should call the tasks assignments api and if successful, the success callback', () => {
            feed.updateTaskAssignment(file);
            expect(feed.taskAssignmentsAPI.length).toBe(1);
            expect(feed.taskAssignmentsAPI.pop().updateTaskAssignment).toBeCalled();
            expect(feed.updateTaskAssignmentSuccessCallback).toBeCalled();
        });
    });

    describe('updateTaskAssignmentSuccessCallback()', () => {
        beforeEach(() => {
            feed.getCachedItems = jest.fn().mockReturnValue({
                hasError: false,
                items: feedItems
            });
            feed.updateFeedItem = jest.fn();
        });

        test('should update the resolution state and call the success callback', () => {
            const updatedState = 'completed';
            const successCb = jest.fn();
            const taskId = '1234';
            feed.updateTaskAssignmentSuccessCallback(
                taskId,
                {
                    ...tasks.entries[0].task_assignment_collection.entries[0],
                    message: updatedState
                },
                successCb
            );
            expect(feed.updateFeedItem.mock.calls[0][0].task_assignment_collection.entries[0].resolution_state).toBe(
                updatedState
            );
            expect(successCb).toBeCalled();
        });
    });

    describe('updateTask()', () => {
        beforeEach(() => {
            feed.updateFeedItem = jest.fn();
            feed.updateTaskSuccessCallback = jest.fn();
        });

        test('should throw if no file id', () => {
            expect(() => feed.updateTask({})).toThrow(fileError);
        });
        test('should call the tasks api and if successful, the success callback', () => {
            feed.updateTask(file);
            expect(feed.tasksAPI.updateTask).toBeCalled();
            expect(feed.updateTaskSuccessCallback).toBeCalled();
        });
    });

    describe('updateTaskErrorCallback()', () => {
        let errorCb;
        beforeEach(() => {
            feed.errorCallback = jest.fn();
            errorCb = jest.fn();
        });

        test('should call the error callback', () => {
            feed.updateTaskErrorCallback(tasks.entries[0], errorCb);
            expect(errorCb).toBeCalled();
        });

        test('should not call the error callback', () => {
            feed.isDestroyed = jest.fn().mockReturnValue(true);
            feed.updateTaskErrorCallback(tasks.entries[0], errorCb);
            expect(errorCb).not.toBeCalled();
        });
    });

    describe('updateTaskSuccessCallback()', () => {
        let successCb;
        beforeEach(() => {
            feed.errorCallback = jest.fn();
            feed.updateFeedItem = jest.fn();
            successCb = jest.fn();
        });

        test('should call the success callback', () => {
            const task = tasks.entries[0];
            feed.updateTaskSuccessCallback(task, successCb);
            const { task_assignment_collection, ...rest } = task;
            expect(feed.updateFeedItem).toBeCalledWith(
                {
                    ...rest,
                    isPending: false
                },
                task.id
            );
            expect(successCb).toBeCalled();
        });

        test('should not call the success callback', () => {
            feed.isDestroyed = jest.fn().mockReturnValue(true);
            feed.updateTaskSuccessCallback(tasks.entries[0], successCb);
            expect(successCb).not.toBeCalled();
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
        const error = 'foo';
        let errorCb;
        beforeEach(() => {
            feed.updateFeedItem = jest.fn();
            feed.createFeedError = jest.fn().mockReturnValue(error);
            errorCb = jest.fn();
        });

        test('should update the feed item and call the error callback', () => {
            const commentId = '1';
            feed.deleteCommentErrorCallback(commentId, errorCb);
            expect(feed.updateFeedItem).toBeCalledWith(error, commentId);
            expect(errorCb).toBeCalled();
        });

        test('should not call the error callback', () => {
            feed.isDestroyed = jest.fn().mockReturnValue(true);
            expect(errorCb).not.toBeCalled();
        });
    });

    describe('createTaskSuccessCallback()', () => {
        let successCb;
        let errorCb;
        const assignees = ['foo', 'bar'];
        beforeEach(() => {
            feed.appendAssignmentsToTask = jest.fn();
            feed.updateFeedItem = jest.fn();
            successCb = jest.fn();
            errorCb = jest.fn();
        });

        test('should throw if no file id', () => {
            expect(() => feed.createTaskSuccessCallback()).toThrow(fileError);
        });

        test('should call the success callback', (done) => {
            feed.createTaskAssignment = jest.fn().mockResolvedValue('foo');
            feed.createTaskSuccessCallback(file, 'generated', tasks.entries[0], assignees, successCb, errorCb);
            setImmediate(() => {
                expect(feed.createTaskAssignment).toHaveBeenCalledTimes(assignees.length);
                expect(feed.updateFeedItem).toBeCalled();
                expect(successCb).toBeCalled();
                done();
            });
        });

        test('should call the error callback', (done) => {
            feed.createTaskAssignment = jest.fn().mockRejectedValue('bar');
            feed.createTaskSuccessCallback(file, 'generated', tasks.entries[0], assignees, successCb, errorCb);
            setImmediate(() => {
                expect(feed.createTaskAssignment).toHaveBeenCalledTimes(assignees.length);
                expect(errorCb).toBeCalled();
                done();
            });
        });
    });

    describe('createTask()', () => {
        let successCb;
        let errorCb;
        const message = 'foo';
        const assignees = [{ id: '1234', name: 'A. User' }];
        const currentUser = 'user1';
        beforeEach(() => {
            feed.addPendingItem = jest.fn();
            feed.createTaskSuccessCallback = jest.fn();
            successCb = jest.fn();
            errorCb = jest.fn();
        });

        test('should throw if no file id', () => {
            expect(() => feed.createTask({})).toThrow(fileError);
        });

        test('should call the tasks api and if successful, the success callback', () => {
            feed.createTask(file, currentUser, message, assignees, null, successCb, errorCb);
            expect(feed.addPendingItem).toBeCalledWith(file.id, currentUser, {
                id: 'uniqueId',
                is_completed: false,
                message,
                task_assignment_collection: {
                    entries: [{ assigned_to: assignees[0], resolution_state: 'incomplete' }],
                    total_count: 1
                },
                type: 'task'
            });
            expect(feed.tasksAPI.createTask).toBeCalled();
            expect(feed.createTaskSuccessCallback).toBeCalled();
        });

        test('should set the due at string', () => {
            const dueAt = 123456;
            const dueDateString = new Date(dueAt).toISOString();
            feed.createTask(file, currentUser, message, assignees, dueAt, successCb, errorCb);
            expect(feed.addPendingItem).toBeCalledWith(file.id, currentUser, {
                due_at: dueDateString,
                id: 'uniqueId',
                is_completed: false,
                message,
                task_assignment_collection: {
                    entries: [{ assigned_to: assignees[0], resolution_state: 'incomplete' }],
                    total_count: 1
                },
                type: 'task'
            });
        });
    });

    describe('createTaskAssignment()', () => {
        let errorCb;
        beforeEach(() => {
            feed.updateFeedItem = jest.fn();
            feed.deleteFeedItem = jest.fn();
            errorCb = jest.fn();
        });

        test('should throw if no file id', () => {
            expect(() => feed.deleteComment({})).toThrow(fileError);
        });

        test('should call the task assignment api and if successful, resolve', (done) => {
            const promise = feed.createTaskAssignment(file, tasks.entries[0], 'foo', errorCb);
            expect(feed.id).toBe(file.id);
            expect(promise instanceof Promise).toBeTruthy();
            expect(feed.taskAssignmentsAPI[0].createTaskAssignment).toBeCalled();
            promise.then(() => {
                done();
            });
        });
    });

    describe('createTaskAssignmentErrorCallback()', () => {
        let errorCb;
        beforeEach(() => {
            feed.errorCallback = jest.fn();
            feed.deleteTask = jest.fn();
            errorCb = jest.fn();
        });

        test('should call generic error callback, delete feed item', () => {
            feed.createTaskAssignmentErrorCallback('foo', file, tasks.entries[0], errorCb);
            expect(feed.errorCallback).toBeCalled();
            expect(feed.deleteTask).toBeCalled();
            expect(errorCb).toBeCalled();
        });
    });

    describe('deleteTask()', () => {
        beforeEach(() => {
            feed.updateFeedItem = jest.fn();
            feed.deleteFeedItem = jest.fn();
        });

        test('should throw if no file id', () => {
            expect(() => feed.deleteTask({})).toThrow(fileError);
        });

        test('should call the comments api and if successful, the success callback', () => {
            feed.deleteTask(file, '1');
            expect(feed.id).toBe(file.id);
            expect(feed.tasksAPI.deleteTask).toBeCalled();
            expect(feed.deleteFeedItem).toBeCalled();
        });
    });

    describe('deleteFeedItem()', () => {
        let successCb;
        const feedItemId = feedItems[0].id;
        beforeEach(() => {
            feed.setCachedItems = jest.fn();
            feed.id = file.id;
            successCb = jest.fn();
        });

        test('should delete the feed item and call success callback', () => {
            feed.getCachedItems = jest.fn().mockReturnValue({
                hasError: false,
                items: feedItems
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

    describe('errorCallback()', () => {
        beforeEach(() => {
            global.console.error = jest.fn();
        });

        afterEach(() => {
            global.console.error.mockRestore();
        });

        test('should log the error and set the hasError property', () => {
            const e = 'foo error';
            feed.errorCallback(e);
            expect(global.console.error).toBeCalledWith(e);
            expect(feed.hasError).toBe(true);
        });
    });

    describe('fetchTaskAssignments()', () => {
        const tasksEntriesWithAssignments = {
            ...tasks.entries[0],
            task_assignment_collection: {
                ...taskAssignments
            }
        };
        beforeEach(() => {
            feed.appendAssignmentsToTask = jest.fn().mockReturnValue(tasksEntriesWithAssignments);
            feed.errorCallback = jest.fn();
        });

        test('should fetch the task assignments', (done) => {
            feed.fetchTaskAssignments(tasks).then((tasksWithAssignments) => {
                expect(feed.taskAssignmentsAPI.pop().getAssignments).toHaveBeenCalledTimes(tasks.entries.length);
                expect(feed.appendAssignmentsToTask).toHaveBeenCalledTimes(tasks.entries.length);
                expect(tasksWithAssignments).toEqual({
                    ...tasks,
                    entries: [tasksEntriesWithAssignments]
                });

                done();
            });
        });
    });

    describe('appendAssignmentsToTask()', () => {
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

            const result = feed.appendAssignmentsToTask(task, assignments);
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

            const result = feed.appendAssignmentsToTask(task, assignments);
            expect(result.task_assignment_collection.total_count).toBe(1);
            expect(result).toEqual(expectedResult);
        });
    });

    describe('addPendingItem()', () => {
        const itemBase = {
            my_prop: 'yay'
        };

        beforeEach(() => {
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
                items: feedItems
            });

            const item = feed.addPendingItem(file.id, user, itemBase);
            expect(feed.setCachedItems).toBeCalledWith(file.id, [item, ...feedItems]);
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
                    isPending: false
                },
                id
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
                    isPending: false
                },
                id
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
                    title: 'bar'
                }
            });
        });

        test('should create a feed error with the message and default title', () => {
            const feedError = feed.createFeedError('foo');
            expect(feedError).toEqual({
                error: {
                    message: 'foo',
                    title: messages.errorOccured
                }
            });
        });
    });

    describe('updateFeedItem()', () => {
        const { id } = comments.entries[0];
        const updates = {
            foo: 'bar',
            id: 'foo'
        };

        beforeEach(() => {
            feed.setCachedItems = jest.fn();
            feed.getCachedItems = jest.fn().mockReturnValue({
                hasError: false,
                items: feedItems
            });
        });

        test('should throw if no file id', () => {
            expect(() => feed.updateFeedItem({}, id)).toThrow(fileError);
        });

        test('should update the cache with the updated item', () => {
            feed.id = file.id;
            const updatedFeedItems = feed.updateFeedItem(updates, id);
            expect(updatedFeedItems).not.toBeNull();
            expect(feed.setCachedItems).toBeCalledWith(file.id, updatedFeedItems);
        });
    });

    describe('createComment()', () => {
        let successCb;
        let errorCb;
        const currentUser = {
            id: 'bar'
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
                type: 'comment'
            });
        });

        test('should create the comment and invoke the success callback', (done) => {
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
        let errorCb;
        const message = 'foo';
        const id = 'uniqueId';
        beforeEach(() => {
            feed.updateFeedItem = jest.fn();
            feed.createFeedError = jest.fn().mockReturnValue(message);
            errorCb = jest.fn();
        });

        test('should invoke update the feed item with an AF error and call the success callback', () => {
            feed.createCommentErrorCallback({ status: 409 }, id, errorCb);
            expect(feed.createFeedError).toBeCalledWith(messages.commentCreateConflictMessage);
            expect(feed.updateFeedItem).toBeCalledWith(message, id);
            expect(errorCb).toBeCalled();
        });

        test('should invoke update the feed item with an AF error', () => {
            feed.isDestroyed = jest.fn().mockReturnValue(true);
            feed.createCommentErrorCallback({ status: 500 }, id, errorCb);
            expect(feed.createFeedError).toBeCalledWith(messages.commentCreateErrorMessage);
            expect(feed.updateFeedItem).toBeCalledWith(message, id);
            expect(errorCb).not.toBeCalled();
        });
    });

    describe('destroyTaskAssignments()', () => {
        let taskAssignmentArr;
        let destroyFn;
        beforeEach(() => {
            destroyFn = jest.fn();
            const taskAPI = {
                destroy: destroyFn
            };
            taskAssignmentArr = [taskAPI, taskAPI];
            feed.taskAssignmentsAPI = taskAssignmentArr;
        });

        test('should destroy the task assignments APIs', () => {
            feed.destroyTaskAssignments();
            expect(destroyFn).toBeCalledTimes(taskAssignmentArr.length);
            expect(feed.taskAssignmentsAPI).toEqual([]);
        });
    });

    describe('destroy()', () => {
        let commentFn;
        let versionFn;
        let taskFn;

        beforeEach(() => {
            feed.destroyTaskAssignments = jest.fn();
            commentFn = jest.fn();
            versionFn = jest.fn();
            taskFn = jest.fn();

            feed.tasksAPI = {
                destroy: taskFn
            };
            feed.versionsAPI = {
                destroy: versionFn
            };
            feed.commentsAPI = {
                destroy: commentFn
            };
        });

        test('should destroy the APIs', () => {
            feed.destroy();
            expect(feed.destroyTaskAssignments).toBeCalled();
            expect(versionFn).toBeCalled();
            expect(commentFn).toBeCalled();
            expect(taskFn).toBeCalled();
        });
    });
});
