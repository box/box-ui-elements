import TaskAssignments from '../TaskAssignments';
import { PERMISSION_CAN_COMMENT } from '../../constants';

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
            permissions: {}
        };

        const taskId = '123';
        const taskAssignmentId = '456';
        const assignTo = {
            id: '987654321'
        };

        const resolutionStatus = 'rejected';
        const successCb = jest.fn();
        const errorCb = jest.fn();

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
                taskAssignments.createTaskAssignment({ file, taskId, successCb, errorCb });
                expect(taskAssignments.checkApiCallValidity).toBeCalledWith(
                    PERMISSION_CAN_COMMENT,
                    file.permissions,
                    file.id
                );
            });

            test('should post a well formed task to the tasks endpoint', () => {
                const requestData = {
                    data: {
                        task: {
                            id: taskId,
                            type: 'task'
                        },
                        assign_to: assignTo
                    }
                };

                taskAssignments.createTaskAssignment({
                    file,
                    taskId,
                    assignTo,
                    successCallback: successCb,
                    errorCallback: errorCb
                });
                expect(taskAssignments.post).toBeCalledWith(
                    'foo',
                    taskAssignments.getUrl(taskId),
                    requestData,
                    successCb,
                    errorCb
                );
            });
        });

        describe('updateTaskAssignment()', () => {
            test('should check for valid task assignment permissions', () => {
                taskAssignments.updateTaskAssignment({ file, taskAssignmentId, resolutionStatus, successCb, errorCb });
                expect(taskAssignments.checkApiCallValidity).toBeCalledWith(
                    PERMISSION_CAN_COMMENT,
                    file.permissions,
                    file.id
                );
            });

            test('should put a well formed task update to the tasks endpoint', () => {
                const requestData = {
                    data: { resolution_status: resolutionStatus }
                };

                taskAssignments.updateTaskAssignment({
                    file,
                    taskAssignmentId,
                    resolutionStatus,
                    successCallback: successCb,
                    errorCallback: errorCb
                });
                expect(taskAssignments.put).toBeCalledWith(
                    'foo',
                    taskAssignments.getUrl(taskAssignmentId),
                    requestData,
                    successCb,
                    errorCb
                );
            });
        });

        describe('deleteTaskAssignment()', () => {
            test('should check for valid task assignment delete permissions', () => {
                taskAssignments.deleteTaskAssignment({ file, taskAssignmentId, successCb, errorCb });
                expect(taskAssignments.checkApiCallValidity).toBeCalledWith(
                    PERMISSION_CAN_COMMENT,
                    file.permissions,
                    file.id
                );
            });

            test('should delete a task from the tasks endpoint', () => {
                taskAssignments.deleteTaskAssignment({
                    file,
                    taskAssignmentId,
                    successCallback: successCb,
                    errorCallback: errorCb
                });
                expect(taskAssignments.delete).toBeCalledWith(
                    'foo',
                    taskAssignments.getUrl(taskAssignmentId),
                    successCb,
                    errorCb
                );
            });
        });
    });
});
