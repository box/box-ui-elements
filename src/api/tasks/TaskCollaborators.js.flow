/**
 * @flow
 * @file Helper for the box Task Collaborators API
 * @author Box
 */
import omit from 'lodash/omit';

import TasksBase from './TasksBase';
import {
    ERROR_CODE_FETCH_TASK_COLLABORATOR,
    ERROR_CODE_CREATE_TASK_COLLABORATOR,
    ERROR_CODE_UPDATE_TASK_COLLABORATOR,
    ERROR_CODE_DELETE_TASK_COLLABORATOR,
    API_PAGE_LIMIT,
} from '../../constants';
import type { ElementsErrorCallback } from '../../common/types/api';
import type { BoxItem } from '../../common/types/core';

class TaskCollaborators extends TasksBase {
    getUrlForTaskCollaborators(taskId: string): string {
        return `${this.getBaseApiUrl()}/undoc/tasks/${taskId}/task_collaborators?role=ASSIGNEE&limit=${API_PAGE_LIMIT}`;
    }

    getUrlForTaskCollaboratorCreate(): string {
        return `${this.getBaseApiUrl()}/undoc/task_collaborators`;
    }

    getUrlForTaskCollaborator(id: string): string {
        return `${this.getBaseApiUrl()}/undoc/task_collaborators/${id}`;
    }

    getUrlForTaskGroupCreate(): string {
        return `${this.getBaseApiUrl()}/undoc/task_collaborators/expand_group`;
    }

    createTaskCollaborator({
        errorCallback,
        file,
        successCallback,
        task,
        user,
    }: {
        errorCallback: ElementsErrorCallback,
        file: BoxItem,
        successCallback: Function,
        task: { id: string },
        user: { id: string },
    }): void {
        this.errorCode = ERROR_CODE_CREATE_TASK_COLLABORATOR;

        const requestData = {
            data: {
                task: {
                    type: 'task',
                    id: task.id,
                },
                target: {
                    type: 'user',
                    id: user.id,
                },
            },
        };

        this.post({
            id: file.id,
            url: this.getUrlForTaskCollaboratorCreate(),
            data: { ...requestData },
            successCallback,
            errorCallback,
        });
    }

    createTaskCollaboratorsforGroup({
        errorCallback,
        file,
        successCallback,
        task,
        group,
    }: {
        errorCallback: ElementsErrorCallback,
        file: BoxItem,
        group: { id: string },
        successCallback: Function,
        task: { id: string },
    }): void {
        this.errorCode = ERROR_CODE_CREATE_TASK_COLLABORATOR;

        const requestData = {
            data: {
                task: {
                    type: 'task',
                    id: task.id,
                },
                target: {
                    type: 'group',
                    id: group.id,
                },
            },
        };

        this.post({
            id: file.id,
            url: this.getUrlForTaskGroupCreate(),
            data: { ...requestData },
            successCallback,
            errorCallback,
        });
    }

    getTaskCollaborators({
        errorCallback,
        file,
        successCallback,
        task,
    }: {
        errorCallback: ElementsErrorCallback,
        file: { id: string },
        successCallback: Function,
        task: { id: string },
    }): void {
        this.errorCode = ERROR_CODE_FETCH_TASK_COLLABORATOR;
        const url = this.getUrlForTaskCollaborators(task.id);
        this.get({ id: file.id, successCallback, errorCallback, url });
    }

    updateTaskCollaborator({
        errorCallback,
        file,
        successCallback,
        taskCollaborator,
    }: {
        errorCallback: ElementsErrorCallback,
        file: BoxItem,
        successCallback: Function,
        taskCollaborator: { id: string },
    }): void {
        this.errorCode = ERROR_CODE_UPDATE_TASK_COLLABORATOR;

        const requestData = {
            data: omit(taskCollaborator, 'id'),
        };

        this.put({
            id: file.id,
            url: this.getUrlForTaskCollaborator(taskCollaborator.id),
            data: { ...requestData },
            successCallback,
            errorCallback,
        });
    }

    deleteTaskCollaborator({
        errorCallback,
        file,
        successCallback,
        taskCollaborator,
    }: {
        errorCallback: ElementsErrorCallback,
        file: BoxItem,
        successCallback: Function,
        taskCollaborator: { id: string },
    }): void {
        this.errorCode = ERROR_CODE_DELETE_TASK_COLLABORATOR;

        this.delete({
            id: file.id,
            url: this.getUrlForTaskCollaborator(taskCollaborator.id),
            successCallback,
            errorCallback,
        });
    }
}

export default TaskCollaborators;
