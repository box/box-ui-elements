/**
 * @flow
 * @file Helper for the box Tasks API
 * @author Box
 */

import Base from './Base';
import type { BoxItem, Task } from '../flowTypes';
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
     * Formats task data for use in components.
     *
     * @param {string} [id] - An individual task entry from the API
     * @return {Task} A task
     */
    format(task: Object): Task {
        return {
            ...task,
            task_assignment_collection: task.task_assignment_collection.entries || []
        };
    }

    /**
     * Formats the tasks api response to usable data
     * @param {Object} data the api response data
     * @return {void}
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

        // We don't have entries when updating/creating a task
        if (!data.entries) {
            this.successCallback(this.format(data));
            return;
        }

        const tasks = data.entries.map(this.format);
        this.successCallback({ ...data, entries: tasks });
    };

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
        errorCallback
    }: {
        file: BoxItem,
        message: string,
        dueAt?: string,
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
                item: {
                    id,
                    type: 'file'
                },
                message,
                due_at: dueAt
            }
        };

        this.post(id, this.tasksUrl(), requestData, successCallback, errorCallback);
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
        errorCallback
    }: {
        file: BoxItem,
        taskId: string,
        message: string,
        dueAt?: string,
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

        const data: { message: string, due_at?: string } = { message };
        const requestData = { data };

        if (dueAt) {
            requestData.data.due_at = dueAt;
        }

        this.put(id, this.tasksUrl(taskId), requestData, successCallback, errorCallback);
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
        errorCallback
    }: {
        file: BoxItem,
        taskId: string,
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

        this.delete(id, this.tasksUrl(taskId), successCallback, errorCallback);
    }
}

export default Tasks;
