/**
 * @flow
 * @file Helper for the box Tasks API
 * @author Box
 */

import { TASKS_FIELDS_TO_FETCH, TASK_ASSIGNMENTS_FIELDS_TO_FETCH } from '../utils/fields';
import Base from './Base';
import {
    PERMISSION_CAN_COMMENT,
    ERROR_CODE_CREATE_TASK,
    ERROR_CODE_UPDATE_TASK,
    ERROR_CODE_DELETE_TASK,
    ERROR_CODE_FETCH_TASK_ASSIGNMENT,
    ERROR_CODE_FETCH_TASKS,
    HTTP_STATUS_CODE_INTERNAL_SERVER_ERROR,
    HTTP_STATUS_CODE_NOT_IMPLEMENTED,
    HTTP_STATUS_CODE_BAD_GATEWAY,
    HTTP_STATUS_CODE_SERVICE_UNAVAILABLE,
    HTTP_STATUS_CODE_GATEWAY_TIMEOUT,
} from '../constants';

class Tasks extends Base {
    retryableStatusCodes = [
        HTTP_STATUS_CODE_INTERNAL_SERVER_ERROR,
        HTTP_STATUS_CODE_NOT_IMPLEMENTED,
        HTTP_STATUS_CODE_BAD_GATEWAY,
        HTTP_STATUS_CODE_SERVICE_UNAVAILABLE,
        HTTP_STATUS_CODE_GATEWAY_TIMEOUT,
    ];

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
     * API for getting assignments for a given task
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
        errorCallback: ElementsErrorCallback,
        requestData: Object = {
            params: {
                fields: TASK_ASSIGNMENTS_FIELDS_TO_FETCH.toString(),
            },
        },
    ): void {
        this.errorCode = ERROR_CODE_FETCH_TASK_ASSIGNMENT;
        const url = `${this.tasksUrl(taskId)}/assignments`;
        this.get({ id, successCallback, errorCallback, requestData, url });
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
        dueAt?: string,
        errorCallback: (e: ElementsXhrError, code: string) => void,
        file: BoxItem,
        message: string,
        successCallback: Function,
    }): void {
        const { id = '', permissions } = file;
        this.errorCode = ERROR_CODE_CREATE_TASK;

        try {
            this.checkApiCallValidity(PERMISSION_CAN_COMMENT, permissions, id);
        } catch (e) {
            errorCallback(e, this.errorCode);
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
        dueAt?: string,
        errorCallback: ElementsErrorCallback,
        file: BoxItem,
        message: string,
        successCallback: Function,
        taskId: string,
    }): void {
        const { id = '', permissions } = file;
        this.errorCode = ERROR_CODE_UPDATE_TASK;
        try {
            // We don't know task_edit specific permissions, so let the client try and fail gracefully
            this.checkApiCallValidity(PERMISSION_CAN_COMMENT, permissions, id);
        } catch (e) {
            errorCallback(e, this.errorCode);
            return;
        }

        const data: { due_at?: string, message: string } = { message };
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
        errorCallback: ElementsErrorCallback,
        file: BoxItem,
        successCallback: Function,
        taskId: string,
    }): void {
        this.errorCode = ERROR_CODE_DELETE_TASK;
        const { id = '', permissions } = file;

        try {
            // We don't know task_delete specific permissions, so let the client try and fail gracefully
            this.checkApiCallValidity(PERMISSION_CAN_COMMENT, permissions, id);
        } catch (e) {
            errorCallback(e, this.errorCode);
            return;
        }

        this.delete({
            id,
            url: this.tasksUrl(taskId),
            successCallback,
            errorCallback,
        });
    }

    /**
     * API for fetching tasks on a file
     *
     * @param {string} id - a box file id
     * @param {Function} successCallback - Success callback
     * @param {Function} errorCallback - Error callback
     * @param {Object} requestData - additional request data
     * @returns {Promise<void>}
     */
    getTasks(
        id: string,
        successCallback: Function,
        errorCallback: ElementsErrorCallback,
        requestData: Object = {
            params: {
                fields: TASKS_FIELDS_TO_FETCH.toString(),
            },
        },
    ): void {
        this.errorCode = ERROR_CODE_FETCH_TASKS;
        this.get({
            id,
            successCallback,
            errorCallback,
            requestData,
        });
    }
}

export default Tasks;
