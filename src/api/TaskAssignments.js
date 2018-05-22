/**
 * @flow
 * @file Helper for the box Tasks API
 * @author Box
 */

import Base from './Base';
import type { BoxItem } from '../flowTypes';
import { PERMISSION_CAN_COMMENT } from '../constants';

class TaskAssignments extends Base {
    /**
     * API URL for task assignments. Getting a list of assignments "/tasks/id/assignments" does not give us the field
     * we need. So instead we will only perform GET operations on an assignment by assignment basis.
     *
     * @param {string} id - a box task ID
     * @return {string} base url for task assignments
     */
    getUrl(id?: string): string {
        const baseUrl = `${this.getBaseApiUrl()}/tasks_assignments`;
        return id ? `${baseUrl}/${id}` : baseUrl;
    }

    /**
     * Formats the tasks api response to usable data
     * @param {Object} data the api response data
     */
    successHandler = (data: any): void => {
        if (this.isDestroyed() || typeof this.successCallback !== 'function') {
            return;
        }

        // There is no response data when deleting a task
        if (!data) {
            this.successCallback({});
            return;
        }

        this.successCallback({ ...data });
    };

    /**
     * API for creating a task assignment on a file
     *
     * @param {BoxItem} file - File object that contains the task we are assigning to
     * @param {string} taskId - Task that we are adding an assignment to
     * @param {Object} assignTo - Object containing task assignees
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
        assignTo: Object,
        successCallback: Function,
        errorCallback: Function
    }): void {
        const { id = '', permissions } = file;

        try {
            this.checkApiCallValidity(PERMISSION_CAN_COMMENT, permissions, id);
        } catch (e) {
            errorCallback(e);
            return;
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

        this.post(id, this.getUrl(), requestData, successCallback, errorCallback);
    }

    /**
     * API for updating a task on a file
     *
     * @param {BoxItem} file - File object for which we are creating a task
     * @param {string} taskAssignmentId - Task assignment to be edited
     * @param {string} message - A message from the assignee about the task
     * @param {string} resolutionStatus - The updated task assignment status
     * @param {Function} successCallback - Success callback
     * @param {Function} errorCallback - Error callback
     * @return {void}
     */
    updateTask({
        file,
        taskAssignmentId,
        message,
        resolutionStatus,
        successCallback,
        errorCallback
    }: {
        file: BoxItem,
        taskAssignmentId: string,
        message: string,
        resolutionStatus: string,
        successCallback: Function,
        errorCallback: Function
    }): void {
        const { id = '', permissions } = file;

        try {
            // We don't know task_edit specific permissions, so let the client try and fail gracefully
            this.checkApiCallValidity(PERMISSION_CAN_COMMENT, permissions, id);
        } catch (e) {
            errorCallback(e);
            return;
        }

        const requestData = {
            data: {
                message,
                resolution_status: resolutionStatus
            }
        };

        this.put(id, this.getUrl(taskAssignmentId), requestData, successCallback, errorCallback);
    }

    /**
     * API for deleting a task on a file
     *
     * @param {BoxItem} file - File object for which we are deleting a task
     * @param {string} taskAssignmentId - Id of the task we are deleting
     * @param {Function} successCallback - Success callback
     * @param {Function} errorCallback - Error callback
     * @return {void}
     */
    deleteTask({
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
            // We don't know task_delete specific permissions, so let the client try and fail gracefully
            this.checkApiCallValidity(PERMISSION_CAN_COMMENT, permissions, id);
        } catch (e) {
            errorCallback(e);
            return;
        }

        this.delete(id, this.getUrl(taskAssignmentId), successCallback, errorCallback);
    }
}

export default TaskAssignments;
