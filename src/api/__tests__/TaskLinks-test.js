import TaskLinks from '../TaskLinks';

let taskLinks;
const BASE_URL = 'https://www.foo.com';
const FILE_ID = 'foo';

describe('api/TaskLinks', () => {
    beforeEach(() => {
        taskLinks = new TaskLinks({});
    });

    describe('CRUD operations', () => {
        const file = {
            id: FILE_ID,
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
            taskLinks.get = jest.fn();
            taskLinks.post = jest.fn();
            taskLinks.put = jest.fn();
            taskLinks.delete = jest.fn();
            taskLinks.checkApiCallValidity = jest.fn(() => true);

            const url = 'https://www.foo.com';
            taskLinks.getBaseApiUrl = jest.fn(() => url);
        });

        describe('createTaskLink()', () => {
            test('should post a well formed taskLink to the taskLinks endpoint', () => {
                const expectedRequestData = {
                    data: {
                        task: {
                            id: task.id,
                            type: 'task',
                        },
                        target: {
                            id: FILE_ID,
                            type: 'file',
                        },
                    },
                };

                taskLinks.createTaskLink({
                    file,
                    task,
                    successCallback,
                    errorCallback,
                });
                expect(taskLinks.post).toBeCalledWith({
                    id: FILE_ID,
                    url: `${BASE_URL}/undoc/task_links`,
                    data: expectedRequestData,
                    successCallback,
                    errorCallback,
                });
            });
        });
    });
});
