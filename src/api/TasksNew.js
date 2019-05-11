/**
 * @flow
 * @file Helper for the box Tasks API
 * @author Box
 */

import Base from './Base';
import {
    ERROR_CODE_CREATE_TASK,
    ERROR_CODE_UPDATE_TASK,
    ERROR_CODE_DELETE_TASK,
    ERROR_CODE_FETCH_TASKS,
    API_PAGE_LIMIT,
    HTTP_STATUS_CODE_RATE_LIMIT,
    HTTP_STATUS_CODE_INTERNAL_SERVER_ERROR,
    HTTP_STATUS_CODE_NOT_IMPLEMENTED,
    HTTP_STATUS_CODE_BAD_GATEWAY,
    HTTP_STATUS_CODE_SERVICE_UNAVAILABLE,
    HTTP_STATUS_CODE_GATEWAY_TIMEOUT,
} from '../constants';

const RETRYABLE = [
    HTTP_STATUS_CODE_RATE_LIMIT,
    HTTP_STATUS_CODE_INTERNAL_SERVER_ERROR,
    HTTP_STATUS_CODE_NOT_IMPLEMENTED,
    HTTP_STATUS_CODE_BAD_GATEWAY,
    HTTP_STATUS_CODE_SERVICE_UNAVAILABLE,
    HTTP_STATUS_CODE_GATEWAY_TIMEOUT,
];

class TasksNew extends Base {
    constructor({ retryableStatusCodes = RETRYABLE, ...options }: Options) {
        super({ ...options, retryableStatusCodes });
    }

    getUrlForFileTasks(id: string): string {
        return `${this.getBaseApiUrl()}/undoc/files/${id}/linked_tasks?limit=${API_PAGE_LIMIT}`;
    }

    getUrlForTaskCreate(): string {
        return `${this.getBaseApiUrl()}/undoc/tasks`;
    }

    getUrlForTask(id: string): string {
        return `${this.getBaseApiUrl()}/undoc/tasks/${id}`;
    }

    createTask({
        errorCallback,
        file,
        successCallback,
        task,
    }: {
        errorCallback: (e: ElementsXhrError, code: string) => void,
        file: BoxItem,
        successCallback: Function,
        task: {}, // Partial task object
    }): void {
        this.errorCode = ERROR_CODE_CREATE_TASK;

        this.post({
            id: file.id,
            url: this.getUrlForTaskCreate(),
            data: { data: { ...task } },
            successCallback,
            errorCallback,
        });
    }

    updateTask({
        errorCallback,
        file,
        successCallback,
        task,
    }: {
        errorCallback: ElementsErrorCallback,
        file: BoxItem,
        successCallback: Function,
        task: { id: string },
    }): void {
        this.errorCode = ERROR_CODE_UPDATE_TASK;

        this.put({
            id: file.id,
            url: this.getUrlForTask(task.id),
            data: { data: { ...task } },
            successCallback,
            errorCallback,
        });
    }

    deleteTask({
        errorCallback,
        file,
        successCallback,
        task,
    }: {
        errorCallback: ElementsErrorCallback,
        file: BoxItem,
        successCallback: Function,
        task: { id: string },
    }): void {
        this.errorCode = ERROR_CODE_DELETE_TASK;

        this.delete({
            id: file.id,
            url: this.getUrlForTask(task.id),
            successCallback,
            errorCallback,
        });
    }

    getTasksForFile({
        errorCallback,
        file,
        successCallback,
    }: {
        errorCallback: ElementsErrorCallback,
        file: { id: string },
        successCallback: Function,
    }): void {
        this.errorCode = ERROR_CODE_FETCH_TASKS;
        this.get({
            id: file.id,
            url: this.getUrlForFileTasks(file.id),
            successCallback,
            errorCallback,
        });
    }

    getTask({
        errorCallback,
        file,
        id,
        successCallback,
    }: {
        errorCallback: ElementsErrorCallback,
        file: { id: string },
        id: string,
        successCallback: Function,
    }): void {
        this.errorCode = ERROR_CODE_FETCH_TASKS;
        this.get({
            id: file.id,
            url: this.getUrlForTask(id),
            successCallback,
            errorCallback,
        });
    }
}

export default TasksNew;
