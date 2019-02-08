import { API_PAGE_LIMIT } from '../../constants';
import TasksNew from '../TasksNew';

let tasks;
const BASE_URL = 'https://www.foo.com';
const FILE_ID = 'foo';

describe('api/TasksNew', () => {
    beforeEach(() => {
        tasks = new TasksNew({});
    });

    describe('CRUD operations', () => {
        const file = {
            id: 'foo',
            permissions: {},
        };

        const taskId = '123';
        const message = 'hello world';
        const dueAt = '2018-09-06';
        const task = {
            id: taskId,
            name: message,
            due_at: dueAt,
        };
        const successCallback = jest.fn();
        const errorCallback = jest.fn();

        beforeEach(() => {
            tasks.get = jest.fn();
            tasks.post = jest.fn();
            tasks.put = jest.fn();
            tasks.delete = jest.fn();
            tasks.checkApiCallValidity = jest.fn(() => true);

            tasks.getBaseApiUrl = jest.fn(() => BASE_URL);
        });

        describe('createTask()', () => {
            test('should post a well formed task to the tasks endpoint', () => {
                const expectedRequestData = {
                    data: task,
                };

                tasks.createTask({
                    file,
                    task,
                    successCallback,
                    errorCallback,
                });

                expect(tasks.post).toBeCalledWith({
                    id: FILE_ID,
                    url: `${BASE_URL}/undoc/tasks`,
                    data: expectedRequestData,
                    successCallback,
                    errorCallback,
                });
            });
        });

        describe('updateTask()', () => {
            test('should put a well formed task update to the tasks endpoint', () => {
                const expectedRequestData = {
                    data: {
                        id: taskId,
                        name: message,
                    },
                };

                tasks.updateTask({
                    file,
                    task: { id: taskId, name: message },
                    successCallback,
                    errorCallback,
                });

                expect(tasks.put).toBeCalledWith({
                    id: FILE_ID,
                    url: `${BASE_URL}/undoc/tasks/${task.id}`,
                    data: expectedRequestData,
                    successCallback,
                    errorCallback,
                });
            });
        });

        describe('deleteTask()', () => {
            test('should delete a task from the tasks endpoint', () => {
                tasks.deleteTask({
                    file,
                    task,
                    successCallback,
                    errorCallback,
                });

                expect(tasks.delete).toBeCalledWith({
                    id: FILE_ID,
                    url: `${BASE_URL}/undoc/tasks/${task.id}`,
                    successCallback,
                    errorCallback,
                });
            });
        });

        describe('getTasksForFile()', () => {
            test('should get all tasks for a file', () => {
                tasks.getTasksForFile({
                    file,
                    successCallback,
                    errorCallback,
                });

                expect(tasks.get).toBeCalledWith({
                    id: FILE_ID,
                    url: `${BASE_URL}/undoc/inbox?task_link_target_type=FILE&task_link_target_id=${FILE_ID}&limit=${API_PAGE_LIMIT}`,
                    successCallback,
                    errorCallback,
                });
            });
        });
    });
});
