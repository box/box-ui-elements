/**
 * @flow
 * @file Helper for the box Task Assignments API
 * @author Box
 */

import Base from './Base';
import { ERROR_CODE_CREATE_TASK_LINK } from '../constants';

// For some reason the microservices need different headers than other APIs
const headers = {
    Accept: 'application/json;version=1',
    'Content-Type': 'application/json;version=1', // TODO: may need vendor header
};

class TaskLinks extends Base {
    // Root route only works on Box internal dev env
    getBaseApiUrl(): string {
        return '/api/2.0';
    }

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
            data: { ...requestData, headers },
            successCallback,
            errorCallback,
        });
    }
}

export default TaskLinks;
