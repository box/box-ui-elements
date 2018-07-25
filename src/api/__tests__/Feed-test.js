import Feed from '../Feed';

jest.mock('../Tasks', () => {
    return jest.fn().mockImplementation(() => {
        return {
        updateTask: jest.fn().mockReturnValue({
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
        })
    }
    });
});

describe('api/Feed', () => {
    let feed;
    const feedItems = ['foo', 'bar'];
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
                    entries: [{ assigned_to: { name: 'Akon', id: 11 }, resolution_state: 'incomplete' }],
                    total_count: 1
                }
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

    beforeEach(() => {
        feed = new Feed({});
        CommentsAPI.
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
            expect(cache.set).toHaveBeenCalledWith(cacheKey, feedItems);
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
            expect(() => feed.feedItems({}, successCb, errorCb)).toThrow('Bad box item!');
        });

        test('should return the cached items', () => {
            feed.getCachedItems = jest.fn().mockReturnValue(feedItems);
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

    describe('updateTaskAssignment()', () => {
        test('should update the resolution state and update the feed to remove the pending item', () => {

        })
    });
});
