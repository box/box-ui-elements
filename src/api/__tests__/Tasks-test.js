import Tasks from '../Tasks';

let tasks;
const tasksResponse = { total_count: 0, entries: [] };

describe('api/Tasks', () => {
    beforeEach(() => {
        tasks = new Tasks({});
    });

    describe('getUrl()', () => {
        test('should throw when version api url without id', () => {
            expect(() => {
                tasks.getUrl();
            }).toThrow();
        });
        test('should return correct version api url with id', () => {
            expect(tasks.getUrl('foo')).toBe('https://api.box.com/2.0/files/foo/tasks');
        });
    });

    describe('tasks()', () => {
        test('should not do anything if destroyed', () => {
            tasks.isDestroyed = jest.fn().mockReturnValueOnce(true);
            tasks.xhr = null;

            const successCb = jest.fn();
            const errorCb = jest.fn();

            return tasks.tasks('id', successCb, errorCb).catch(() => {
                expect(successCb).not.toHaveBeenCalled();
                expect(errorCb).not.toHaveBeenCalled();
            });
        });

        test('should make xhr to get tasks and call success callback', () => {
            tasks.xhr = {
                get: jest.fn().mockReturnValueOnce(Promise.resolve({ data: tasksResponse }))
            };

            const successCb = jest.fn();

            return tasks.tasks('id', successCb).then(() => {
                expect(successCb).toHaveBeenCalledWith(tasksResponse);
                expect(tasks.xhr.get).toHaveBeenCalledWith({
                    id: 'file_id',
                    url: 'https://api.box.com/2.0/files/id/tasks'
                });
            });
        });

        test('should call error callback when xhr fails', () => {
            const error = new Error('error');
            tasks.xhr = {
                get: jest.fn().mockReturnValueOnce(Promise.reject(error))
            };

            const successCb = jest.fn();
            const errorCb = jest.fn();

            return tasks.tasks('id', successCb, errorCb).then(() => {
                expect(successCb).not.toHaveBeenCalled();
                expect(errorCb).toHaveBeenCalledWith(error);
                expect(tasks.xhr.get).toHaveBeenCalledWith({
                    id: 'file_id',
                    url: 'https://api.box.com/2.0/files/id/tasks'
                });
            });
        });
    });
});
