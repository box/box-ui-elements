/**
 * @flow
 * @file Helper for the box Task Assignments API
 * @author Box
 */

import Base from './Base';
import { ERROR_CODE_CREATE_TASK_LINK } from '../constants';

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
            data: { ...requestData },
            successCallback,
            errorCallback,
        });
    }
}

export default TaskLinks;
