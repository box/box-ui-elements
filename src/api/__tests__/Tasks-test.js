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
        const successCallback = jest.fn();
        const errorCallback = jest.fn();

        beforeEach(() => {
            tasks.get = jest.fn();
            tasks.post = jest.fn();
            tasks.put = jest.fn();
            tasks.delete = jest.fn();
            tasks.checkApiCallValidity = jest.fn(() => true);

            const url = 'https://www.foo.com';
            tasks.getBaseApiUrl = jest.fn(() => url);
        });

        describe('createTask()', () => {
            test('should check for valid task permissions', () => {
                tasks.createTask({ file, message, successCallback, errorCallback });
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

                tasks.createTask({ file, message, dueAt, successCallback, errorCallback });
                expect(tasks.post).toBeCalledWith({
                    id: 'foo',
                    url: tasks.tasksUrl(),
                    data: requestData,
                    successCallback,
                    errorCallback
                });
            });
        });

        describe('updateTask()', () => {
            test('should check for valid task permissions', () => {
                tasks.updateTask({ file, taskId, message, successCallback, errorCallback });
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
                    successCallback,
                    errorCallback
                });
                expect(tasks.put).toBeCalledWith({
                    id: 'foo',
                    url: tasks.tasksUrl(taskId),
                    data: requestData,
                    successCallback,
                    errorCallback
                });
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
                    successCallback,
                    errorCallback
                });
                expect(tasks.put).toBeCalledWith({
                    id: 'foo',
                    url: tasks.tasksUrl(taskId),
                    data: requestData,
                    successCallback,
                    errorCallback
                });
            });
        });

        describe('deleteTask()', () => {
            test('should check for valid task delete permissions', () => {
                tasks.deleteTask({ file, taskId, successCallback, errorCallback });
                expect(tasks.checkApiCallValidity).toBeCalledWith(PERMISSION_CAN_COMMENT, file.permissions, file.id);
            });

            test('should delete a task from the tasks endpoint', () => {
                tasks.deleteTask({ file, taskId, successCallback, errorCallback });
                expect(tasks.delete).toBeCalledWith({
                    id: 'foo',
                    url: tasks.tasksUrl(taskId),
                    successCallback,
                    errorCallback
                });
            });
        });

        describe('getAssignments()', () => {
            test('should make a correct GET request for assignments for the specified task', () => {
                const id = 'id';
                const url = `${tasks.tasksUrl(taskId)}/assignments`;
                const params = {
                    fields: 'start=0'
                };
                tasks.get = jest.fn();

                tasks.getAssignments(id, taskId, successCallback, errorCallback, params);
                expect(tasks.get).toHaveBeenCalledWith({ id, url, successCallback, errorCallback, params });
            });
        });
    });
});
