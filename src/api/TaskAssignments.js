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
     * API URL for task assignments. Getting a list of assignments "/tasks/id/assignments" does not give us the fields
     * we need. So instead we will only perform GET operations on an assignment by assignment basis.
     *
     * @param {string} id - a box task ID
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
        assignTo: { id: string },
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
     * @param {string} resolutionStatus - The updated task assignment status
     * @param {Function} successCallback - Success callback
     * @param {Function} errorCallback - Error callback
     * @return {void}
     */
    updateTaskAssignment({
        file,
        taskAssignmentId,
        resolutionStatus,
        successCallback,
        errorCallback
    }: {
        file: BoxItem,
        taskAssignmentId: string,
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
            data: { resolution_status: resolutionStatus }
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
