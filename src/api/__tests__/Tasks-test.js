import Tasks from '../Tasks';
import { PERMISSION_CAN_COMMENT } from '../../constants';

let tasks;

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

    describe('format()', () => {
        const task = {
            type: 'task',
            id: '1234',
            created_at: { name: 'Jay-Z', id: 10 },
            due_at: 1234567891,
            message: 'test',
            task_assignment_collection: {
                entries: ['foo']
            }
        };

        test('should unnest the task_assignment_collection', () => {
            const result = tasks.format(task);
            expect(result).toEqual({
                ...task,
                task_assignment_collection: ['foo']
            });
        });
    });

    describe('successHandler()', () => {
        const task = {
            type: 'task',
            id: '1234',
            created_at: { name: 'Jay-Z', id: 10 },
            due_at: 1234567891,
            message: 'test',
            task_assignment_collection: {
                entries: []
            }
        };

        beforeEach(() => {
            tasks.format = jest.fn();
            tasks.successCallback = jest.fn();
        });

        test('should call the success callback with no data if none provided from API', () => {
            tasks.successHandler();
            expect(tasks.successCallback).toBeCalledWith();
        });

        test('should return API response with properly formatted data', () => {
            tasks.successHandler({
                total_count: 2,
                entries: [task, task]
            });
            expect(tasks.successCallback).toBeCalled();
            expect(tasks.format.mock.calls.length).toBe(2);
        });

        test('should return properly formatted data if only one task is returned from API', () => {
            tasks.successHandler(task);
            expect(tasks.format).toBeCalled();
            expect(tasks.successCallback).toBeCalled();
        });
    });

    describe('tasksUrl()', () => {
        test('should add an id if provided', () => {
            expect(tasks.tasksUrl('foo')).toBe('https://api.box.com/2.0/tasks/foo');
        });
    });

    describe('CRUD operations', () => {
        const file = {
            id: 'foo',
            permissions: {}
        };

        const taskId = '123';
        const message = 'hello world';
        const dueAt = '2018-09-06';
        const successCb = jest.fn();
        const errorCb = jest.fn();

        beforeEach(() => {
            tasks.get = jest.fn();
            tasks.post = jest.fn();
            tasks.put = jest.fn();
            tasks.delete = jest.fn();
            tasks.checkApiCallValidity = jest.fn(() => true);

            const url = 'https://www.foo.com/tasks';
            tasks.tasksUrl = jest.fn(() => url);
        });

        describe('createTask()', () => {
            test('should check for valid task permissions', () => {
                tasks.createTask({ file, message, successCb, errorCb });
                expect(tasks.checkApiCallValidity).toBeCalledWith(PERMISSION_CAN_COMMENT, file.permissions, file.id);
            });

            test('should post a well formed task to the tasks endpoint', () => {
                const requestData = {
                    data: {
                        item: {
                            id: file.id,
                            type: 'file'
                        },
                        message,
                        due_at: dueAt
                    }
                };

                tasks.createTask({ file, message, dueAt, successCallback: successCb, errorCallback: errorCb });
                expect(tasks.post).toBeCalledWith('foo', tasks.tasksUrl(), requestData, successCb, errorCb);
            });
        });

        describe('updateTask()', () => {
            test('should check for valid task permissions', () => {
                tasks.updateTask({ file, taskId, message, successCb, errorCb });
                expect(tasks.checkApiCallValidity).toBeCalledWith(PERMISSION_CAN_COMMENT, file.permissions, file.id);
            });

            test('should put a well formed task update to the tasks endpoint', () => {
                const requestData = {
                    data: { message }
                };

                tasks.updateTask({
                    file,
                    taskId,
                    message,
                    successCallback: successCb,
                    errorCallback: errorCb
                });
                expect(tasks.put).toBeCalledWith('foo', tasks.tasksUrl(taskId), requestData, successCb, errorCb);
            });

            test('should put a well formed task update to the tasks endpoint when due_at is included', () => {
                const requestData = {
                    data: { message, due_at: dueAt }
                };

                tasks.updateTask({
                    file,
                    taskId,
                    message,
                    dueAt,
                    successCallback: successCb,
                    errorCallback: errorCb
                });
                expect(tasks.put).toBeCalledWith('foo', tasks.tasksUrl(taskId), requestData, successCb, errorCb);
            });
        });
        describe('deleteTask()', () => {
            test('should check for valid task delete permissions', () => {
                tasks.deleteTask({ file, taskId, successCb, errorCb });
                expect(tasks.checkApiCallValidity).toBeCalledWith(PERMISSION_CAN_COMMENT, file.permissions, file.id);
            });

            test('should delete a task from the tasks endpoint', () => {
                tasks.deleteTask({ file, taskId, successCallback: successCb, errorCallback: errorCb });
                expect(tasks.delete).toBeCalledWith('foo', tasks.tasksUrl(taskId), successCb, errorCb);
            });
        });
    });
});
