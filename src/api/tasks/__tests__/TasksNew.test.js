import { API_PAGE_LIMIT } from '../../../constants';
import TasksNew from '../TasksNew';

let tasks;
const BASE_URL = 'https://www.foo.com';
const FILE_ID = 'foo';

describe('api/TasksNew', () => {
    beforeEach(() => {
        tasks = new TasksNew({});
        tasks.get = jest.fn();
        tasks.post = jest.fn();
        tasks.put = jest.fn();
        tasks.delete = jest.fn();
        tasks.checkApiCallValidity = jest.fn(() => true);
        tasks.getBaseApiUrl = jest.fn(() => BASE_URL);
    });

    describe('CRUD operations', () => {
        const file = {
            id: 'foo',
            permissions: {},
        };

        const taskId = '123';
        const taskCollabId = '456';
        const message = 'hello world';
        const dueAt = '2018-09-06';
        const task = {
            id: taskId,
            name: message,
            due_at: dueAt,
        };
        const user = {
            id: '1111',
            name: 'user-name',
            email: 'user-email',
        };
        const group = {
            id: '22222',
            name: 'group-name',
        };
        const assignees = [
            {
                id: user.id,
                item: {
                    type: 'user',
                    id: user.id,
                    name: user.name,
                    login: user.email,
                    email: user.email,
                },
                name: user.name,
                text: user.name,
                value: user.id,
            },
            {
                id: group.id,
                item: {
                    id: group.id,
                    name: group.name,
                    type: 'group',
                },
                name: group.name,
                text: group.name,
                value: group.id,
            },
        ];
        const successCallback = jest.fn();
        const errorCallback = jest.fn();

        describe('createTaskWithDeps()', () => {
            test('should post a well formed task, task link, and task collaborators to the tasks/with_dependencies endpoint', () => {
                const expectedRequestData = {
                    data: {
                        task: { ...task },
                        assigned_to: [
                            {
                                target: {
                                    id: user.id,
                                    type: 'user',
                                },
                            },
                            {
                                target: {
                                    id: group.id,
                                    type: 'group',
                                },
                            },
                        ],
                        task_links: [
                            {
                                target: {
                                    id: file.id,
                                    type: 'file',
                                },
                            },
                        ],
                    },
                };

                tasks.createTaskWithDeps({
                    file,
                    task,
                    successCallback,
                    errorCallback,
                    assignees,
                });

                expect(tasks.post).toBeCalledWith({
                    id: FILE_ID,
                    url: `${BASE_URL}/undoc/tasks/with_dependencies`,
                    data: expectedRequestData,
                    successCallback,
                    errorCallback,
                });
            });
        });

        describe('updateTaskWithDeps()', () => {
            test('should put a well formed task update to the tasks with dependencies endpoint', () => {
                const expectedRequestData = {
                    data: [
                        {
                            op: 'update_task',
                            payload: {
                                description: message,
                            },
                        },
                        {
                            op: 'add_task_collaborator',
                            payload: {
                                target: {
                                    type: 'user',
                                    id: user.id,
                                },
                            },
                        },
                        {
                            op: 'add_task_collaborators_expand_group',
                            payload: {
                                target: {
                                    type: 'group',
                                    id: group.id,
                                },
                            },
                        },
                        {
                            op: 'delete_task_collaborator',
                            id: taskCollabId,
                        },
                    ],
                };

                tasks.updateTaskWithDeps({
                    file,
                    task: {
                        id: task.id,
                        description: message,
                        addedAssignees: assignees,
                        removedAssignees: [
                            {
                                id: taskCollabId,
                            },
                        ],
                    },
                    successCallback,
                    errorCallback,
                });

                expect(tasks.put).toBeCalledWith({
                    id: FILE_ID,
                    url: `${BASE_URL}/undoc/tasks/${task.id}/with_dependencies`,
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
                    url: `${BASE_URL}/undoc/files/${FILE_ID}/linked_tasks?limit=${API_PAGE_LIMIT}`,
                    successCallback,
                    errorCallback,
                });
            });
        });

        describe('getTask()', () => {
            test('should get task by id', () => {
                const taskIdToGet = '12345';
                tasks.getTask({
                    file,
                    id: taskIdToGet,
                    successCallback,
                    errorCallback,
                });

                expect(tasks.get).toBeCalledWith({
                    id: FILE_ID,
                    url: `${BASE_URL}/undoc/tasks/${taskIdToGet}`,
                    successCallback,
                    errorCallback,
                });
            });
        });
    });
});
