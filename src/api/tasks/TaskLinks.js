/**
 * @flow
 * @file Helper for the box TaskLinks API
 * @author Box
 */

import TasksBase from './TasksBase';
import { ERROR_CODE_CREATE_TASK_LINK } from '../../constants';
import type { ElementsXhrError } from '../../common/types/api';
import type { BoxItem } from '../../common/types/core';

class TaskLinks extends TasksBase {
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
