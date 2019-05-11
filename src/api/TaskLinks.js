/**
 * @flow
 * @file Helper for the box Task Assignments API
 * @author Box
 */

import Base from './Base';
import {
    ERROR_CODE_CREATE_TASK_LINK,
    HTTP_STATUS_CODE_INTERNAL_SERVER_ERROR,
    HTTP_STATUS_CODE_NOT_IMPLEMENTED,
    HTTP_STATUS_CODE_BAD_GATEWAY,
    HTTP_STATUS_CODE_SERVICE_UNAVAILABLE,
    HTTP_STATUS_CODE_GATEWAY_TIMEOUT,
} from '../constants';

class TaskLinks extends Base {
    retryableStatusCodes = [
        HTTP_STATUS_CODE_INTERNAL_SERVER_ERROR,
        HTTP_STATUS_CODE_NOT_IMPLEMENTED,
        HTTP_STATUS_CODE_BAD_GATEWAY,
        HTTP_STATUS_CODE_SERVICE_UNAVAILABLE,
        HTTP_STATUS_CODE_GATEWAY_TIMEOUT,
    ];

    getUrlForTaskLinkCreate(): string {
        return `${this.getBaseApiUrl()}/undoc/task_links`;
    }

    createTaskLink({
        errorCallback,
        file,
        successCallback,
        task,
    }: {
        errorCallback: (e: ElementsXhrError, code: string) => void,
        file: BoxItem,
        successCallback: Function,
        task: { id: string },
    }): void {
        this.errorCode = ERROR_CODE_CREATE_TASK_LINK;

        const requestData = {
            data: {
                target: {
                    id: file.id,
                    type: 'file',
                },
                task: {
                    id: task.id,
                    type: 'task',
                },
            },
        };

        this.post({
            id: file.id,
            url: this.getUrlForTaskLinkCreate(),
            data: { ...requestData },
            successCallback,
            errorCallback,
        });
    }
}

export default TaskLinks;
