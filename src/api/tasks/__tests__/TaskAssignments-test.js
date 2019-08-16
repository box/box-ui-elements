import TaskAssignments from '../TaskAssignments';
import { PERMISSION_CAN_COMMENT } from '../../../constants';

let taskAssignments;

describe('api/TaskAssignments', () => {
    beforeEach(() => {
        taskAssignments = new TaskAssignments({});
    });

    describe('getUrl()', () => {
        test('should return correct version api url with id', () => {
            expect(taskAssignments.getUrl('foo')).toBe('https://api.box.com/2.0/task_assignments/foo');
        });
    });

    describe('CRUD operations', () => {
        const file = {
            id: 'foo',
            permissions: {},
        };

        const taskId = '123';
        const taskAssignmentId = '456';
        const assignTo = {
            id: '987654321',
        };

        const taskStatus = 'rejected';
        const successCallback = jest.fn();
        const errorCallback = jest.fn();

        beforeEach(() => {
            taskAssignments.get = jest.fn();
            taskAssignments.post = jest.fn();
            taskAssignments.put = jest.fn();
            taskAssignments.delete = jest.fn();
            taskAssignments.checkApiCallValidity = jest.fn(() => true);

            const url = 'https://www.foo.com/task_assignments';
            taskAssignments.getUrl = jest.fn(() => url);
        });

        describe('createTaskAssignment()', () => {
            test('should check for valid task assignment permissions', () => {
                taskAssignments.createTaskAssignment({
                    file,
                    taskId,
                    successCallback,
                    errorCallback,
                });
                expect(taskAssignments.checkApiCallValidity).toBeCalledWith(
                    PERMISSION_CAN_COMMENT,
                    file.permissions,
                    file.id,
                );
            });

            test('should post a well formed task to the tasks endpoint', () => {
                const requestData = {
                    data: {
                        task: {
                            id: taskId,
                            type: 'task',
                        },
                        assign_to: assignTo,
                    },
                };

                taskAssignments.createTaskAssignment({
                    file,
                    taskId,
                    assignTo,
                    successCallback,
                    errorCallback,
                });
                expect(taskAssignments.post).toBeCalledWith({
                    id: 'foo',
                    url: taskAssignments.getUrl(taskId),
                    data: requestData,
                    successCallback,
                    errorCallback,
                });
            });
        });

        describe('updateTaskAssignment()', () => {
            beforeEach(() => {
                taskAssignments.put = jest.fn();
            });

            test('should check for valid task assignment permissions', () => {
                taskAssignments.updateTaskAssignment({
                    file,
                    taskAssignmentId,
                    taskStatus,
                    successCallback,
                    errorCallback,
                });
                expect(taskAssignments.checkApiCallValidity).toBeCalledWith(
                    PERMISSION_CAN_COMMENT,
                    file.permissions,
                    file.id,
                );
            });

            test('should put a well formed task update to the tasks endpoint', () => {
                const requestData = {
                    data: { status: taskStatus },
                };

                taskAssignments.updateTaskAssignment({
                    file,
                    taskAssignmentId,
                    taskStatus,
                    successCallback,
                    errorCallback,
                });
                expect(taskAssignments.put).toBeCalledWith({
                    id: 'foo',
                    url: taskAssignments.getUrl(taskAssignmentId),
                    data: requestData,
                    successCallback,
                    errorCallback,
                });
            });
        });

        describe('deleteTaskAssignment()', () => {
            test('should check for valid task assignment delete permissions', () => {
                taskAssignments.deleteTaskAssignment({
                    file,
                    taskAssignmentId,
                    successCallback,
                    errorCallback,
                });
                expect(taskAssignments.checkApiCallValidity).toBeCalledWith(
                    PERMISSION_CAN_COMMENT,
                    file.permissions,
                    file.id,
                );
            });

            test('should delete a task from the tasks endpoint', () => {
                taskAssignments.deleteTaskAssignment({
                    file,
                    taskAssignmentId,
                    successCallback,
                    errorCallback,
                });
                expect(taskAssignments.delete).toBeCalledWith({
                    id: 'foo',
                    url: taskAssignments.getUrl(taskAssignmentId),
                    successCallback,
                    errorCallback,
                });
            });
        });
    });
});
