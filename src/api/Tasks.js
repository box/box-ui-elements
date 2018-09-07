/**
 * @flow
 * @file Helper for the box Tasks API
 * @author Box
 */

import Base from './Base';
import { PERMISSION_CAN_COMMENT } from '../constants';

class Tasks extends Base {
    /**
     * API URL for tasks
     *
     * @param {string} [id] - a box file id
     * @return {string} base url for files
     */
    getUrl(id: string): string {
        if (!id) {
            throw new Error('Missing file id!');
        }

        return `${this.getBaseApiUrl()}/files/${id}/tasks`;
    }

    /**
     * API URL for tasks endpoint
     *
     * @param {string} [id] - A box task id
     * @return {string} base url for tasks
     */
    tasksUrl(id?: string): string {
        const baseUrl = `${this.getBaseApiUrl()}/tasks`;
        return id ? `${baseUrl}/${id}` : baseUrl;
    }

    /**
     * API for creating a task on a file
     *
     * @param {string} id - a box file id
     * @param {string} taskId - Task ID
     * @param {Function} successCallback - Success callback
     * @param {Function} errorCallback - Error callback
     * @param {Object} params request params
     * @return {Promise}
     */
    getAssignments(
        id: string,
        taskId: string,
        successCallback: Function,
        errorCallback: Function,
        params?: Object,
    ): void {
        const url = `${this.tasksUrl(taskId)}/assignments`;
        this.get({ id, successCallback, errorCallback, params, url });
    }

    /**
     * API for creating a task on a file
     *
     * @param {BoxItem} file - File object for which we are creating a task
     * @param {string} message - Task message
     * @param {string} dueAt - Task due date
     * @param {Function} successCallback - Success callback
     * @param {Function} errorCallback - Error callback
     * @return {void}
     */
    createTask({
        file,
        message,
        dueAt,
        successCallback,
        errorCallback,
    }: {
        file: BoxItem,
        message: string,
        dueAt?: string,
        successCallback: Function,
        errorCallback: Function,
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
                item: {
                    id,
                    type: 'file',
                },
                message,
                due_at: dueAt,
            },
        };

        this.post({
            id,
            url: this.tasksUrl(),
            data: requestData,
            successCallback,
            errorCallback,
        });
    }

    /**
     * API for updating a task on a file
     *
     * @param {BoxItem} file - File object for which we are creating a task
     * @param {string} taskId - Task to be edited
     * @param {string} message - Task message
     * @param {string} dueAt - Task due date
     * @param {Function} successCallback - Success callback
     * @param {Function} errorCallback - Error callback
     * @return {void}
     */
    updateTask({
        file,
        taskId,
        message,
        dueAt,
        successCallback,
        errorCallback,
    }: {
        file: BoxItem,
        taskId: string,
        message: string,
        dueAt?: string,
        successCallback: Function,
        errorCallback: Function,
    }): void {
        const { id = '', permissions } = file;

        try {
            // We don't know task_edit specific permissions, so let the client try and fail gracefully
            this.checkApiCallValidity(PERMISSION_CAN_COMMENT, permissions, id);
        } catch (e) {
            errorCallback(e);
            return;
        }

        const data: { message: string, due_at?: string } = { message };
        const requestData = { data };

        if (dueAt) {
            requestData.data.due_at = dueAt;
        }

        this.put({
            id,
            url: this.tasksUrl(taskId),
            data: requestData,
            successCallback,
            errorCallback,
        });
    }

    /**
     * API for deleting a task on a file
     *
     * @param {BoxItem} file - File object for which we are deleting a task
     * @param {string} taskId - Id of the task we are deleting
     * @param {Function} successCallback - Success callback
     * @param {Function} errorCallback - Error callback
     * @return {void}
     */
    deleteTask({
        file,
        taskId,
        successCallback,
        errorCallback,
    }: {
        file: BoxItem,
        taskId: string,
        successCallback: Function,
        errorCallback: Function,
    }): void {
        const { id = '', permissions } = file;

        try {
            // We don't know task_delete specific permissions, so let the client try and fail gracefully
            this.checkApiCallValidity(PERMISSION_CAN_COMMENT, permissions, id);
        } catch (e) {
            errorCallback(e);
            return;
        }

        this.delete({
            id,
            url: this.tasksUrl(taskId),
            successCallback,
            errorCallback,
        });
    }
}

export default Tasks;
