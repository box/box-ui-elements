import { API_PAGE_LIMIT } from '../../../constants';
import TaskCollaborators from '../TaskCollaborators';

let taskCollaborators;
const BASE_URL = 'https://www.foo.com';
const FILE_ID = 'foo';
const USER_ID = 'userone';

describe('api/TaskCollaborators', () => {
    beforeEach(() => {
        taskCollaborators = new TaskCollaborators({});
    });

    describe('CRUD operations', () => {
        const file = {
            id: 'foo',
            permissions: {},
        };
        const groupId = '456';
        const taskId = '123';
        const message = 'hello world';
        const dueAt = '2018-09-06';
        const group = {
            id: groupId,
        };
        const task = {
            id: taskId,
            name: message,
            due_at: dueAt,
        };
        const user = {
            id: USER_ID,
            type: 'user',
        };
        const taskCollaborator = {
            id: 'taskcollabid',
        };
        const successCallback = jest.fn();
        const errorCallback = jest.fn();

        beforeEach(() => {
            taskCollaborators.get = jest.fn();
            taskCollaborators.post = jest.fn();
            taskCollaborators.put = jest.fn();
            taskCollaborators.delete = jest.fn();
            taskCollaborators.checkApiCallValidity = jest.fn(() => true);

            taskCollaborators.getBaseApiUrl = jest.fn(() => BASE_URL);
        });

        describe('createTaskCollaborator()', () => {
            test('should post a well formed payload to the taskCollaborators endpoint', () => {
                const expectedRequestData = {
                    data: {
                        task: {
                            id: taskId,
                            type: 'task',
                        },
                        target: user,
                    },
                };

                taskCollaborators.createTaskCollaborator({
                    file,
                    task,
                    user,
                    successCallback,
                    errorCallback,
                });

                expect(taskCollaborators.post).toBeCalledWith({
                    id: FILE_ID,
                    url: `${BASE_URL}/undoc/task_collaborators`,
                    data: expectedRequestData,
                    successCallback,
                    errorCallback,
                });
            });
        });

        describe('createTaskCollaboratorsforGroup()', () => {
            test('should post a well formed payload to the taskCollaborators endpoint for groups', () => {
                const expectedRequestData = {
                    data: {
                        task: {
                            id: taskId,
                            type: 'task',
                        },
                        target: {
                            id: groupId,
                            type: 'group',
                        },
                    },
                };

                taskCollaborators.createTaskCollaboratorsforGroup({
                    file,
                    task,
                    group,
                    user,
                    successCallback,
                    errorCallback,
                });

                expect(taskCollaborators.post).toBeCalledWith({
                    id: FILE_ID,
                    url: `${BASE_URL}/undoc/task_collaborators/expand_group`,
                    data: expectedRequestData,
                    successCallback,
                    errorCallback,
                });
            });
        });

        describe('updateTaskCollaborator()', () => {
            test('should put a well formed payload to the taskCollaborators endpoint', () => {
                const expectedRequestData = {
                    data: {
                        status: 'COMPLETED',
                    },
                };

                taskCollaborators.updateTaskCollaborator({
                    file,
                    taskCollaborator: { ...taskCollaborator, status: 'COMPLETED' },
                    successCallback,
                    errorCallback,
                });

                expect(taskCollaborators.put).toBeCalledWith({
                    id: FILE_ID,
                    url: `${BASE_URL}/undoc/task_collaborators/${taskCollaborator.id}`,
                    data: expectedRequestData,
                    successCallback,
                    errorCallback,
                });
            });
        });

        describe('deleteTask()', () => {
            test('should delete a taskCollaborator from the taskCollaborators endpoint', () => {
                taskCollaborators.deleteTaskCollaborator({
                    file,
                    taskCollaborator,
                    successCallback,
                    errorCallback,
                });

                expect(taskCollaborators.delete).toBeCalledWith({
                    id: FILE_ID,
                    url: `${BASE_URL}/undoc/task_collaborators/${taskCollaborator.id}`,
                    successCallback,
                    errorCallback,
                });
            });
        });

        describe('getTaskCollaborators()', () => {
            test('should get all taskCollaborators for a task', () => {
                taskCollaborators.getTaskCollaborators({
                    file,
                    task,
                    successCallback,
                    errorCallback,
                });

                expect(taskCollaborators.get).toBeCalledWith({
                    id: FILE_ID,
                    url: `${BASE_URL}/undoc/tasks/${taskId}/task_collaborators?role=ASSIGNEE&limit=${API_PAGE_LIMIT}`,
                    successCallback,
                    errorCallback,
                });
            });
        });
    });
});
