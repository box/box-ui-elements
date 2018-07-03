/**
 * @flow
 * @file Helper for the box Task Assignments API
 * @author Box
 */

import Base from './Base';
import { PERMISSION_CAN_COMMENT } from '../constants';

class TaskAssignments extends Base {
    /**
     * API URL for task assignments. Getting a list of assignments "/tasks/id/assignments" does not give us the fields
     * we need. So instead we will only perform GET operations on an assignment by assignment basis,
     * and other endpoints will use the GET URL.
     *
     * @param {string} id - a box task assignment ID
     * @return {string} base url for task assignments
     */
    getUrl(id?: string): string {
        const baseUrl = `${this.getBaseApiUrl()}/task_assignments`;
        return id ? `${baseUrl}/${id}` : baseUrl;
    }

    /**
     * API for creating a task assignment on a file
     *
     * @param {BoxItem} file - File object that contains the task we are assigning to
     * @param {string} taskId - Task id that we are adding an assignment to
     * @param {Object} assignTo - Object containing task assignee
     * @param {Function} successCallback - Success callback
     * @param {Function} errorCallback - Error callback
     * @return {void}
     */
    createTaskAssignment({
        file,
        taskId,
        assignTo,
        successCallback,
        errorCallback
    }: {
        file: BoxItem,
        taskId: string,
        assignTo: { id: string },
        successCallback: Function,
        errorCallback: Function
    }): void {
        const { id = '', permissions } = file;

        try {
            this.checkApiCallValidity(PERMISSION_CAN_COMMENT, permissions, id);
        } catch (e) {
            errorCallback(e);
        }

        const requestData = {
            data: {
                task: {
                    type: 'task',
                    id: taskId
                },
                assign_to: assignTo
            }
        };

        this.post({
            id,
            url: this.getUrl(),
            data: requestData,
            successCallback,
            errorCallback
        });
    }

    /**
     * API for updating a task assignment on a file
     *
     * @param {BoxItem} file - File object for which we are updating a task assignment
     * @param {string} taskAssignmentId - Task assignment to be edited
     * @param {string} resolutionState - The updated task assignment status
     * @param {Function} successCallback - Success callback
     * @param {Function} errorCallback - Error callback
     * @param {string} [message] - The task assignments text
     * @return {void}
     */
    updateTaskAssignment({
        file,
        taskAssignmentId,
        resolutionState,
        message,
        successCallback,
        errorCallback
    }: {
        file: BoxItem,
        taskAssignmentId: string,
        resolutionState: string,
        successCallback: Function,
        errorCallback: Function,
        message?: string
    }): void {
        const { id = '', permissions } = file;

        try {
            // We don't know task_assignment_edit specific permissions, so let the client try and fail gracefully
            this.checkApiCallValidity(PERMISSION_CAN_COMMENT, permissions, id);
        } catch (e) {
            errorCallback(e);
            return;
        }

        const requestData = {
            data: { resolution_state: resolutionState, message }
        };

        this.put({
            id,
            url: this.getUrl(taskAssignmentId),
            data: requestData,
            successCallback,
            errorCallback
        });
    }

    /**
     * API for deleting a task assignment on a file
     *
     * @param {BoxItem} file - File object for which we are deleting a task assignment
     * @param {string} taskAssignmentId - Id of the task assignment we are deleting
     * @param {Function} successCallback - Success callback
     * @param {Function} errorCallback - Error callback
     * @return {void}
     */
    deleteTaskAssignment({
        file,
        taskAssignmentId,
        successCallback,
        errorCallback
    }: {
        file: BoxItem,
        taskAssignmentId: string,
        successCallback: Function,
        errorCallback: Function
    }): void {
        const { id = '', permissions } = file;

        try {
            // We don't know task_assignment_delete specific permissions, so let the client try and fail gracefully
            this.checkApiCallValidity(PERMISSION_CAN_COMMENT, permissions, id);
        } catch (e) {
            errorCallback(e);
            return;
        }

        this.delete({
            id,
            url: this.getUrl(taskAssignmentId),
            successCallback,
            errorCallback
        });
    }
}

export default TaskAssignments;
