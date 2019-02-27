/**
 * @flow
 * @file Helper for the box Task Assignments API
 * @author Box
 */

import Base from './Base';
import { ERROR_CODE_CREATE_TASK_LINK } from '../constants';

// microservices need different headers than other APIs
const headers = {
    Accept: 'application/json;version=1',
    'Content-Type': 'application/vnd.box+json;version=v2',
};

class TaskLinks extends Base {
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
